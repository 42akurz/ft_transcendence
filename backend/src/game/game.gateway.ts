import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { UsersService } from '../users/users.service';
import { GameService } from './game.service';

import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { GameData } from './game.entity';
import { User } from 'src/users/users.entity';

@WebSocketGateway({
	cors: {
		origin: '*',
	},
	namespace: '/game'
})
export class GameGateway {
	@WebSocketServer()
	server: Server;

	constructor(
		private readonly usersService: UsersService,
		private readonly gameService: GameService,
	) {}

	logger: Logger = new Logger(GameGateway.name)
	
	async handleConnection(@ConnectedSocket() client: Socket) {
		this.logger.log('auth token in game: ' +  client.handshake.headers.authorization)
		const user = await this.gameService.validateToken(client);
		if (!user)
			return ;
		this.logger.log('client connected to game with token: ' + client.handshake.headers.authorization);
		client.data.user = user;
	}
	
	// when user disconnects kick him out of waiting room
	// if hes in game give win to other player
	handleDisconnect(@ConnectedSocket() client: Socket) {
		const userId: number = Number(client.handshake.headers.authorization);
		const gameKey: number = this.gameService.findGameKeyByPlayerID(userId);
		if (!gameKey)
			return ;

		if (this.gameService.gameIsWaitingForPlayer(gameKey)) {
			this.gameService.deleteGame(gameKey);
			return ;
		}
		this.gameService.exitGame(userId, gameKey);
		client.broadcast.to(gameKey.toString()).emit('oponentLeft');
	}

	@SubscribeMessage('startGame')
	async startGame(@MessageBody() gameKey: number, @ConnectedSocket() client: Socket) {
		const userId: number = Number(client.handshake.headers.authorization);
		const gameRoom: GameData | undefined = this.gameService.gameRooms.get(gameKey);
		if (!gameRoom)
			return ;
		else if (gameRoom.userLeftSideID === userId || gameRoom.userRightSideID === userId) {
			const readyUsers: number[] | undefined = this.gameService.gameKeyToReadyPlayers.get(gameKey)
			if (!readyUsers) {
				console.log('first user ready')
				this.gameService.gameKeyToReadyPlayers.set(gameKey, [userId])
			}
			else if (readyUsers.some(id => id !== userId)) {
				console.log('second user ready')
				this.gameService.startGame(client, gameKey);
				this.gameService.gameKeyToReadyPlayers.delete(gameKey);
			}
		}
	}

	@SubscribeMessage('searchGame')
	searchGame(@MessageBody() specialActions: boolean, @ConnectedSocket() client: Socket) {
		const userId: number = Number(client.handshake.headers.authorization);
		const userIsInGame: number = this.gameService.findGameKeyByPlayerID(userId);
		if (userIsInGame) // maybe throw exception instead
			this.gameService.deleteGame(userIsInGame)
		const gameKey: number = this.gameService.findKeyOfAvailableGame(specialActions);
		if (gameKey) {
			const roomIdentifier: string = this.gameService.joinGameInstance(gameKey, userId);
			client.join(roomIdentifier);
			client.nsp.to(roomIdentifier).emit('foundGame', gameKey);
		}
		else {
			const roomIdentifier: string = this.gameService.createGameInstance(userId, specialActions);
			client.join(roomIdentifier);
			client.nsp.to(client.id).emit('createdGame');
		}
	}

	@SubscribeMessage('pauseGame')
	pauseGame(@ConnectedSocket() client: Socket) {
		const userId: number = Number(client.handshake.headers.authorization);
		const gameKey: number = this.gameService.findGameKeyByPlayerID(userId);
		if (this.gameService.userIsSpectator(gameKey, userId))
			return ;
		this.gameService.pauseGame(gameKey);
		client.nsp.to(gameKey.toString()).emit('paused');
	}

	// add counter
	@SubscribeMessage('resumeGame')
	async resumeGame(@ConnectedSocket() client: Socket) {
		const userId: number = Number(client.handshake.headers.authorization);
		const gameKey: number = this.gameService.findGameKeyByPlayerID(userId);
		if (this.gameService.userIsSpectator(gameKey, userId))
			return ;
		this.gameService.resumeGame(client, gameKey);
		client.nsp.to(gameKey.toString()).emit('unpaused');
	}

	@SubscribeMessage('exitGame')
	async exitGame(@ConnectedSocket() client: Socket) {
		const userId: number = Number(client.handshake.headers.authorization);
		const gameKey: number | undefined = this.gameService.findGameKeyByPlayerID(userId);
		if (!gameKey)
			return ;
		if (this.gameService.userIsSpectator(gameKey, userId))
			return ;
		
		const otherUserId: number = this.gameService.getOtherPlayerID(gameKey, userId);
		const allClients: any[] = await this.server.fetchSockets()
		const otherClient: Socket | undefined = allClients.find(client => Number(client.handshake.headers.authorization) == otherUserId);
		if (!otherClient)
			return ;
		
		await this.gameService.exitGame(userId, gameKey);
		client.broadcast.to(gameKey.toString()).emit('oponentLeft', otherUserId);
		
		client.leave(gameKey.toString());
		otherClient.leave(gameKey.toString());
	}

	@SubscribeMessage('movePaddleUp')
	async rightPaddleUp(@ConnectedSocket() client: Socket) {
		const userId: number = Number(client.handshake.headers.authorization);
		const gameKey: number = this.gameService.findGameKeyByPlayerID(userId);
		if (this.gameService.userIsSpectator(gameKey, userId))
			return ;
		this.gameService.movePedal(gameKey, userId, 'up')
	}
	
	@SubscribeMessage('movePaddleDown')
	async rightPaddleDown(@ConnectedSocket() client: Socket) {
		const userId: number = Number(client.handshake.headers.authorization);
		const gameKey: number = this.gameService.findGameKeyByPlayerID(userId);
		if (this.gameService.userIsSpectator(gameKey, userId))
			return ;
		this.gameService.movePedal(gameKey, userId, 'down')
	}

	@SubscribeMessage('showGames')
	showGames(@ConnectedSocket() client: Socket): Array<Object> {
		const allGames: Array<GameData> = Array.from( this.gameService.gameRooms.values() );
		const filteredGames: Array<GameData> = allGames.filter(game => game.userLeftSideID && game.userRightSideID);
		let gamePlayers: Array<Object> = [];
		filteredGames.forEach(game => gamePlayers.push({
			userLeftSideID: game.userLeftSideID,
			userRightSideID: game.userRightSideID
		}))
		return gamePlayers
	}

	@SubscribeMessage('spectateGame')
	async spectateGame(@MessageBody() gameKey: number, @ConnectedSocket() client: Socket) {
		const userId: number = Number(client.handshake.headers.authorization);
		const roomIdentifier: string = this.gameService.spectateGameInstance(gameKey, userId)
		client.join(roomIdentifier);
		return gameKey;
	}

	@SubscribeMessage('showAvailableUsers')
	async showAvailableUsers(@ConnectedSocket() client: Socket) {
		const userId: number = Number(client.handshake.headers.authorization);
		const users: User[] = await this.usersService.findAllOnlineUsers();
		return users.filter(user => user.id !== userId);
	}

	@SubscribeMessage('sendGameInvitation')
	async sendGameInvitation(@MessageBody() userId: number, @ConnectedSocket() client: Socket) {
		const senderId: number = Number(client.handshake.headers.authorization);

		const allClients: any[] = await this.server.fetchSockets()
		const receivingClient: Socket | undefined = allClients.find(client => Number(client.handshake.headers.authorization) == userId);
		if (receivingClient === undefined)
			return ;
		
		client.nsp.to(receivingClient.id).emit('receivedInvitaion', senderId);
		client.nsp.to(receivingClient.id).emit('receivedGameInvitaion', senderId);
	}

	@SubscribeMessage('acceptGameInvite')
	async acceptInvitation(@MessageBody() inviterId: number, @ConnectedSocket() client: Socket) {
		const receiverId: number = Number(client.handshake.headers.authorization);
		const allClients: any[] = await this.server.fetchSockets()
		const inviterClient: Socket | undefined = allClients.find(client => Number(client.handshake.headers.authorization) == inviterId);
		if (!inviterClient)
			return ;

		const roomIdentifier: string = this.gameService.createGameInstance(inviterId, false);
		const gameKey: number = Number(roomIdentifier);

		this.gameService.joinGameInstance(gameKey, receiverId);

		client.join(roomIdentifier);
		inviterClient.join(roomIdentifier);

		client.nsp.to(roomIdentifier).emit('redirectToGame', gameKey);
	}

	@SubscribeMessage('fetchPlayers')
	async fetchPlayers(@MessageBody() gameKey: number): Promise<Object | void> {
		return await this.gameService.getPlayersByGameKey(gameKey);
	}
}

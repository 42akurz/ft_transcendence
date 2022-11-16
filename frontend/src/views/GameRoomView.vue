<template>
	<div class="wrapper">
		<GamePauseMenu
			v-if="gameIsPaused && socket"
			@resumeGame="resumeGame"
			@exitGame="exitGame"
		/>
		<GameResult
			v-if="gameResult && socket"
			:message="gameResult"
			@goToLobby="gameOver"
		/>
		<GamePlayers
			v-if="players.playerLeft && players.playerRight && socket"
			:playerLeft="players.playerLeft"
			:playerRight="players.playerRight"
		/>
		<GameScore
			v-if="gameData && gameData.score && socket"
			:score="gameData.score"
		/>
		<div class="options" v-if="!gameData">
			<div v-if="countdown">Game starts in: {{countdown}}</div>
		</div>
		<div class="canvas">
			<canvas width="750" height="585" id="game"></canvas>
		</div>
	</div>
</template>

<script setup>
	import { computed, onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
	import store from '@/store/index.js';
	import GamePauseMenu from '@/components/GamePauseMenu.vue'
	import GameScore from '@/components/GameScore.vue'
	import GamePlayers from '@/components/GamePlayers.vue'
	import GameResult from '@/components/GameResult.vue'
	import { useRouter } from 'vue-router';
	
	const router = useRouter()

	const canvas = ref(null);
	const context = ref(null);
	
	const gameData = ref(null);

	const eitherPlayerExited = ref(false);

	// gameData.value = {
	// 	"userLeftSideID": 2,
	// 	"specialAction": false,
	// 	"spectatorsID": [],
	// 	"userRightSideID": 1,
	// 	"canvasHeight": 585,
	// 	"canvasWidth": 750,
	// 	"grid": 15,
	// 	"paddleHeight": 75,
	// 	"maxPaddleY": 495,
	// 	"paddleSpeed": 20,
	// 	"ballSpeed": 0.2,
	// 	"wallColor": "black",
	// 	"backgroundColor": "#EFEFEF",
	// 	"gameLoopIntervalID": {
	// 		"_idleTimeout": 1,
	// 		"_idlePrev": null,
	// 		"_idleNext": null,
	// 		"_idleStart": 252148,
	// 		"_repeat": 1,
	// 		"_destroyed": false
	// 	},
	// 	"leftPaddle": {
	// 		"x": 30,
	// 		"y": 255,
	// 		"width": 15,
	// 		"height": 75,
	// 		"velocity": 0,
	// 		"color": "black"
	// 	},
	// 	"rightPaddle": {
	// 		"x": 705,
	// 		"y": 255,
	// 		"width": 15,
	// 		"height": 75,
	// 		"velocity": 0,
	// 		"color": "black"
	// 	},
	// 	"ball": {
	// 		"x": 464.9333625609796,
	// 		"y": 382.4333625609796,
	// 		"width": 15,
	// 		"height": 15,
	// 		"resetting": false,
	// 		"velocityY": 0.2718891787058107,
	// 		"velocityX": 0.2718891787058107,
	// 		"color": "#185ADB"
	// 	},
	// 	"score": {
	// 		"limit": 10,
	// 		"left": 4,
	// 		"right": 5
	// 	}
	// }

	const gameIsPaused = ref(false);
	const gameResult = ref('');

	const countdown = ref(0);

	const players = ref({
		playerLeft: null,
		playerRight: null,
	});

	// players.value = {
	// 	"playerLeft": {
	// 		"id": 2,
	// 		"loginName": "hntest1",
	// 		"username": "hntest1",
	// 		"profileId": "111952",
	// 		"twoFactorAuthenticationSecret": null,
	// 		"isTwoFactorAuthenticationEnabled": false,
	// 		"currentHashedRefreshToken": "$2b$10$AfwWEx3zuOpFJTuulPzkjudptMKg23K.QZHG9nQrLKhewT.lh5TSm",
	// 		"profilePictureURL": null,
	// 		"avatarId": 1,
	// 		"status": 1,
	// 		"rank": 0,
	// 		"wins": 0,
	// 		"loses": 0,
	// 		"chatRoom": [],
	// 		"roomAdmin": [],
	// 		"friends": [],
	// 		"receivedFriendRequests": [],
	// 		"sendFriendRequests": [],
	// 		"bannedRooms": [],
	// 		"blockedUsers": [],
	// 		"blockedFromUsers": [],
	// 		"roomMutedUsers": [],
	// 		"matchHistory": []
	// 	},
	// 	"playerRight": {
	// 		"id": 1,
	// 		"loginName": "akurz",
	// 		"username": "akurz",
	// 		"profileId": "83420",
	// 		"twoFactorAuthenticationSecret": null,
	// 		"isTwoFactorAuthenticationEnabled": false,
	// 		"currentHashedRefreshToken": "$2b$10$1x/xyzEJMqVjtXTuDIj.aeCkefwPjde8Ba0npN91A1uF5SxKRjnqG",
	// 		"profilePictureURL": "https://cdn.intra.42.fr/users/9f3ad9875c70026b63fd7d570fd81098/akurz.jpg",
	// 		"avatarId": 1,
	// 		"status": 1,
	// 		"rank": 0,
	// 		"wins": 0,
	// 		"loses": 0,
	// 		"chatRoom": [],
	// 		"roomAdmin": [],
	// 		"friends": [],
	// 		"receivedFriendRequests": [],
	// 		"sendFriendRequests": [],
	// 		"bannedRooms": [],
	// 		"blockedUsers": [],
	// 		"blockedFromUsers": [],
	// 		"roomMutedUsers": [],
	// 		"matchHistory": []
	// 	}
	// }


	/* COMPUTED */
	const currentUser = computed(() => {
		return store.getters.getCurrentUser;
	})

	const socket = computed(() => {
		return store.getters.getSocketGame;
	})

	const currentGameKey = computed(() => {
		return store.getters.getCurrentGameKey;
	})

	const currentGameRole = computed(() => {
		return store.getters.getCurrentGameRole;
	})
	/* COMPUTED */



	const drawBackground = (width, height, color) => {
		context.value.fillStyle = color;
		context.value.fillRect(0, 0, width, height);
	}

	const drawWalls = (width, height, color) => {
		context.value.fillStyle = color;
		context.value.fillRect(0, 0, width, gameData.value.grid);
		context.value.fillRect(0, height - gameData.value.grid, width, height);
	}

	const drawPaddle = (x, y, width, height, color) => {
		context.value.fillStyle = color;
		context.value.fillRect(x, y, width, height);
		context.value.fillRect(x, y, width, height);
	}

	const drawBall = (x, y, radius, color) => {
		context.value.fillStyle = color;
		context.value.strokeStyle = color;
		context.value.arc(x + radius, y + radius, radius, 0, 2 * Math.PI);
		context.value.fill();
		context.value.beginPath();
		context.value.stroke();
	}

	const drawGame = () => {
		context.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
		drawBackground(canvas.value.width, canvas.value.height, gameData.value.backgroundColor);
		drawPaddle(gameData.value.leftPaddle.x, gameData.value.leftPaddle.y, gameData.value.leftPaddle.width, gameData.value.leftPaddle.height, gameData.value.leftPaddle.color);
		drawPaddle(gameData.value.rightPaddle.x, gameData.value.rightPaddle.y, gameData.value.rightPaddle.width, gameData.value.rightPaddle.height, gameData.value.rightPaddle.color);
		drawBall(gameData.value.ball.x, gameData.value.ball.y, gameData.value.ball.width / 2, gameData.value.ball.color);
		drawWalls(canvas.value.width, canvas.value.height, gameData.value.wallColor);
	}

	const initCanvas = () => {
		canvas.value = document.getElementById('game');
		context.value = canvas.value.getContext('2d');
	}

	const resumeGame = () => {
		socket.value.emit('resumeGame')
	}

	const exitGame = () => {
		socket.value.emit('exitGame')
		resetAllGameData();
		gameOver();
	}

	const pauseGame = () => {
		socket.value.emit('pauseGame');
	}

	const resetAllGameData = () => {
		countdown.value = 0;
		gameIsPaused.value = false;
		gameData.value = null;
		gameResult.value = '';
		context.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
	}

	const startGame = () => {
		socket.value.emit('startGame', currentGameKey.value)
	}

	const fetchPlayers = () => {
		socket.value.emit('fetchPlayers', currentGameKey.value, (newPlayers) => {
			players.value = newPlayers;
		})
	}

	const gameOver = () => {
		eitherPlayerExited.value = true;
		goToLobby();
	}

	const goToLobby = () => {
		router.push('gamelobby')
	}

	const keyhooks = (e) => {
		if (!countdown.value) {
			switch (e.key) {
				case 'ArrowUp':
					socket.value.emit('movePaddleUp')
					break;
				case 'ArrowDown':
					socket.value.emit('movePaddleDown')
					break;
				case 'p':
					pauseGame();
					break;
			}
		}
	}

	const resetCurrentGameData = () => {
		store.commit('setCurrentGameKey', 0)
		store.commit('setCurrentGameRole', '')
	}

	onBeforeMount(async () => {
		await store.dispatch('fetchCurrentUser');

		if (!currentUser.value) {
			router.push('/');
			return ;
		}

		if (!socket.value) {
			router.push('gamelobby');
			return ;
		}

		initCanvas();

		socket.value.on('paused', () => {
			gameIsPaused.value = true;
		})

		socket.value.on('unpaused', () => {
			gameIsPaused.value = false;
		})

		socket.value.on('updateGame', (newGameData) => {
			gameData.value = newGameData;
			drawGame();
		})

		socket.value.on('countdown', (counter) => {
			countdown.value = counter;
			gameResult.value = '';
		})

		socket.value.on('killCountdown', () => {
			countdown.value = 0;
		})

		socket.value.on('playerWins', ({winnerId, loserId}) => {
			resetAllGameData();
			if (winnerId === currentUser.value.id)
				gameResult.value = 'Win';
			else if (loserId === currentUser.value.id)
				gameResult.value = 'Lose';
			else
				gameResult.value = 'Game Over';
		})

		socket.value.on('oponentLeft', (winnerId) => {
			resetAllGameData();
			if (winnerId === currentUser.value.id)
				gameResult.value = 'Oponent left.\nYou Win 3:0';
			else
				gameResult.value = 'A Player quit';
		})
	})

	const turnOffSocketListeners = () => {
		if (socket.value) {
			socket.value.off('oponentLeft');
			socket.value.off('playerWins');
			socket.value.off('killCountdown');
			socket.value.off('countdown');
			socket.value.off('updateGame');
			socket.value.off('unpaused');
			socket.value.off('paused');
		}
	}

	onMounted(() => {
		if (!socket.value) {
			router.push('gamelobby');
			return ;
		}


		fetchPlayers();

		if (currentGameRole.value === 'player') {
			startGame();
			document.addEventListener('keydown', keyhooks)
		}
	})

	onUnmounted(() => {
		resetCurrentGameData();

		turnOffSocketListeners();

		document.removeEventListener('keydown', keyhooks)

		if (currentGameRole.value === 'player' && !eitherPlayerExited.value) {
			console.log('player')
			exitGame();
		}
		else if (currentGameRole.value === 'spectator') {
			console.log('spectator')
		}
	})
</script>

<style scoped>
	.wrapper {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: 5vh 0;
	}

	.canvas {
		margin-top: 40px;
	}

	.rows {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 5px;
		justify-content: center;
		padding: 5px;
	}

	.row-item {
		flex-grow: 1;
		border: 1px solid black;
	}
</style>
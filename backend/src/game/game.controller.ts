import { GameService } from './game.service';
import {
	Controller,
	Get,
	UseGuards,
} from '@nestjs/common';
import JwtTwoFactorGuard from 'src/auth/twoFactor/twoFactor.guard';
import { GameData } from './game.entity';

import { GameGateway } from './game.gateway';

@Controller('game')
export class GameController {
	constructor(
		private readonly gameService: GameService,
		private readonly gameGateway: GameGateway
	){}

	@Get('all')
	@UseGuards(JwtTwoFactorGuard)
	getAll(): number[] {
		return Array.from(this.gameService.gameRooms.keys());
	}

	// @Get('sockets/all')
	// @UseGuards(JwtTwoFactorGuard)
	// getAllSockets(): number[] {
	// 	return this.gameGateway.server.fetchSockets();
	// }
}

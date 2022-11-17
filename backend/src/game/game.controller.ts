import { GameService } from './game.service';
import {
	Controller,
	Get,
	UseGuards,
} from '@nestjs/common';
import JwtTwoFactorGuard from 'src/auth/twoFactor/twoFactor.guard';
import { GameGateway } from './game.gateway';

@Controller('game')
export class GameController {
	constructor(
		private readonly gameService: GameService,
	){}

	@Get('all')
	@UseGuards(JwtTwoFactorGuard)
	getAll(): number[] {
		return Array.from(this.gameService.gameRooms.keys());
	}
}

import { ScoreService } from './score.service';
import { Score } from './score.entity';
import { Controller, Get, Post, Body, HttpCode, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import JwtTwoFactorGuard from 'src/auth/twoFactor/twoFactor.guard';

@Controller('score')
export class ScoreController {
	constructor(
		private readonly scoreService: ScoreService
	){}

	@Get('all')
	@UseGuards(JwtTwoFactorGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	async getAll():Promise<Score[]>{
		return await this.scoreService.findAll();
	}

	@Post('add')
	@HttpCode(201)
	@UseGuards(JwtTwoFactorGuard)
	async addScore(@Body() score: Score, userId: number, user2Id: number): Promise<Score> {
		return await this.scoreService.addScore(score, userId, user2Id);
	}
}

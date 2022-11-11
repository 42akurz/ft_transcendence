import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Score } from '../scoreboard/score.entity'
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { UsersModule } from 'src/users/users.module';
import { ScoreModule } from 'src/scoreboard/score.module';
import { GameController } from './game.controller';

@Module({
	imports: [
		UsersModule,
		ScoreModule,
		TypeOrmModule.forFeature([Score])
	],
	providers: [GameService, GameGateway],
	exports: [GameService],
	controllers: [GameController]
})
export class GameModule {}
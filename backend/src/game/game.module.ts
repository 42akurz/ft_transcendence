import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity'
import { Score } from '../scoreboard/score.entity'
import { GameGateway } from './game.gateway';
import { UsersService } from '../users/users.service';
import { ScoreService } from '../scoreboard/score.service';
import { GameService } from './game.service';
import DatabaseFilesService from 'src/files/databaseFiles.service';
import DatabaseFile from 'src/files/databaseFile.entity';
import DatabaseFilesController from 'src/files/databaseFiles.controller';
import { UsersModule } from 'src/users/users.module';
import { ScoreModule } from 'src/scoreboard/score.module';

@Module({
	imports: [
		UsersModule,
		ScoreModule,
		TypeOrmModule.forFeature([Score])
	],
	providers: [GameService, GameGateway],
	exports: [GameService],
})
export class GameModule {}
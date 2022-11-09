import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Score } from './score.entity';

import { UsersService } from 'src/users/users.service';

import { plainToClass, plainToInstance } from 'class-transformer';
import { UserFriendsSerializer } from 'src/users/users.serializer';


@Injectable()
export class ScoreService {
	constructor(
		@InjectRepository(Score)
		private scoreRepository: Repository<Score>,
	
		private readonly usersService: UsersService,
	) {}

	logger: Logger = new Logger(ScoreService.name);

	findAll(): Promise<Score[]> {
		return this.scoreRepository.find({
			relations: [
				'matchHistoryUsers',
			]
		});
	}

	async addScore(score: Score, winnerId: number, loserId: number): Promise<Score> {
		this.logger.log('winnerId: ' + winnerId);
		this.logger.log('loserId: ' + loserId);
		const winner = await this.usersService.findById(winnerId);
		const loser = await this.usersService.findById(loserId);
		const serializedWinner = plainToClass(UserFriendsSerializer, winner, {excludeExtraneousValues: true});
		const serializedLoser = plainToClass(UserFriendsSerializer, loser, {excludeExtraneousValues: true});
		
		score.matchHistoryUsers = [];
		const newScore = this.scoreRepository.create(score);
		newScore.matchHistoryUsers = [serializedWinner, serializedLoser];
		return await this.scoreRepository.save(newScore);
	}

	// update(usertoUpdate){
	// 	this.scoreRepository.update(usertoUpdate.id,usertoUpdate);
	// }

	// delete(id){
	// 	this.scoreRepository.delete(id);
	// }
}


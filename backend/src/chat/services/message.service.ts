import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Connection, Repository, ReturningStatementNotSupportedError, Not } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Message } from '../entities/message.entity';

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(Message)
		private MessageRepository: Repository<Message>,
	) {}

	findAll(): Promise<Message[]> {
		return this.MessageRepository.find();
	}

	async create(newChat: any) {
		await this.MessageRepository.insert(newChat);
	}
}


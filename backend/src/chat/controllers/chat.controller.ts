import { Controller, Get, Post, Body, Delete, Param, HttpCode, UseGuards, UseInterceptors, Req, UploadedFile, Logger, Header, Headers, ClassSerializerInterceptor } from '@nestjs/common';

import { RoomService } from '../services/room.service';
import { UsersService } from '../../users/users.service';
import { ChatService } from '../services/chat.service';
import { ChatRoom } from '../entities/room.entity';

@Controller('chat')
export class ChatController {
	constructor(
		private readonly roomService: RoomService,
		private readonly messageService: ChatService,
		private readonly chatUserService: UsersService,
	){}

	@Get('room/:name')
	@UseInterceptors(ClassSerializerInterceptor)
	async getByName(@Param('name') name: string):Promise<ChatRoom>{
		return await this.roomService.findByName(name);
	}
	
	@Get('all')
	@UseInterceptors(ClassSerializerInterceptor)
	async getAll():Promise<ChatRoom[]>{
		return await this.roomService.findAll();
	}
}

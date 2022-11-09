import {UsersService} from './users.service';
import {User} from './users.entity';
import { Controller, Get, Post, Body, Delete, Param, HttpCode, UseGuards, UseInterceptors, Req, UploadedFile, Logger, Header, Headers, ClassSerializerInterceptor, HttpException, HttpStatus } from '@nestjs/common';
import JwtTwoFactorGuard from 'src/auth/twoFactor/twoFactor.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';
import { Express } from 'express'
import { request } from 'http';
import { Score } from 'src/scoreboard/score.entity';

@Controller('users')
export class UserController {
	constructor(private readonly usersService: UsersService){}

	@Get('all')
	@UseGuards(JwtTwoFactorGuard)

	@UseInterceptors(ClassSerializerInterceptor)
	async getAll():Promise<User[]>{
		return await this.usersService.findAll();
	}
	
	@Get('public')
	@UseGuards(JwtTwoFactorGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	async getPublic(@Req() request: RequestWithUser):Promise<User[]>{
		return await this.usersService.findAllExceptMe(request.user);
	}

	@Get('name/:username')
	@UseGuards(JwtTwoFactorGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	async getOneByUserName(@Param('username') name: string){
		return await this.usersService.findByUserName(name);
	}

	@Get('id/:userId')
	@UseGuards(JwtTwoFactorGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	async getOneById(@Param('userId') id: number){
		return await this.usersService.findById(id);
	}

	@Get('myuser')
	@UseGuards(JwtTwoFactorGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	metMyUser(@Req() request: RequestWithUser){
		return request.user;
	}

	@Post('add')
	@UseGuards(JwtTwoFactorGuard)
	@HttpCode(201)
	createUser(@Body() newUser: User){
		this.usersService.create(newUser);
	}

	@Post('update/name/:username')
	@UseGuards(JwtTwoFactorGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	async updateUserName(@Req() request: RequestWithUser, @Param('username') newUserName: string) {
		if (!await this.usersService.updateName(request.user.id, newUserName))
			throw new HttpException('Name is taken', HttpStatus.CONFLICT)
	}

	@Delete('delete/:id')
	@HttpCode(200)
	@UseGuards(JwtTwoFactorGuard)
	deleteUser(@Param('id') id){
		this.usersService.delete(id);
	}

	@Post('avatar')
	@UseGuards(JwtTwoFactorGuard)
	@UseInterceptors(FileInterceptor('file'))
	async addAvatar(@Req() request: RequestWithUser, @UploadedFile() file: Express.Multer.File) {
		return this.usersService.addAvatar(request.user.id , file.buffer, file.originalname);
	}

	@Post('friend/add/:userId')
	@UseGuards(JwtTwoFactorGuard)
	async sendFriendReqeuest(@Req() request: RequestWithUser, @Param('userId') id: number) {
		return this.usersService.sendFriendReqeuest(request.user.id, id);
	}

	@Post('friend/remove/:userId')
	@UseGuards(JwtTwoFactorGuard)
	async removeFriend(@Req() request: RequestWithUser, @Param('userId') id: number) {
		return this.usersService.removeFriend(request.user.id, id);
	}

	@Post('friend/accept/:userId')
	@UseGuards(JwtTwoFactorGuard)
	async acceptFriendReqeuest(@Req() request: RequestWithUser, @Param('userId') id: number) {
		return this.usersService.acceptFriendReqeuest((<User>request.user).id, id);
	}

	@Post('friend/decline/:userId')
	@UseGuards(JwtTwoFactorGuard)
	async declineFriendReqeuest(@Req() request: RequestWithUser, @Param('userId') id: number) {
		return this.usersService.declineFriendReqeuest((<User>request.user).id, id);
	}

	@Post('friend/retrieve/:userId')
	@UseGuards(JwtTwoFactorGuard)
	async retrieveFriendReqeuest(@Req() request: RequestWithUser, @Param('userId') id: number) {
		return this.usersService.retrieveFriendReqeuest((<User>request.user).id, id);
	}

	@Post('block/:userId')
	@UseGuards(JwtTwoFactorGuard)
	async blockUser(@Req() request: RequestWithUser, @Param('userId') id: number) {
		return this.usersService.blockUser((<User>request.user).id, id);
	}

	@Post('unblock/:userId')
	@UseGuards(JwtTwoFactorGuard)
	async unblockUser(@Req() request: RequestWithUser, @Param('userId') id: number) {
		return this.usersService.unblockUser((<User>request.user).id, id);
	}

	@Post('update/status/:number')
	@UseGuards(JwtTwoFactorGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	async changeStatus(@Req() request: RequestWithUser, @Param('number') status: number) {
		return await this.usersService.setStatus(status, request.user.id);
	}

	// @Get('/:id/matches/:limit')
	// @UseGuards(JwtTwoFactorGuard)
	// async getMatchHistory(@Param('id') id: number, @Param('limit') limit: number): Promise<Score[]> {
	// 	if (limit > 100)
	// 		throw new HttpException('limit to big', HttpStatus.UNPROCESSABLE_ENTITY)
	// 	const history = await this.usersService.getMatchHistory(id, limit);
	// 	return history
	// }
}

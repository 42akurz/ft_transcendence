import { Exclude } from 'class-transformer';
import DatabaseFile from 'src/files/databaseFile.entity';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, ManyToOne, AfterLoad, AfterInsert, AfterUpdate } from 'typeorm';
import { ChatRoom } from './room.entity';

@Entity()
export class Message {

	@PrimaryGeneratedColumn()
	id: number;
	
	@Column()
	fromId: number;

	@Column()
	fromName: string;

	@Column()
	text: string;

	@Column()
	timestamp: string;

	@ManyToOne(() => ChatRoom, chatRoom => chatRoom.messages, {onDelete: "SET NULL"})
	chatRoom: ChatRoom;
}
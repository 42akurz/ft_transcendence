<template>
	<main class="main">
		<div class="main__messages">
			<!-- {{typingDisplay}} -->
			<div class="message"  v-for="message in currentRoom.messages" :key="message" :class="{ blue_text: message.fromName === 'ChatBot', align_right: message.fromName === currentUser.username }">
				<div class="message__name">[{{message.fromName}}]</div>
				<div class="text">{{message.text}}</div>
			</div>
		</div>
		<div class="main__users" v-if="currentRoom && currentUser">
			<div class="main__members">
				<div class="member" v-for="member in currentRoom.chatUser" :key="member">
					<!-- {{member.username}} -->
					<BaseCardUser :data="member"/>
					<DropdownChatAdmin
						v-if="adminButtonConditions(member.username)"
						@makeAdmin="makeAdmin(member.id)"
						@banUser="banUser(member.id)"
						@muteUser="showMutePopup(member.id)"
					/>
					
					<!-- <button v-if="adminButtonConditions(member.username)" @click="makeAdmin(member.id)">Admin</button>
					<button v-if="adminButtonConditions(member.username)" @click="banUser(member.id)">Ban</button>
					<button v-if="adminButtonConditions(member.username)" @click="showMutePopup(member.id)">Mute</button> -->
					<!-- <button @click="muteUser(member.username)">Mute</button> -->
				</div>
			</div>
			<h3 v-if="currentRoom.access !== 'private'">Banned Users</h3>
			<div v-if="currentRoom.access !== 'private'" class="main__banned">
				<div class="member" v-for="member in currentRoom.bannedUsers" :key="member">
					<BaseCardUser :data="member"/>
					<button v-if="adminButtonConditions(member.username)" @click="unbanUser(member.id)">unban</button>
				</div>
			</div>
			<button
				v-if="currentRoom.access === 'private'"
				style="margin-top: 20px;"
				@click="sendGameInvite">
				Send Game Invite
			</button>
		</div>
		<PopupNumber
			:visible="showPopupNumber"
			:info="'time to Mute in Minutes'"
			:confirmButtonText="'Mute'"
			@confirmed="muteUser(userIdImTryingToMute, $event)"
			@canceled="hidePopup"
		/>
	</main>
</template>

<script setup>
	import store from '@/store/index.js';
	import { computed, ref } from 'vue'
	import BaseCardUser from '@/components/BaseCardUser'
	import PopupNumber from '@/components/PopupNumber'
	import DropdownChatAdmin from '@/components/DropdownChatAdmin'


	const userIdImTryingToMute = ref(0);
	const showPopupNumber = ref(false);

	/* PROPS */
	const props = defineProps({
		currentRoom: {
			type: Object,
			required: true
		},
	})
	/* PROPS */


	/* COMPUTED */
	const currentUser = computed(() => {
		return store.getters.getCurrentUser
	})

	const socket = computed(() => {
		return store.getters.getSocketChat;
	})
	/* COMPUTED */


	/* FUNCTIONS */
	const isAdmin = (room, username) => {
		const filtered = room.admins.filter((e) => {
			return e.username === username;
		})
		return filtered.length > 0;
	}

	const adminButtonConditions = (userName) => {
		if (!isAdmin(props.currentRoom, currentUser.value.username))
			return false;
		if (isAdmin(props.currentRoom, userName))
			return false;
		return true;
	}

	const showMutePopup = (userId) => {
		userIdImTryingToMute.value = userId;
		showPopupNumber.value = true;
	}

	const hidePopup = () => {
		userIdImTryingToMute.value = 0;
		showPopupNumber.value = false;
	}

	const getOtherUserInPrivateRoom = () => {
		const user = props.currentRoom.chatUser.filter(
			user => user.id !== currentUser.value.id
		)
		if (user.length !== 1)
			return undefined
		return user[0].id
	}
	/* FUNCTIONS */


	/* SOCKET ACTIONS */
	const sendGameInvite = () => {
		const receiverId = getOtherUserInPrivateRoom();
		if (!receiverId)
			return ;
		store.getters.getSocketGame.emit('sendGameInvitation', receiverId)
	}

	const banUser = (userId) => {
		socket.value.emit('banUser', {
			banUserId: userId,
			roomName: props.currentRoom.name
		})
	}

	const muteUser = (newMutedId, muteTimeInMin) => {
		socket.value.emit('muteUser', {
			newMutedId,
			roomName: props.currentRoom.name,
			muteTimeInMinutes: muteTimeInMin
		})
		hidePopup();
	}

	const unbanUser = (userId) => {
		socket.value.emit('unbanUser', {
			banUserId: userId,
			roomName: props.currentRoom.name
		})
	}

	const makeAdmin = (userId) => {
		socket.value.emit('makeAdmin', {
			newAdminId: userId,
			roomName: props.currentRoom.name
		})
	}
	/* SOCKET ACTIONS */
</script>

<style scoped>
	button {
		padding: 10px;
		background-color: rgb(28, 123, 212);
		border: 1px solid black;
		border-radius: 5px;
		color: white;
	}

	.main {
		display: flex;
	}

	.main__messages {
		overflow-y: auto;
		flex: 1;
		padding: 16px;
	}

	.main__users {
		overflow-y: auto;
		height: 100%;
		margin-left: auto;
		border-left: 1px solid white;
	}

	.member {
		padding: 16px;
		border-bottom: 1px solid white;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.message {
		text-align: left;
		padding: 16px;
	}

	.message__name {
		font-weight: 700;
	}

	.blue_text {
		color: rgb(28, 123, 212);
	}

	.align_right {
		text-align: right;
	}
</style>
<template>
	<div class="new_room">
		<input v-model="newRoomName" placeholder="new room name">
		<div v-if="roomNameErrorMessage" class="room-name-error">{{roomNameErrorMessage}}</div>
		<select v-model="newRoomState">
			<option value="public">public</option>
			<option value="protected">protected</option>
		</select>
		<input v-if="newRoomState === 'protected'" v-model="newRoomPassword" placeholder="password">
		<button @click="(newRoomName) ? createNewRoom() : roomNameError(`Name can't be blank!`)">Create</button>
	</div>
</template>

<script setup>
	import { computed, ref } from'vue';
	import  store  from '@/store/index.js';

	const roomNameErrorMessage = ref('');
	const newRoomName = ref('');
	const newRoomState = ref('public');
	const newRoomPassword = ref('');


	/* COMPUTED */
	const currentUser = computed(() => {
		return store.getters.getCurrentUser
	})

	const socket = computed(() => {
		return store.getters.getSocketChat;
	})
	/* COMPUTED */


	/* FUNCTIONS */
	const roomNameError = (errorMessage) => {
		roomNameErrorMessage.value = errorMessage;
		const timeout = setTimeout(() => {
			roomNameErrorMessage.value = ''
		}, 3000);
	}
	/* FUNCTIONS */


	/* SOCKET ACTIONS */
	const createNewRoom = () => {
		socket.value.emit('createRoom', {
				roomName: newRoomName.value,
				access: newRoomState.value,
				roomPassword: newRoomPassword.value
			}, (success) => {
				if (success)
					store.dispatch('fetchCurrentUser');
				else
					roomNameError(`Error: ${newRoomName.value} already exists`);
			}
		);
		newRoomName.value = '';
		newRoomPassword.value = '';
		newRoomState.value = 'public';
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

	.new_room {
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	input {
		outline: none;
		color: black;
	}
</style>
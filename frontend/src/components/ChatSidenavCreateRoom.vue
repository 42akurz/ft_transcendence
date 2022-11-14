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
		height: 40px;
		background-color: var(--blue-light);
		border: 1px solid white;
		border-radius: 5px;
		color: white;
		font-weight: bold;
		font-size: 14px;
		cursor: pointer;
	}

	button:hover {
		border: 1px solid var(--blue-light);
	}

	.new_room {
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	input, select {
		outline: none;
		color: black;
		padding: 5px;
		border: 1px solid black;
		border-radius: 5px;
		background-color: var(--grey);
		color: black;
	}
</style>
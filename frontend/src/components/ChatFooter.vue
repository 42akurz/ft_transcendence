<template>
	<footer class="footer">
		<input v-model="messageText" placeholder="message">
		<button @click="(messageText) ? sendMessage() : 0">Send</button>
	</footer>
</template>

<script setup>
	import { defineProps, ref, computed } from 'vue'
	import store from '@/store/index.js'

	const messageText = ref('');


	/* PROPS */
	const props = defineProps({
		roomName: {
			type: String,
			required: true
		},
		userId: {
			type: Number,
			required: true
		}
	});
	/* PROPS */


	/* COMPUTED */
	const socket = computed(() => {
		return store.getters.getSocketChat;
	})
	/* COMPUTED */


	/* FUNCTIONS */
	const findOtherUserId = (roomName) => {
		const id = roomName.replace(props.userId.toString(), '').replace('_', '');
		console.log(id);
		return Number(id);
	}
	/* FUNCTIONS */


	/* SOCKET ACTIONS */
	const sendMessage = () => {
		socket.value.emit('sendMessage', {
			roomName: props.roomName,
			receiverId: findOtherUserId(props.roomName),
			message: messageText.value,
		})
		messageText.value = '';
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

	.footer {
		display: flex;
		align-items: center;
		flex-direction: row;
		gap: 16px;
	}

	.footer input {
		flex: 1;
		padding: 8px 16px;
		outline: none;
		border: 1px solid white;
		border-radius: 5px;
	}
</style>
<template>
	<div class="invite">
		<h2>Send Invites</h2>
		<button @click="showAvailableUsers">Refresh Users</button>
		<div class="available-users" v-for="user in availableUsers" :key="user">
			<BaseCardUser
				:data="user"
				:allowPrivatePageOnClick="false"
				@click="sendGameInvitation(user.id)"
			/>
		</div>
	</div>
</template>

<script setup>
	import BaseCardUser from '@/components/BaseCardUser.vue'
	import { onBeforeMount, ref, computed } from 'vue'
	import store from '@/store/index.js'

	const availableUsers = ref([]);

	const socket = computed(() => {
		return store.getters.getSocketGame;
	})

	const showAvailableUsers = () => {
		socket.value.emit('showAvailableUsers', (users) => {
			availableUsers.value = users;
		})
	}

	const sendGameInvitation = (userId) => {
		socket.value.emit('sendGameInvitation', userId, (success) => {
			// inform user if invitation was sen or not
		})
	}

	onBeforeMount(() => {
		showAvailableUsers();
	})
</script>

<style scoped>
	button {
		width: 142px;
		height: 42px;
		cursor: pointer;

		border: 2px solid var(--blue-dark);
		background-color: var(--orange);
		color: var(--blue-dark);
		border-radius: 25px;
	}
</style>
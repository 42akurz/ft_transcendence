<template>
	<div class="wrapper">
		<GameSearch 
			@enterGame="enterGameRoom($event)"
		/>
		<div class="rows">
			<GameSpectate
				class="row-item"
			/>
			<GameInvitePlayers
				class="row-item"
			/>
			<GameInviteReceived
				class="row-item"
			/>
		</div>
	</div>
</template>

<script setup>
	import { computed, onBeforeMount } from 'vue'
	import store from '@/store/index.js';
	import GameInvitePlayers from '@/components/GameInvitePlayers.vue'
	import GameInviteReceived from '@/components/GameInviteReceived.vue'
	import GameSpectate from '@/components/GameSpectate.vue'
	import GameSearch from '@/components/GameSearch.vue'
	import { useRouter } from 'vue-router';
	
	const router = useRouter()

	/* COMPUTED */
	const socket = computed(() => {
		return store.getters.getSocketGame;
	})
	/* COMPUTED */

	const enterGameRoom = (gameKey) => {
		router.push({
			name: 'gameroom',
			params: {
				gameKey: gameKey,
				role: 'player'
			}
		});
	}

	onBeforeMount(async () => {
		await store.dispatch('fetchCurrentUser');

		// if (!currentUser.value) {
		// 	error.value = "Unauthorized"
		// 	return ;
		// }
	})
</script>

<style scoped>
	.wrapper {
		display: flex;
		flex-direction: column;
		gap: 60px;
		padding: 5vh 30px;
	}

	.rows {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 5px;
		justify-content: center;
		padding: 5px;
	}

	.row-item {
		flex-grow: 1;
		background-color: var(--grey);
		padding: 50px;
		border: 5px solid var(--blue-dark);
		border-radius: 60px;
		/* width: 400px; */
	}
</style>
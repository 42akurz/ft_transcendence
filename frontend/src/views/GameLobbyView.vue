<template>
	<div class="game-lobby-wrapper" v-if="currentUser">
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
		</div>
	</div>
</template>

<script setup>
	import { computed, onBeforeMount } from 'vue'
	import store from '@/store/index.js';
	import GameInvitePlayers from '@/components/GameInvitePlayers.vue'
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
		store.commit('setCurrentGameKey', Number(gameKey));
		store.commit('setCurrentGameRole', 'player');
		router.push('gameroom');
	}

	onBeforeMount(async () => {
		await store.dispatch('fetchCurrentUser');

		if (!currentUser.value) {
			router.push('/');
			return ;
		}
	})
</script>

<style scoped>
	.game-lobby-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 60px;
		padding: 50px;

	}

	.rows {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 25px;
		justify-content: center;
		padding: 5px;
	}

	.row-item {
		flex-grow: 1;
		background-color: var(--grey);
		padding: 50px;
		border: 5px solid var(--blue-dark);
		/* border-radius: 60px; */
		/* width: 400px; */
	}
</style>
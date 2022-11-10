<template>
	<div class="spectate">
		<h2>Spectate Game</h2>
		<button @click="showGames">Refresh Games</button>
		<div class="live-games" v-for="game in liveGames" :key="game">
			<BaseCardGameSpectate
				:gameInfo="game"
				@spectateGame="spectateGame($event)"
			/>
		</div>
	</div>
</template>

<script setup>
	import BaseCardGameSpectate from '@/components/BaseCardGameSpectate.vue'
	import { onBeforeMount, ref, computed } from 'vue'
	import store from '@/store/index.js'
	import { useRouter } from 'vue-router';
	
	const router = useRouter()

	const liveGames = ref([]);

	const socket = computed(() => {
		return store.getters.getSocketGame;
	})

	const showGames = () => {
		socket.value.emit('showGames', (games) => {
			liveGames.value = games;
		})
	}

	const spectateGame = (gameKey) => {
		socket.value.emit('spectateGame', Number(gameKey), (key) => {
			store.commit('setCurrentGameKey', key);
			store.commit('setCurrentGameRole', 'spectator');
			router.push('gameroom');
		})
	}

	onBeforeMount(() => {
		showGames();
		// liveGames.value = [
		// 	{
		// 		"userLeftSideID": 1, 
		// 		"specialAction": false, 
		// 		"spectatorsID": [], 
		// 		"userRightSideID": 1
		// 	},
		// 	{
		// 		"userLeftSideID": 1, 
		// 		"specialAction": false, 
		// 		"spectatorsID": [], 
		// 		"userRightSideID": 1
		// 	}
		// ]
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
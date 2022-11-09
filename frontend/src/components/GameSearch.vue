<template>
	<div class="options">
		<div v-if="waiting">searching game .......</div>
		<div class="switch">
			<strong>specials</strong>
			<BaseSwitch
				@checked="specials = $event"
			/>
		</div>
		<button @click="searchGame">Play</button>
	</div>
</template>

<script setup>
	import { computed, onBeforeMount, ref } from 'vue'
	import store from '@/store/index.js';
	import BaseSwitch from '@/components/BaseSwitch.vue'

	const emit = defineEmits(['enterGame'])
	
	const waiting = ref(false);
	const specials = ref(false);


	/* COMPUTED */
	const socket = computed(() => {
		return store.getters.getSocketGame;
	})
	/* COMPUTED */


	const searchGame = () => {
		socket.value.emit('searchGame', specials.value);
	}

	onBeforeMount(async () => {
		socket.value.on('createdGame', () => {
			console.log('createdGame');
			waiting.value = true;
		})

		socket.value.on('foundGame', (gameKey) => {
			console.log('foundGame')
			waiting.value = false;
			emit('enterGame', gameKey);
		})
	})
</script>

<style scoped>
	.options {
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: 40px;
	}

	.switch {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	button {
		padding: 10px;
		background-color: rgb(28, 123, 212);
		border: 1px solid black;
		border-radius: 5px;
		color: white;
		width: 100px;
		font-weight: bold;
		font-size: 22px;
		cursor: pointer;
	}
</style>
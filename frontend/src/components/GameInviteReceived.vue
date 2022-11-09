<template>
	<div class="invite">
		<h2>Game Invites</h2>
		<div class="receivedInvitation" v-for="invite in receivedInvitations" :key="invite">
			<BaseCardGameInvite
				:senderId="invite"
				@acceptInvite="acceptGameInvite($event)"
				@declineInvite="declineGameInvite($event)"
			/>
		</div>
	</div>
</template>

<script setup>
	import BaseCardGameInvite from '@/components/BaseCardGameInvite.vue'
	import { onBeforeMount, ref, computed } from 'vue'
	import store from '@/store/index.js'

	const receivedInvitations = ref([]);

	const socket = computed(() => {
		return store.getters.getSocketGame;
	})

	const acceptGameInvite = (senderId) => {
		socket.value.emit('acceptGameInvite', senderId, (success) => {
			// inform user if invitation was sen or not
		})
		receivedInvitations.value = receivedInvitations.value.filter(
			invite => invite !== senderId
		)
	}

	const declineGameInvite = (senderId) => {
		receivedInvitations.value = receivedInvitations.value.filter(
			invite => invite !== senderId
		)
	}

	onBeforeMount(() => {
		socket.value.on('receivedInvitaion', (senderId) => {
			if (!receivedInvitations.value.some(id => id == senderId))
				receivedInvitations.value.push(senderId);
		})
	})
</script>

<style scoped>

</style>
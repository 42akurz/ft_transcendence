<template>
	<aside class="sidenav">
		<div class="sidenav__tabs">
			<button @click="currentSidenavTab = 'Groups'">Groups</button>
			<button @click="currentSidenavTab = 'Private'">Private</button>
		</div>

		<ChatSidenavGroups
			v-if="currentSidenavTab === 'Groups'"
			:groupRooms="groupRooms"
		/>

		<ChatSidenavPrivate
			v-if="currentSidenavTab === 'Private'"
		/>
	</aside>
</template>

<script setup>
	import { ref } from'vue';
	import ChatSidenavGroups from '@/components/ChatSidenavGroups.vue'
	import ChatSidenavPrivate from '@/components/ChatSidenavPrivate.vue'

	const currentSidenavTab = ref('Groups');

	/* PROPS */
	const props = defineProps({
		groupRooms: {
			type: Array,
			required: true
		}
	})
	/* PROPS */
</script>

<style scoped>
	button {
		padding: 10px;
		background-color: rgb(28, 123, 212);
		border: 1px solid black;
		border-radius: 5px;
		color: white;
	}

	.sidenav {
		display: flex;
		flex-direction: column;
	}

	.sidenav__tabs {
		height: 100px;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		padding-top: 16px;
	}
</style>
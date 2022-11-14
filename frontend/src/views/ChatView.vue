<template>
	<div class="grid-container" v-if="currentUser">
		<ChatHeader
			class="header"
			v-if="currentRoom"
			:currentRoom="currentRoom"
		/>

		<ChatSidenav
			class="sidenav"
			:groupRooms="groupRooms"
		/>

		<ChatMain
			class="main"
			v-if="currentRoom"
			:currentRoom="currentRoom"
		/>

		<PopupInformation
			v-if="popupData"
			@confirmed="hidePopup"
			:visible="showInformationPopup"
			:title="popupData.title"
			:info="popupData.info"
		/>

		<ChatFooter
			class="footer"
			v-if="currentRoom"
			:roomName="currentRoom.name"
			:userId="currentUser.id"
		/>
	</div>
	<div v-else>{{error}}</div>
</template>

<script setup>
	import { computed, onBeforeMount, ref } from 'vue'
	import store from '@/store/index.js';
	import PopupInformation from '../components/PopupInformation.vue'
	import ChatFooter from '@/components/ChatFooter.vue'
	import ChatHeader from '@/components/ChatHeader.vue'
	import ChatSidenav from '@/components/ChatSidenav.vue'
	import ChatMain from '@/components/ChatMain.vue'

	const currentRoom = ref(null);
	const groupRooms = ref([]);
	const showInformationPopup = ref(false);
	const popupData = ref(null);

	const error = ref('')


	/* COMPUTED */
	const currentUser = computed(() => {
		return store.getters.getCurrentUser;
	})

	const socket = computed(() => {
		return store.getters.getSocketChat;
	})
	/* COMPUTED */


	/* SETUP && LISTENERS */
	onBeforeMount(async () => {
		await store.dispatch('fetchCurrentUser');

		if (!currentUser.value) {
			error.value = "Unauthorized"
			return ;
		}

		getGroupRooms();

		socket.value.on('refreshCurrentRoom', (roomName) => {
			if (currentRoom.value && currentRoom.value.name === roomName)
				getCurrentRoom(roomName);
		})

		socket.value.on('refreshRooms', () => {
			getGroupRooms();
		})

		socket.value.on('refreshUser', () => {
			store.dispatch('fetchCurrentUser');
		})

		socket.value.on('setCurrentRoom', (roomName) => {
			getCurrentRoom(roomName);
		})

		socket.value.on('resetCurrentRoom', (deletedRoom) => {
			if (currentRoom.value && deletedRoom === currentRoom.value.name) {
				currentRoom.value = null;
			}
		})

		socket.value.on('banned', (roomName) => {
			showPopup({
				title: 'Banned',
				info: `You have been banned from ${roomName}`,
			})
			currentRoom.value = null;
			getGroupRooms();
			store.dispatch('fetchCurrentUser');
		})

		socket.value.on('muted', (roomName) => {
			showPopup({
				title: 'Muted',
				info: `You are muted in ${roomName}`,
			})
			store.dispatch('fetchCurrentUser');
		})

		socket.value.on('blocked', () => {
			showPopup({
				title: 'Blocked',
				info: `You have been blocked`,
			})
			store.dispatch('fetchCurrentUser');
		})
	});
	/* SETUP && LISTENERS */


	/* FUNCTIONS */
	const hidePopup = () => {
		popupData.value = null;
		showInformationPopup.value = false;
	}

	const showPopup = (data) => {
		popupData.value = data;
		showInformationPopup.value = true;
	}
	/* FUNCTIONS */


	/* SOCKET ACTIONS */
	const getCurrentRoom = (roomName) => {
		socket.value.emit('findRoomByName', roomName, (response) => {
			currentRoom.value = response;
		})
	}

	const getGroupRooms = () => {
		socket.value.emit('findGroupRooms', (response) => {
			groupRooms.value = response;
		})
	}
	/* SOCKET ACTIONS */
</script>

<style scoped>
	* {
		box-sizing: border-box;
	}


	.grid-container {
		display: grid;
		grid-template-rows: 100px 10fr 100px;
		grid-template-columns: 280px 1fr;
		grid-template-areas:
			"sidenav header"
			"sidenav main"
			"sidenav footer";
		grid-gap: 0;
		overflow: hidden;
	}

	.header {
		grid-area: header;
		background-color: var(--grey);
		color: var(--bue-dark);
	}

	.sidenav {
		grid-area: sidenav;
		background-color: #ffffff;
		overflow-y: auto;
		border-right: 1px solid black;
	}

	.main {
		grid-area: main;
		background-color: var(--grey);
		color: white;
		border-top: 1px solid black;
		border-bottom: 1px solid black;
		overflow-y: hidden;
	}

	.footer {
		grid-area: footer;
		background-color: var(--grey);
		color: white;
	}
</style>
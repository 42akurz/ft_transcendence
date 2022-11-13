<template>
	<div class="change-status-wrapper">
		<h2>Change User Status</h2>
		<div>Current Status:</div>
		<div>{{userStatus}}</div>
		<div class="status">
			<button @click="setUserStatus(0)">Offline</button>
			<button @click="setUserStatus(1)">Online</button>
			<button @click="setUserStatus(3)">Do not Disturb</button>
		</div>
	</div>
</template>

<script>
import store from '@/store/index.js'

export default {
	name: 'SettingsChangeStatus',

	props: {
		currentUser: {
			type: Object,
			required: true
		}
	},

	computed: {
		userStatus() {
			switch(this.currentUser.status) {
				case (0):
					return 'offline'
				case (1):
					return 'online'
				case (2):
					return 'in game'
				case (3):
					return 'do not disturb'
			}
		},
	},

	methods: {
		async setUserStatus(status) {
			await store.dispatch('setUserStatus', status)
		}
	},
}
</script>

<style scoped>
	.change-status-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 14px;
		align-items: center;
		background-color: var(--grey);
		border: 5px solid var(--blue-dark);
		padding: 50px;
		/* border-radius: 60px; */
	}

	.status {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		align-items: center;
		justify-content: center;
	}

	.status button {
		width: 160px;
		height: 30px;
		cursor: pointer;
		border: 2px solid var(--blue-dark);
		background-color: var(--orange);
		color: var(--blue-dark);
		border-radius: 25px;
	}

	.status button:hover {
		border: 2px solid  var(--blue-dark);
		color:  var(--grey);
		background-color:  var(--blue-light);
	}
</style>
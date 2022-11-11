<template>
	<div class="invite-box">
		<strong>Received Game invitation</strong>
		<strong>{{senderName}}</strong>
		<div class="buttons">
			<button @click="acceptGameInvite">Accept</button>
			<button @click="hideAlert">Decline</button>
		</div>
	</div>
</template>

<script>
import store from '@/store/index.js'

export default {
	name: 'TheGameInviteBox',

	data() {
		return {
			timeoutId: 0,
		}
	},

	props: {
		showDuration: {
			type: Number,
			default: 2000
		},
		senderId: {
			type: Number,
			required: true
		},
		senderName: {
			type: String,
			required: true
		}
	},

	methods: {
		hideAlert() {
			clearTimeout(this.timeoutId);
			this.$emit('hideAlert');
		},

		acceptGameInvite() {
			store.getters.getSocketGame.emit('acceptGameInvite', this.senderId)
			this.hideAlert();
		},
	},

	unmounted() {
		clearTimeout(this.timeoutId);
	},

	mounted() {
		this.timeoutId = setTimeout(() => {
			this.$emit('hideAlert')
		}, this.showDuration);
	}
}
</script>

<style scoped>
	.invite-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20px 50px;

		border: 1px solid var(--blue-dark);
		background-color: var(--grey);
		color: var(--blue--dark);
		transition: 0.5s;
		font-size: 20px;

		position: sticky;
		bottom: 10px;
		left: 0;
		right: 0;

		margin: 10px;
	}

	.invite-box .buttons {
		display: flex;
		flex-direction: row;
		gap: 12px;
		justify-content: center;
		align-items: center;
	}

	button {
		padding: 10px;
		background-color: rgb(28, 123, 212);
		border: 1px solid black;
		border-radius: 5px;
		color: white;
		width: fit-content;
		font-weight: bold;
		font-size: 16px;
		cursor: pointer;
	}

	.close-button {
		background-color: red;
		border-color: red;
		color: white;
		font-weight: bold;
	}
</style>
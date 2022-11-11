<template>
	<div class="notification">
		<div class="info">
			<strong>Received Game invitation</strong>
			<div>from {{senderId}}</div>
		</div>
		<button @click="acceptGameInvite">Accept</button>
		<button @click="hideAlert">&#x2715;</button>
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
		var r = document.querySelector(':root');

		r.style.setProperty('--alert-text-color', '#03d0ff');
		r.style.setProperty('--alert-background-color', 'rgba(1, 204, 220, 0.16)');
		r.style.setProperty('--alert-background-hover-color', 'rgba(1, 204, 220, 0.16)');
		r.style.setProperty('--alert-border-color', '#03d0ff');

		this.timeoutId = setTimeout(() => {
			this.$emit('hideAlert')
		}, this.showDuration);
	}
}
</script>

<style scoped>
	.notification {
		display: grid;
		align-items: center;
		grid-template-rows: 1fr;
		grid-template-columns: 5fr 1fr;
		padding: 20px 50px;

		border: 1px solid var(--alert-border-color);
		background-color: var(--alert-background-color);
		color: var(--alert-text-color);
		transition: 0.5s;

		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;

		margin: 10px;
	}

	.notification:hover{
		background-color: var(--alert-background-hover-color);
		transition: 0.5s;
	}

	.info {
		display: flex;
		flex-direction: row;
		gap: 50px;
		font-size: 20px;
	}

	button {
		width: fit-content;
		margin-left: auto;
		border: none;
		background: transparent;
		cursor: pointer;
		color: var(--alert-text-color);
		font-size: 18px;
	}
</style>
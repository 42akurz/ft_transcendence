<template>
	<div class="notification">
		<div class="info">
			<strong>{{alert}}</strong>
			<div>{{detail}}</div>
		</div>
		<button @click="hideAlert">&#x2715;</button>
	</div>
</template>

<script>
export default {
	name: 'TheNotificationBox',

	data() {
		return {
			timeoutId: 0,
		}
	},

	props: {
		alert: {
			type: String,
			required: true
		},
		detail: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			default: 'success'
		},
		showDuration: {
			type: Number,
			default: 2000
		}
	},

	methods: {
		hideAlert() {
			clearTimeout(this.timeoutId);
			this.$emit('hideAlert');
		}
	},

	unmounted() {
		clearTimeout(this.timeoutId);
	},

	mounted() {
		var r = document.querySelector(':root');

		switch(this.type) {
			case 'success':
				r.style.setProperty('--alert-text-color', '#039b00');
				r.style.setProperty('--alert-background-color', 'rgba(66, 224, 132, 0.424)');
				r.style.setProperty('--alert-background-hover-color', 'rgba(8, 165, 74, 0.35)');
				r.style.setProperty('--alert-border-color', '#039b00');
				break ;
			case 'warning':
				r.style.setProperty('--alert-text-color', 'white');
				r.style.setProperty('--alert-background-color', '#9c2b2e');
				r.style.setProperty('--alert-background-hover-color', '#9c2b2e');
				r.style.setProperty('--alert-border-color', '#e84e4f');
				break ;
			case 'info':
				r.style.setProperty('--alert-text-color', '#03d0ff');
				r.style.setProperty('--alert-background-color', 'rgba(1, 204, 220, 0.16)');
				r.style.setProperty('--alert-background-hover-color', 'rgba(1, 204, 220, 0.16)');
				r.style.setProperty('--alert-border-color', '#03d0ff');
				break ;
		}

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
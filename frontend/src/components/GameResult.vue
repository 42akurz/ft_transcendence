<template>
	<div class="result">
		<strong>{{message}}</strong>
		<button @click="$emit('goToLobby')">To Lobby</button>
	</div>
</template>

<script>
	export default {
		name: 'GameResult',

		emits: ['goToLobby'],

		props: {
			message: {
				type: String
			}
		}
	}
</script>

<style scoped>
	.result {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		background-color: var(--blue-light);
		box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		gap: 30px;
		border-radius: 42px;

		width: 370px;
		height: 370px;
	}

	strong {
		color: white;
		font-size: 42px;
	}

	button {
		width: 168px;
		height: 42px;
		cursor: pointer;
		margin: 0 10px;

		border: 2px solid var(--blue-dark);
		background-color: var(--orange);
		color: var(--blue-dark);
		border-radius: 25px;

		font-size: 21px;
	}
</style>
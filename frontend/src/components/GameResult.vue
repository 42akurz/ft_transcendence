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
		width: 370px;
		height: 370px;
		padding: 20px;
	}

	strong {
		color: white;
		font-size: 35px;
		font-weight: bold;
	}

	button {
		width: 168px;
		height: 42px;
		margin: 0 10px;
		background-color: var(--orange);
		border: 2px solid black;
		color: black;
		border-radius: 5px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 21px;
		font-weight: bold;
		cursor: pointer;
	}
</style>
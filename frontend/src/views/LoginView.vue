<template>
	<div class="login-wrapper">
		<button @click="login">Login</button>
	</div>
</template>

<script>
	export default {
		name: 'LoginView',

		methods: {
			login() {
				location.replace(`${process.env.VUE_APP_HOST_URL}:3000/authentication/callback`);
			}
		}
	}
</script>

<style scoped>
	.login-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	button {
		width: 200px;
		height: 60px;
		background-color: var(--blue-light);
		border: 2px solid black;
		color: white;
		border-radius: 5px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		font-weight: bold;
		cursor: pointer;
	}
</style>
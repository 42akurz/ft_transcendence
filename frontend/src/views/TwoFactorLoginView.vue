<template>
	<div class="wrapper">
		<h2>Login Two Factor</h2>
		<form @submit.prevent="login2FA">
			<div>
				<label for="2FACode">Enter Google Authenticator Code: </label>
				<br>
				<input type="text" id="2FACode" v-model="formData.twoFactorAuthenticationCode" />
			</div>
			<h3 v-if="errorMsg">{{errorMsg}}</h3>
			<div class="login">
				<button>Send</button>
			</div>
		</form>
	</div>
</template>

<script>
import axios from 'axios'

export default {
	name: 'TwoFactorLoginView',

	data() {
		return {
			formData: {
				twoFactorAuthenticationCode: '',
			},
			errorMsg: '',
		}
	},

	methods: {
		login2FA() {
			if (this.formData.code == '') {
				console.log("No code provided!");
				this.errorMsg = 'Please enter your code!';
				return;
			}
			else {
				axios.post(`${process.env.VUE_APP_HOST_URL}:3000/2fa/authenticate`, this.formData, {withCredentials: true})
				.then((response) => {
					this.errorMsg = 'Successfully logged in with 2FA!'
				})
				.catch((error) => {
					this.errorMsg = 'Error while login!'
				})
				this.formData.code = '';
			}
		},
	}
}

</script>

<style scoped>
	.wrapper {
		background-color: var(--grey);
		padding: 50px;
		border: 5px solid var(--blue-dark);
		border-radius: 60px;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	h2 {
		color: var(--blue-dark);
		letter-spacing: 2px;
	}

	h3 {
		color: var(--blue-dark);
		letter-spacing: 1px;
		margin-top: 0px;
	}

	.login {
		margin: 0;
	}

	.login button {
		width: 100px;
		height: 30px;
		cursor: pointer;
		margin: 10px;
		border: 2px solid var(--blue-dark);
		background-color: var(--orange);
		color: var(--blue-dark);
		border-radius: 25px;
	}
</style>
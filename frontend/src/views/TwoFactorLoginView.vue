<template>
	<div class="two-factor-login-wrapper">
		<div class="two-factor-login">
			<h2>Login Two Factor</h2>
			<form @submit.prevent="login2FA">
				<input placeholder="enter auth code" type="text" id="2FACode" v-model="formData.twoFactorAuthenticationCode" />
				<h3 v-if="errorMsg">{{errorMsg}}</h3>
				<button>Send</button>
			</form>
		</div>
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
				this.errorMsg = 'Please enter your code!';
				return;
			}
			else {
				axios.post(`${process.env.VUE_APP_HOST_URL}:3000/2fa/authenticate`, this.formData, {withCredentials: true})
				.then((response) => {
					this.$router.push('profile');
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
	.two-factor-login-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.two-factor-login {
		background-color: var(--grey);
		padding: 100px;
		border: 5px solid var(--blue-dark);
		border-radius: 60px;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	form {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 10px;
	}

	h2 {
		color: var(--blue-dark);
		letter-spacing: 2px;
	}

	input {
		width: 150px;
		outline: none;
		color: black;
		padding: 5px;
		border: 2px solid black;
		border-radius: 5px;
		background-color: white;
		color: black;
	}

	button {
		width: 150px;
		height: 30px;
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
<template>
<div class="wrapper">
	<h2>Setup Two Factor</h2>
	<div class="login">
		<button v-on:click="gen_qrcode">Gen Code</button>
		<br>
		<img v-if="qrCode" :src="qrCode">
	</div>
	<form @submit.prevent="send2FA">
		<div>
			<label for="2FACode">Enter Code: </label>
			<br>
			<input type="text" id="2FACode" v-model="formData.twoFactorAuthenticationCode" />
		</div>
		<h3 v-if="errorMsg">{{errorMsg}}</h3>
		<div class="login">
			<button>Send</button>
		</div>
	</form>
	<button @click="turnOffTwoFA">Diasble</button>
</div>
</template>


<script>
import axios from 'axios'

export default {
	name: 'SettingsTwoFactorSetup',

	data() {
		return {
			formData: {
				twoFactorAuthenticationCode: '',
			},
			errorMsg: '',
			qrCode: '',
		}
	},

	methods: {
		send2FA() {
			if (this.formData.code == '') {
				console.log("No code provided!");
				this.errorMsg = 'Please enter your code!';
				return;
			}
			else {
				axios.post(`${process.env.VUE_APP_HOST_URL}:3000/2fa/turn-on`, this.formData, {withCredentials: true})
				.then((response) => {
					this.errorMsg = 'Successfully activated 2FA!'
					this.$router.push('2falogin');
				})
				.catch((error) => {
					this.errorMsg = 'Error while activating!'
				})
				this.formData.code = '';
			}
		},

		gen_qrcode(){
			this.qrCode = `${process.env.VUE_APP_HOST_URL}:3000/2fa/generate?` + new Date().getTime();
		},

		turnOffTwoFA() {
			axios.post(`${process.env.VUE_APP_HOST_URL}:3000/2fa/turn-off`, null, {withCredentials: true})
			.then((response) => {
				this.errorMsg = 'Successfully deactivated 2FA!'
			})
			.catch((error) => {
				this.errorMsg = 'Error while deactivating!'
			})
		}
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
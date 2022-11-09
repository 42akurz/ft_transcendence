<template>
	<div class="wrapper">
		<h2>Change Username</h2>
		<div>Current Name:</div>
		<div>{{currentUser.username}}</div>
		<div class="name">
			<input type="text" placeholder="enter username" v-model="newName">
			<button @click="changeUsername">Change UserName</button>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	import store from '@/store/index.js'

	export default {
		name: 'SettingsChangeName',

		data() {
			return {
				newName: '',
			}
		},

		props: {
			currentUser: {
				type: Object,
				required: true
			}
		},

		methods: {
			async changeUsername() {
				await axios.post(`${process.env.VUE_APP_HOST_URL}:3000/users/update/name/${this.newName}`, null, { withCredentials: true })
				.then((response) => {
					this.newName = '';
					store.dispatch('fetchCurrentUser');
				})
				.catch((error) => {
					this.newName = '';
				})
			}
		}
	}
</script>

<style scoped>
	.wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 14px;
		align-items: center;
		background-color: var(--grey);
		border: 5px solid var(--blue-dark);
		padding: 50px;
		border-radius: 60px;
		width: 400px;
	}
</style>
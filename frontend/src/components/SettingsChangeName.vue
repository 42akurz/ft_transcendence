<template>
	<div class="change-name-wrapper">
		<h2>Change Username</h2>
		<div>Current Name:</div>
		<div>{{currentUser.username}}</div>
		<div class="name">
			<input type="text" placeholder="enter username" v-model="newName">
			<button @click="changeUsername">Submit</button>
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
	.change-name-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 14px;
		align-items: center;
		background-color: var(--grey);
		border: 5px solid var(--blue-dark);
		padding: 50px;
		/* border-radius: 60px; */
	}

	.name {
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		gap: 5px;
	}

	input {
		width: 150px;
	}

	button {
		width: 150px;
		height: 30px;
		cursor: pointer;
		margin: 0 10px;
		border: 2px solid var(--blue-dark);
		background-color: var(--blue-light);
		color: var(--grey);
		border-radius: 25px;
	}
</style>
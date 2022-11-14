<template>
	<div class="change-name-wrapper">
		<h2>Change Username</h2>
		<div>Current Name:</div>
		<strong>{{currentUser.username}}</strong>
		<div class="name">
			<input type="text" placeholder="new name" v-model="newName">
			<small v-if="nameError">{{nameError}}</small>
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
				nameError: ''
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
				if (this.newName.length > 8) {
					this.nameError = 'Name cant have more then 8 characters';
					setTimeout(() => { this.nameError = ''; }, 3000);
					return ;
				}
				if (this.newName.includes(' ')) {
					this.nameError = 'Name cant have spaces';
					setTimeout(() => { this.nameError = ''; }, 3000);
					return ;
				}
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
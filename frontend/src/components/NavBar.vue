<template>
	<div class="nav-wrapper">
		<router-link to="/">Profile</router-link>
		<!-- <router-link to="/test">Play</router-link>
		<router-link to="/game">Game</router-link> -->
		<router-link to="/gamelobby">Play</router-link>
		<router-link to="/friends">Friends</router-link>
		<router-link to="/chat">Chat</router-link>
		<router-link to="/scoreboard">Scoreboard</router-link>
		<router-link to="/settings">Settings</router-link>
		<button v-if="currentUserStatus" @click="logoutAPI">Logout</button>
		<button v-if="!currentUserStatus" @click="login">Login</button>
	</div>
</template>

<script>
	import axios from 'axios'
	import store from '@/store/index.js';

	export default {
		name: 'NavBar',

		data() {
			return {
				errorMsg: '',
			}
		},

		computed: {
			currentUserStatus() {
				if (store.getters.getCurrentUser)
					return store.getters.getCurrentUser.status
			}
		},

		async created() {
			await store.dispatch('fetchCurrentUser');
		},


		methods: {
			logoutAPI() {
				axios.post(`${process.env.VUE_APP_HOST_URL}:3000/authentication/logout`, null, {withCredentials: true})
				.then((response) => {
					console.log(response)
					this.errorMsg = 'Successfully logged out!'
				})
				.catch((error) => {
					console.log(error)
					this.errorMsg = 'Error: ' + error.response.data.message
				})
				store.dispatch('setUserStatus', 0);
			},

			login() {
				location.replace(`${process.env.VUE_APP_HOST_URL}:3000/authentication/callback`);
			}
		}
	}
</script>

<style scoped>
	.nav-wrapper {
		position: sticky;
		top: 0;
		left: 0;
		background-color: white;
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		align-items: center;
		height: var(--nav-bar-height);
		border-bottom: 2px solid black;
	}

	a, button {
		border: 2px solid black;
		padding: 5px;
		border-radius: 5px;
		text-decoration: none;
		background-color: var(--grey);
		font-size: 14px;
		font-weight: bold;
		color: black;
	}

	button:hover {
		cursor: pointer;
	}

	a.router-link-exact-active {
		background-color: var(--orange);
	}
</style>
<template>
	<div class="nav-wrapper" v-if="navbarAllowed && currentUser">
		<router-link to="/profile">Profile</router-link>
		<router-link to="/gamelobby">Play</router-link>
		<router-link to="/friends">Friends</router-link>
		<router-link to="/chat">Chat</router-link>
		<router-link to="/scoreboard">Scoreboard</router-link>
		<router-link to="/settings">Settings</router-link>
		<button @click="logoutAPI">Logout</button>
	</div>
</template>

<script>
	import axios from 'axios'
	import store from '@/store/index.js';

	export default {
		name: 'TheNavBar',

		data() {
			return {
				errorMsg: '',
			}
		},

		computed: {
			currentRoute() {
				return this.$route.name;
			},

			currentUser() {
				return store.getters.getCurrentUser;
			},

			navbarAllowed() {
				if (this.currentRoute === '2falogin'
					|| this.currentRoute === 'login'
					|| this.currentRoute === 'gameroom')
					return false;
				return true;
			}
		},

		async created() {
			await store.dispatch('fetchCurrentUser');
		},

		methods: {
			logoutAPI() {
				axios.post(`${process.env.VUE_APP_HOST_URL}:3000/authentication/logout`, null, {withCredentials: true})
				.then((response) => {
					store.dispatch('setUserStatus', 0);
					store.commit('setCurrentUser', null);
					this.$router.push('/')
				})
				.catch((error) => {
					this.errorMsg = 'Error: ' + error.response.data.message
				})
			},
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
		width: 100px;
		height: 35px;
		outline: none;
		text-decoration: none;
		border: 2px solid black;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 5px;
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
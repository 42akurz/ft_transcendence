<template>
	<div class="wrapper">
		<div class="profile" v-if="user">
			<button @click="goPageBack" style="color: red;" v-if="buttonsAllowed">X</button>
			<div class="flex-container">
				<div class="info">
					<h2>{{user.username}}</h2>

					<img id="profile-pic" :src="imageLink">

					<ProfileStats
						v-if="user"
						:wins="user.wins"
						:loses="user.loses"
					/>

					<h3>{{userStatus}}</h3>
				</div>

				<div class="history">
					<ProfileMatchHistory
						:user="user"
					/>
				</div>

			</div>
			<ProfileButtons
				v-if="buttonsAllowed && user"
				:user="user"
			/>
		</div>
		<small style="color: red;" v-if="errorMsg">{{errorMsg}}</small>
	</div>
</template>

<script>
	import store from '@/store/index.js'
	import axios from 'axios'
	import ProfileStats from '@/components/ProfileStats.vue'
	import ProfileMatchHistory from '@/components/ProfileMatchHistory.vue'
	import ProfileButtons from '@/components/ProfileButtons.vue'

	export default {
		name: 'ProfileView',

		components: {
			ProfileStats,
			ProfileMatchHistory,
			ProfileButtons
		},

		data() {
			return {
				errorMsg: '',
				user: null,
				buttonsAllowed: true,
			}
		},

		created() {
			this.fetchUser(this.watchingCurrentProfileID);
		},

		unmounted() {
			store.commit('setWatchingCurrentProfileID', 0);
		},

		methods: {
			async fetchUser(id) {
				if (id === 0) {
					await axios.get(`${process.env.VUE_APP_HOST_URL}:3000/users/myuser`, {withCredentials: true})
					.then((response) => {
						this.user = response.data
						this.buttonsAllowed = false
					})
					.catch((error) => {
						this.errorMsg = 'Error: ' + error.response.data.message
					})
				}
				else {
					await axios.get(`${process.env.VUE_APP_HOST_URL}:3000/users/id/${id}`, {withCredentials: true})
					.then((response) => {
						this.user = response.data
					})
					.catch((error) => {
						this.errorMsg = 'Error: ' + error.response.data.message
					})
				}
			},

			goPageBack() {
				this.$router.back();
			},
		},

		computed: {
			imageLink() {
				if (this.user.avatarId === 1 && this.user.profilePictureURL)
					return this.user.profilePictureURL;
				else
					return `${process.env.VUE_APP_HOST_URL}:3000/database-files/${this.user.avatarId}`;
			},

			userStatus() {
				switch(this.user.status) {
					case (0):
						return 'offline'
					case (1):
						return 'online'
					case (2):
						return 'in game'
					case (3):
						return 'do not disturb'
				}
			},

			currentUser() {
				return store.getters.getCurrentUser;
			},

			watchingCurrentProfileID() {
				return store.getters.getWatchingCurrentProfileID;
			}
		},
	}
</script>

<style scoped>
	small, strong {
		display: block;
	}

	.wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: calc(100vh - var(--nav-bar-height) - 30px);
	}

	.profile {
		background-color: var(--grey);
		border: 5px solid var(--blue-dark);
		padding: 50px 10%;
		border-radius: 60px;
		/* width: 400px; */
		width: 60%;
		max-width: 1000px;
	}

	.flex-container {
		/* border: 1px solid red; */
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px;
	}

	.flex-container .info {
		/* border: 1px solid blue; */
		flex: 1;
	}

	.flex-container .history {
		/* border: 1px solid green; */
		flex: 1;
		display: flex;
		justify-content: center;
		/* margin-bottom: auto; */
	}

	#profile-pic {
		border: 3px solid var(--blue-dark);
		width: 300px;
	}

	h2 {
		color: var(--blue-dark);
		letter-spacing: 2px;
	}

	h3 {
		color: var(--blue-dark);
		letter-spacing: 2px;
	}

	button {
		width: 100%;
		padding: 10px;
		background-color: rgb(28, 123, 212);
		border: 1px solid black;
		border-radius: 5px;
		color: white;
		font-weight: bold;
	}

	button:hover {
		cursor: pointer;
		background-color: var(--orange);
		color: var(--blue-dark);
	}
</style>
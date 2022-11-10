<template>
	<div class="wrapper">
		<div class="profile" v-if="user">
			<button @click="goPageBack" style="color: red;" v-if="buttonsAllowed">X</button>
			<div class="flex-container">
				<div class="info">
					<h2 class="info__title">Profile</h2>

					<h2 class="info__username">{{user.username}}</h2>
					<img class="info__image" :src="imageLink">

					<BaseBoxNumberWithTitle
						id="box1"
						v-if="user"
						:title="'Wins'"
						:number="user.wins"
					/>

					<BaseBoxNumberWithTitle
						id="box2"
						v-if="user"
						:title="'Loses'"
						:number="user.loses"
					/>

					<h3 class="info__status">{{userStatus}}</h3>
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
	import BaseBoxNumberWithTitle from '@/components/BaseBoxNumberWithTitle.vue'
	import ProfileMatchHistory from '@/components/ProfileMatchHistory.vue'
	import ProfileButtons from '@/components/ProfileButtons.vue'

	export default {
		name: 'ProfileView',

		components: {
			BaseBoxNumberWithTitle,
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
	* {
		box-sizing: border-box;
	}

	.wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0;
		margin: 0;
		min-height: calc(100vh - var(--nav-bar-height) - 30px);
	}

	.profile {
		padding: 0;
		margin: 0;
		background-color: var(--grey);
		border: 5px solid var(--blue-dark);
		padding: 50px;
		border-radius: 60px;
		width: 60%;
		max-width: 1000px;
	}

	.flex-container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px;
		padding: 0;
		margin: 0;
	}

	.flex-container .info {
		flex: 1;
		display: grid;
		grid-template-areas:
			'title title'
			'name name'
			'image image'
			'wins loses'
			'status status';
		gap: 5px;
		min-width: 300px;
	}

	.flex-container .info .info__title {
		grid-area: title;
	}

	.flex-container .info .info__username {
		grid-area: name;
		border: 3px solid var(--blue-dark);
		padding: 10px 0;
		width: 100%;
	}

	.flex-container .info .info__image {
		grid-area: image;
		border: 3px solid var(--blue-dark);
		width: 100%;
	}

	.flex-container .info #box1 {
		grid-area: wins;
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		border: 3px solid var(--blue-dark);
		align-self: stretch;
		justify-self: stretch;
	}

	.flex-container .info #box2 {
		grid-area: loses;
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		border: 3px solid var(--blue-dark);
		align-self: stretch;
		justify-self: stretch;
	}

	.flex-container .info .info__status {
		margin: 0;
		grid-area: status;
		border: 3px solid var(--blue-dark);
		color: var(--blue-dark);
		letter-spacing: 2px;
		width: 100%;
		padding: 10px 0;
	}

	.flex-container .history {
		border: 1px solid green;
		height: 100%;
		flex: 1;
		display: flex;
		justify-content: center;
		margin-bottom: auto;
	}

	/* #profile-pic {
		border: 3px solid var(--blue-dark);
		width: 300px;
	} */

	h2 {
		color: var(--blue-dark);
		letter-spacing: 2px;
		margin: 0;
		padding: 0;
	}

	h3 {
		padding: 0;
		margin: 0;
	}

	/* button {
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
	} */
</style>
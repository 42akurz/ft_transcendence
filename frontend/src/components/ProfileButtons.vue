<template>
	<div class="profile-buttons">
		<button class="green-button"
			v-if="!sentRequest && !isFriend && !receivedRequest"
			@click="sendFriendRequest">
			Send Request
		</button>
		<button class="yellow-button"
			v-if="sentRequest && !isFriend && !receivedRequest"
			@click="retrieveFriendRequest">
			Retrieve Request
		</button>
		<button class="red-button"
			v-if="isFriend"
			@click="deleteFriend">
			Delete Friend
		</button>
		<button class="green-button"
			v-if="receivedRequest && !isFriend"
			@click="acceptFriend">
			Accept Friend Request
		</button>
		<button class="red-button"
			v-if="receivedRequest && !isFriend"
			@click="declineFriend">
			Decline Friend Request
		</button>
		<button class="red-button"
			v-if="!isBlocked"
			@click="blockUser">
			Block User
		</button>
		<button class="red-button"
			v-if="isBlocked"
			@click="unblockUser">
			Unblock User
		</button>
		<small style="color: red;" v-if="errorMsg">{{errorMsg}}</small>
	</div>
</template>

<script>
	import store from '@/store/index.js'
	import axios from 'axios'

	export default {
		name: 'ProfileButtons',

		data() {
			return {
				errorMsg: '',
			}
		},

		props: {
			user: {
				type: Object,
				required: true,
			}
		},

		methods: {
			async sendFriendRequest() {
				await axios.post(`${process.env.VUE_APP_HOST_URL}:3000/users/friend/add/${this.user.id}`, null, {withCredentials: true})
				.then((response) => {
					store.dispatch('fetchCurrentUser');
				})
				.catch((error) => {
					this.errorMsg = 'Error: ' + error.response.data.message
				})
			},

			async retrieveFriendRequest() {
				await axios.post(`${process.env.VUE_APP_HOST_URL}:3000/users/friend/retrieve/${this.user.id}`, null, {withCredentials: true})
				.then((response) => {
					store.dispatch('fetchCurrentUser');
				})
				.catch((error) => {
					this.errorMsg = 'Error: ' + error.response.data.message
				})
			},

			async deleteFriend() {
				await axios.post(`${process.env.VUE_APP_HOST_URL}:3000/users/friend/remove/${this.user.id}`, null, {withCredentials: true})
				.then((response) => {
					store.dispatch('fetchCurrentUser');
				})
				.catch((error) => {
					this.errorMsg = 'Error: ' + error.response.data.message
				})
			},

			async acceptFriend() {
				await axios.post(`${process.env.VUE_APP_HOST_URL}:3000/users/friend/accept/${this.user.id}`, null, {withCredentials: true})
				.then((response) => {
					store.dispatch('fetchCurrentUser');
				})
				.catch((error) => {
					this.errorMsg = 'Error: ' + error.response.data.message
				})
			},

			async declineFriend() {
				await axios.post(`${process.env.VUE_APP_HOST_URL}:3000/users/friend/decline/${this.user.id}`, null, {withCredentials: true})
				.then((response) => {
					store.dispatch('fetchCurrentUser');
				})
				.catch((error) => {
					this.errorMsg = 'Error: ' + error.response.data.message
				})
			},

			async blockUser() {
				await axios.post(`${process.env.VUE_APP_HOST_URL}:3000/users/block/${this.user.id}`, null, {withCredentials: true})
				.then((response) => {
					store.dispatch('fetchCurrentUser');
				})
				.catch((error) => {
					this.errorMsg = 'Error: ' + error.response.data.message
				})
			},

			async unblockUser() {
				await axios.post(`${process.env.VUE_APP_HOST_URL}:3000/users/unblock/${this.user.id}`, null, {withCredentials: true})
				.then((response) => {
					store.dispatch('fetchCurrentUser');
				})
				.catch((error) => {
					this.errorMsg = 'Error: ' + error.response.data.message
				})
			},
		},

		computed: {
			currentUser() {
				return store.getters.getCurrentUser;
			},

			receivedRequest() {
				if (this.currentUser)
					return this.currentUser.receivedFriendRequests.some(e => e.username === this.user.username);
			},

			sentRequest() {
				if (this.currentUser)
					return this.currentUser.sendFriendRequests.some(e => e.username === this.user.username);
			},

			isFriend() {
				if (this.currentUser)
					return this.currentUser.friends.some(e => e.username === this.user.username);
			},

			isBlocked() {
				if (this.currentUser)
					return this.currentUser.blockedUsers.some(e => e.username === this.user.username);
			},
		}
	}
</script>

<style scoped>
	.profile-buttons {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 10px;
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
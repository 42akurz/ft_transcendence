<template>
	<div class="profile-buttons">
		<button
			v-if="!sentRequest && !isFriend && !receivedRequest"
			@click="sendFriendRequest">
			Send Request
		</button>
		<button
			v-if="sentRequest && !isFriend && !receivedRequest"
			@click="retrieveFriendRequest">
			Retrieve Request
		</button>
		<button
			v-if="isFriend"
			@click="deleteFriend">
			Delete Friend
		</button>
		<button
			v-if="receivedRequest && !isFriend"
			@click="acceptFriend">
			Accept Friend Request
		</button>
		<button
			v-if="receivedRequest && !isFriend"
			@click="declineFriend">
			Decline Friend Request
		</button>
		<button
			v-if="!isBlocked"
			@click="blockUser">
			Block User
		</button>
		<button
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
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		column-gap: 30px;
		row-gap: 10px;
		margin-top: 15px;
	}

	button {
		width: 150px;
		height: 35px;
		border: 2px solid black;
		background-color: var(--orange);
		color: black;
		border-radius: 5px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		font-size: 12px;
		font-weight: bold;
	}

	button:hover {
		background-color: var(--blue-light);
		cursor: pointer;
		color: white;
	}
</style>
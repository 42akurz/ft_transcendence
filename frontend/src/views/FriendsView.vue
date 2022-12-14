<template>
	<div class="friends-wrapper">
		<div class="wrapper">
			<h2>Friends</h2>
			<h3>Change Tab</h3>
			<div class="tabs">
				<button
					:style="(currentTab === tab) ? 'background-color: var(--blue-light); color: white;' : 0"
					v-for="tab in tabs"
					:key="tab"
					@click="currentTab = tab">
					{{tab}}
				</button>
			</div>
			<keep-alive>
				<component
					:is="currentTabComponent"
					:usersData="usersData"
					:key="currentTabComponent"
				></component>
			</keep-alive>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import FriendsList from '../components/FriendsList.vue'
import FriendsFind from '../components/FriendsFind.vue'
import FriendsRequest from '../components/FriendsRequest.vue'
import store from '@/store/index.js';

export default {
	name: 'FriendsView',

	components: {
		FriendsList,
		FriendsFind,
		FriendsRequest,
	},

	data() {
		return {
			// used to store response for API
			response: null,

			// tabs thats currently displayed
			currentTab: 'List',

			// all tabs
			tabs: ['List', 'Find', 'Request'],

			usersData: {
				// list of all registered users object
				allUsers: [],
	
				// list of all registered users object excluding the one that is logged in
				otherUsers: null,
			},
		}
	},

	computed: {
		currentTabComponent() {
			return 'Friends' + this.currentTab;
		},

		currentUser() {
			return store.getters.getCurrentUser;
		}
	},

	methods: {
		// get all users including current user
		async getAllUsers() {
			await axios.get(`${process.env.VUE_APP_HOST_URL}:3000/users/all`, {withCredentials: true})
			.then((response) => {
				this.usersData.allUsers = response.data
			})
			.catch((error) => {
				console.log('Error: ' + error.response.data.message)
			})
		},

		// get all users that are not current user 
		async getAllOtherUsers() {
			await axios.get(`${process.env.VUE_APP_HOST_URL}:3000/users/public`, {withCredentials: true})
			.then((response) => {
				this.usersData.otherUsers = response.data;
			})
			.catch((error) => {
				console.log('Error: ' + error.response.data.message)
			})
		},
	},

	async beforeMount() {
		if (!this.currentUser) {
			this.$router.push('/');
			return ;
		}
		await this.getAllUsers();
		await this.getAllOtherUsers();
		await store.dispatch('fetchCurrentUser');
	},
}
</script>

<style scoped>
	.friends-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.wrapper {
		background-color: var(--grey);
		padding: 50px;
		border: 5px solid var(--blue-dark);
		width: 400px;
	}

	h2 {
		color: var(--blue-dark);
		letter-spacing: 2px;
	}

	h3 {
		color: var(--blue-dark);
		letter-spacing: 2px;
		margin-top: 50px;
	}

	.tabs {
		margin: 0;
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: 10px;
	}

	.tabs button {
		width: 80px;
		height: 35px;
		border: 2px solid black;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 5px;
		background-color: var(--orange);
		font-size: 12px;
		font-weight: bold;
		color: black;
		cursor: pointer;
	}

	.tabs button:hover {
		border: 2px solid  var(--blue-dark);
		color:  var(--grey);
		background-color:  var(--blue-light);
	}
</style>
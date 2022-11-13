<template>
	<div class="friends-wrapper">
		<div class="wrapper">
			<h2>Friends</h2>
			<h3>Change Tab</h3>
			<div class="tabs">
				<button v-for="tab in tabs" :key="tab" @click="currentTab = tab">{{tab}}</button>
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

			// used to catch erros in API
			errorMsg: '',

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
	},

	methods: {
		// get all users including current user
		async getAllUsers() {
			await axios.get(`${process.env.VUE_APP_HOST_URL}:3000/users/all`, {withCredentials: true})
			.then((response) => {
				this.usersData.allUsers = response.data
			})
			.catch((error) => {
				this.errorMsg = 'Error: ' + error.response.data.message
			})
		},

		// get all users that are not current user 
		async getAllOtherUsers() {
			console.log('getAllOtherUsers');
			await axios.get(`${process.env.VUE_APP_HOST_URL}:3000/users/public`, {withCredentials: true})
			.then((response) => {
				this.usersData.otherUsers = response.data;
			})
			.catch((error) => {
				this.errorMsg = 'Error: ' + error.response.data.message
			})
		},
	},

	async beforeMount() {
		console.log('beforeMount');
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
		/* border-radius: 60px; */
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
	}

	.tabs button {
		width: 100px;
		height: 30px;
		cursor: pointer;
		margin: 0 10px;
		border: 2px solid var(--blue-dark);
		background-color: var(--orange);
		color: var(--blue-dark);
		border-radius: 25px;
	}

	.tabs button:hover {
		border: 2px solid  var(--blue-dark);
		color:  var(--grey);
		background-color:  var(--blue-light);
	}
</style>
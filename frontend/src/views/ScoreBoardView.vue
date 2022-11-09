<template>
	<div class="wrapper">
		<div class="user" v-for="user in allUsers" :key="user">
			<BaseCardUser
				:data="user"
			/>
		</div>
		<small v-if="errorMsg">{{errorMsg}}</small>
	</div>
</template>

<script>
	import BaseCardUser from '@/components/BaseCardUser.vue'
	import axios from 'axios'
	
	export default {
		name: 'ScoreBoardView',

		components: {
			BaseCardUser
		},

		data() {
			return {
				allUsers: [],
				errorMsg: '',
			}
		},

		methods: {
			async getAllUsers() {
				await axios.get(`${process.env.VUE_APP_HOST_URL}:3000/users/all`, {withCredentials: true})
				.then((response) => {
					this.allUsers = response.data
					this.errorMsg = ''
				})
				.catch((error) => {
					this.errorMsg = 'Error: ' + error.response.data.message
				})
			}
		},

		created() {
			this.getAllUsers();
		}
	}
</script>

<style scoped>

</style>
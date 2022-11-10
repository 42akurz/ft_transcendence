<template>
	<div class="wrapper">
		<h2>TOP 10</h2>
		<div class="user" v-for="(user, index) in scoreboard" :key="user">
			{{index + 1}}.
			<BaseCardUser
				:data="user"
			/>
			wins: {{user.wins}}
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
				scoreboard: [],
				limiter: 10,
				errorMsg: '',
			}
		},

		methods: {
			async getScoreBoard() {
				await axios.get(`${process.env.VUE_APP_HOST_URL}:3000/score/ladder/desc/limit/${this.limiter}`, {withCredentials: true})
				.then((response) => {
					this.scoreboard = response.data
					this.errorMsg = ''
				})
				.catch((error) => {
					this.errorMsg = 'Error: ' + error.response.data.message
				})
			}
		},

		created() {
			this.getScoreBoard();
		}
	}
</script>

<style scoped>
	.user {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 40px;
	}
</style>
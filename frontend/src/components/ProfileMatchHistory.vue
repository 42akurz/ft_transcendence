<template>
	<div class="profile-match-history">
		<h2>Match History</h2>
		<div class="score" v-for="match in limitedMatchHistory" :key="match">
			<BaseCardMatchHistory
				:gameInfo="match"
				:currentUserId="user.id"
			/>
		</div>
	</div>
</template>

<script>
	import store from '@/store/index.js'
	import BaseCardMatchHistory from '@/components/BaseCardMatchHistory.vue'

	export default {
		name: 'ProfileMatchHistory',

		components: {
			BaseCardMatchHistory
		},

		props: {
			user: {
				type: Object,
				required: true
			}
		},

		computed: {
			limitedMatchHistory() {
				return this.user.matchHistory.slice(0, 5);
			}
		}
	}
</script>

<style scoped>
	h2 {
		color: var(--blue-dark);
		letter-spacing: 2px;
		margin: 0 0 30px 0;
	}
</style>
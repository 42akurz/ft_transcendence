<template>
	<div class="profile-stats">
		<div class="stat-element">
			<strong class="stat-title">Wins</strong>
			<strong class="stat-number">{{wins}}</strong>
		</div>
		<div class="stat-element">
			<strong class="stat-title">Loses</strong>
			<strong class="stat-number">{{loses}}</strong>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'ProfileStats',

		props: {
			wins: {
				type: Number,
				required: true
			},
			loses: {
				type: Number,
				required: true
			},
		}
	}
</script>

<style scoped>
	.profile-stats {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 306px;
		margin: 0 auto;
	}

	.profile-stats .stat-element {
		width: 47%;
		aspect-ratio: 1 / 1;
		border: 3px solid var(--blue-dark);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.profile-stats .stat-element .stat-title {
		font-size: 20px;
	}

	.profile-stats .stat-element .stat-number {
		font-size: 40px;
	}
</style>
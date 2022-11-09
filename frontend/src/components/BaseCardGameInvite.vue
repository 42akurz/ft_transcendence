<template>
	<div>
		<div class="card">
			<div class="game-info">
				<span class="game-oponent">{{senderId}}</span>
				<!-- <span class="access">{{room.access}}</span> -->
			</div>
			<button @click="$emit('acceptInvite', senderId)">
				Accept
			</button>
			<button @click="$emit('declineInvite', senderId)">
				Decline
			</button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'BaseCardGameInvite',

	emits: ['acceptInvite', 'declineInvite'],

	props: {
		senderId: {
			type: Number,
			required: true
		}
	}
}
</script>

<style scoped>
	.card {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		background-color: var(--blue-dark);
		border: 2px solid var(--grey);
		color: var(--grey);
		border-radius: 60px;
		width: 200px;
		margin: 5px auto;
		padding: 15px;
	}

	.card:hover {
		cursor: pointer;
		background-color: var(--orange);
		border-color: var(--blue-dark);
		color: var(--blue-dark);
	}

	.gane-info {
		display: flex;
		flex-direction: column;
		margin-left: 10px;
		text-align: left;
	}

	.game-info .game-oponent {
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 2px;
	}
</style>
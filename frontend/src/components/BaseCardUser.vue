<template>
<div>
	<div class="card" @click="goToProfilePage">
		<div class="img-container">
			<img id="profile-pic" :src="imageLink"/>
		</div>
		<div class="user-info">
			<span class="username">{{data.username}}</span>
			<span class="status">{{userStatus}}</span>
		</div>
	</div>
</div>
</template>

<script>
export default {
	name: 'BaseCardUser',

	props: {
		data: {
			type: Object,
			required: true
		},
		allowPrivatePageOnClick: {
			type: Boolean,
			default: true
		}
	},

	methods: {
		goToProfilePage() {
			if (this.allowPrivatePageOnClick) {
				this.$router.push({
					name: 'profile',
					params: { id: this.data.id }
				});
			}
		}
	},

	computed: {
		userStatus() {
			switch(this.data.status) {
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

		imageLink() {
			if (this.data.avatarId === 1 && this.data.profilePictureURL)
				return this.data.profilePictureURL;
			else
				return `${process.env.VUE_APP_HOST_URL}:3000/database-files/${this.data.avatarId}`;
		}
	}
}
</script>

<style scoped>
	.card {
		display: flex;
		flex-direction: row;
		align-items: center;
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

	.img-container {
		display: inline-block;
		border-radius: 50%;
		overflow: hidden;
		width: 45px;
		height: 45px;
		border: 2px solid var(--grey);
	}

	#profile-pic {
		width:100%;
		height:100%;
		object-fit: cover;
	}

	.user-info {
		display: flex;
		flex-direction: column;
		margin-left: 10px;
		text-align: left;
	}

	.user-info .username {
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 2px;
	}

	.user-info .status {
		font-size: 16px;
		color: var(--orange);
	}
</style>
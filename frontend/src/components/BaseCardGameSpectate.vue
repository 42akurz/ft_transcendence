<template>
	<div class="card" @click="$emit('spectateGame', gameKey)">
		<div class="player left-side" v-if="playerLeft">
			<div class="img-container">
				<img id="profile-pic" :src="imageLinkLeft"/>
			</div>
			<span class="username">{{playerLeft.username}}</span>
		</div>
		<strong>vs</strong>
		<div class="player right-side" v-if="playerRight">
			<span class="username">{{playerRight.username}}</span>
			<div class="img-container">
				<img id="profile-pic" :src="imageLinkRight"/>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios'

export default {
	name: 'BaseCardGameSpectate',

	emits: ['spectateGame'],

	data() {
		return {
			gameKey: 0,
			playerLeft: null,
			playerRight: null
		}
	},

	props: {
		gameInfo: {
			type: Object,
			required: true
		}
	},

	methods: {
		async getUserById(id) {
			return await axios.get(`${process.env.VUE_APP_HOST_URL}:3000/users/id/${Number(id)}`, {withCredentials: true})
			.then((response) => {
				return response.data
			})
			.catch((error) => {
				console.log('Error: ' + error.response.data.message)
				return null;
			})
		}
	},

	async created() {
		this.gameKey = this.gameInfo.userLeftSideID;
		this.playerLeft = await this.getUserById(this.gameInfo.userLeftSideID);
		this.playerRight = await this.getUserById(this.gameInfo.userRightSideID);
	},

	computed: {
		imageLinkLeft() {
			if (this.playerLeft) {
				if (this.playerLeft.avatarId === 1 && this.playerLeft.profilePictureURL)
					return this.playerLeft.profilePictureURL;
				else
					return `${process.env.VUE_APP_HOST_URL}:3000/database-files/${this.playerLeft.avatarId}`;
			}
		},

		imageLinkRight() {
			if (this.playerRight) {
				if (this.playerRight.avatarId === 1 && this.playerRight.profilePictureURL)
					return this.playerRight.profilePictureURL;
				else
					return `${process.env.VUE_APP_HOST_URL}:3000/database-files/${this.playerRight.avatarId}`;
			}
		}
	}
}
</script>

<style scoped>
	.img-container {
		display: inline-block;
		border-radius: 50%;
		overflow: hidden;
		width: 45px;
		height: 45px;
		border: 2px solid var(--grey);
	}

	#profile-pic {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.card {
		display: flex;
		gap: 20px;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		background-color: var(--blue-dark);
		border: 2px solid var(--grey);
		color: var(--grey);
		border-radius: 60px;
		padding: 15px;
		margin: 10px 0;
	}

	.card:hover {
		cursor: pointer;
		background-color: var(--orange);
		border-color: var(--blue-dark);
		color: var(--blue-dark);
	}

	.player {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 10px;
	}
</style>
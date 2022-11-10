<template>
	<div class="card" :class="(currentUserIsWinner) ? 'green-bg' : 'red-bg'">
		<div class="player left-side" v-if="playerLeft">
			<div class="img-container">
				<img id="profile-pic" :src="imageLinkLeft"/>
			</div>
			<span class="username">{{playerLeft.username}}</span>
			<strong>{{gameInfo.scorePlayerOne}}</strong>
		</div>
		<strong>:</strong>
		<div class="player right-side" v-if="playerRight">
			<strong>{{gameInfo.scorePlayerTwo}}</strong>
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
	name: 'BaseCardMatchHistory',

	data() {
		return {
			playerLeft: null,
			playerRight: null,
		}
	},

	props: {
		gameInfo: {
			type: Object,
			required: true
		},
		currentUserId: {
			type: Number,
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
		this.playerLeft = await this.getUserById(this.gameInfo.playerOneId);
		this.playerRight = await this.getUserById(this.gameInfo.playerTwoId);
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
		},

		currentUserIsWinner() {
			if ((this.gameInfo.scorePlayerOne > this.gameInfo.scorePlayerTwo
			&& this.gameInfo.playerOneId == this.currentUserId)
			|| (this.gameInfo.scorePlayerOne < this.gameInfo.scorePlayerTwo
			&& this.gameInfo.playerTwoId == this.currentUserId)) {
				return true;
			}
			return false;
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
		width: 310px;
	}

	.green-bg {
		background-color: rgb(16, 116, 16);
	}

	.red-bg {
		background-color: rgb(144, 24, 24);
	}

	.player {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 10px;
	}
</style>
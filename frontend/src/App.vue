<template>
	<div class="main-container">
		<NavBar/>
		<router-view class="main-view"/>
		<TheGameInviteBox
			v-if="gameInviterId && gameInviterName"
			:senderId="gameInviterId"
			:senderName="gameInviterName"
			:showDuration="3000"
			@hideAlert="gameInviterId = 0"
		/>
	</div>
</template>

<script>
	import NavBar from '@/components/NavBar.vue'
	import store from '@/store/index.js'
	import TheGameInviteBox from '@/components/TheGameInviteBox.vue'

	export default {
		data() {
			return {
				gameInviterId: 0,
				gameInviterName: ''
			}
		},

		components: {
			NavBar,
			TheGameInviteBox
		},

		computed: {
			gameSocket() {
				return store.getters.getSocketGame;
			},

			currentUser() {
				return store.getters.getCurrentUser;
			}
		},

		async beforeMount() {
			console.log('appBeforeMount')
			await store.dispatch('fetchCurrentUser');
			if (this.currentUser)
				await store.dispatch('setupSockets');

			this.gameSocket.on('receivedGameInvitaion', ({id, name}) => {
				console.log('received')
				this.gameInviterId = id;
				this.gameInviterName = name;
			})

			this.gameSocket.on('redirectToGame', (gameKey) => {
				store.commit('setCurrentGameKey', Number(gameKey));
				store.commit('setCurrentGameRole', 'player');
				this.gameInviterId = 0;
				this.gameInviterName = '';
				this.$router.push('gameroom');
			})
		}
	}
</script>

<style>
	:root {
		--blue-dark: #0A1931;
		--blue-light: rgb(28, 123, 212);;
		--grey: #EFEFEF;
		--orange: #FFC947;
		--black: #000000;
		--nav-bar-height: 60px;


		--alert-text-color: #039b00;
		--alert-background-color: rgba(66, 224, 132, 0.424);
		--alert-background-hover-color: rgba(8, 165, 74, 0.35);
		--alert-border-color: #039b00;
	}

	* {
		box-sizing: border-box;
	}

	body {
		height: 100vh;
		padding: 0;
		margin: 0;
	}

	.main-container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.main-view {
		flex: 1;
	}

	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
	}
</style>

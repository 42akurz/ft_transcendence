import { createStore } from 'vuex'
import axios from 'axios'
import io from 'socket.io-client'

const store = createStore({
	state () {
		return {
			currentUser: null,
			socketChat: null,
			socketGame: null
		}
	},

	getters: {
		getCurrentUser: (state) => state.currentUser,
		getSocketChat: (state) => state.socketChat,
		getSocketGame: (state) => state.socketGame,
	},

	actions: {
		async fetchCurrentUser({commit}) {
			await axios.get(`${process.env.VUE_APP_HOST_URL}:3000/users/myuser`, {withCredentials: true})
			.then((response) => {
				commit('setCurrentUser', response.data)
			})
			.catch((error) => {
				// console.log('Error ' + error)
			})
		},
		
		async setUserStatus({commit}, status) {
			await axios.post(`${process.env.VUE_APP_HOST_URL}:3000/users/update/status/${status}`, null, {withCredentials: true})
			.then((response) => {
				commit('setCurrentUser', response.data)
			})
			.catch((error) => {
				// console.log('Error ' + error)
			})
		},

		setupSockets({commit}) {
			const game = io(`${process.env.VUE_APP_HOST_URL}:3000/game`, {
				extraHeaders: {
					Authorization: this.state.currentUser.id
				}
			});
			const chat = io(`${process.env.VUE_APP_HOST_URL}:3000/chat`, {
				extraHeaders: {
					Authorization: this.state.currentUser.id
				}
			});
			commit('setSocketGame', game);
			commit('setSocketChat', chat);
		},

		setUser({commit}, newUser) {
			commit('setCurrentUser', newUser);
		}
	},

	mutations: {
		setCurrentUser(state, user) {
			state.currentUser = user
		},

		setSocketGame(state, game) {
			state.socketGame = game
		},

		setSocketChat(state, chat) {
			state.socketChat = chat
		}
	}
})

export default store
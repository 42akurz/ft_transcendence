//https://vueschool.io/articles/vuejs-tutorials/how-to-use-vue-router-a-complete-tutorial/
import { createRouter, createWebHistory } from 'vue-router'
import ScoreBoard from '@/views/ScoreBoardView.vue'
import FriendsView from '@/views/FriendsView.vue'
import ProfileView from '@/views/ProfileView.vue'
import GameTesting from '@/views/GameTesting.vue'
import ChatView from '@/views/ChatView.vue'
import SettingsView from '@/views/SettingsView.vue'
import TwoFactorLoginView from '@/views/TwoFactorLoginView.vue'
import GameLobbyView from '@/views/GameLobbyView.vue'
import GameRoomView from '@/views/GameRoomView.vue'

const routes = [
{
	path: '/',
	name: 'profile',
	component: ProfileView,
	props: true
},
// {
// 	path: '/test',
// 	name: 'test',
// 	component: GameTesting
// },
{
	path: '/friends',
	name: 'friends',
	component: FriendsView
},
{
	path: '/chat',
	name: 'chat',
	component: ChatView
},
{
	path: '/scoreboard',
	name: 'scoreboard',
	component: ScoreBoard
},
{
	path: '/settings',
	name: 'settings',
	component: SettingsView
},
{
	path: '/2falogin',
	name: '2falogin',
	component: TwoFactorLoginView
},
{
	path: '/gamelobby',
	name: 'gamelobby',
	component: GameLobbyView
},
{
	path: '/gameroom',
	name: 'gameroom',
	component: GameRoomView
}
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})

export default router

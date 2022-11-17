import { createRouter, createWebHistory } from 'vue-router'
import ScoreBoard from '@/views/ScoreBoardView.vue'
import FriendsView from '@/views/FriendsView.vue'
import ProfileView from '@/views/ProfileView.vue'
import ChatView from '@/views/ChatView.vue'
import SettingsView from '@/views/SettingsView.vue'
import TwoFactorLoginView from '@/views/TwoFactorLoginView.vue'
import GameLobbyView from '@/views/GameLobbyView.vue'
import GameRoomView from '@/views/GameRoomView.vue'
import LoginView from '@/views/LoginView.vue'

const routes = [
{
	path: '/',
	name: 'login',
	component: LoginView,
},
{
	path: '/profile',
	name: 'profile',
	component: ProfileView,
},
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
	component: GameRoomView,
}
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})

export default router

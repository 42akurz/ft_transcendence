<template>
	<div class="settings-wrapper">
		<div class="menu" v-if="currentUser">
			<SettingsChangeAvatar
				class="menu-item"
				:currentUser="currentUser"
			/>
			<SettingsChangeStatus
				class="menu-item"
				:currentUser="currentUser"
			/>
			<SettingsChangeName
				class="menu-item"
				:currentUser="currentUser"
			/>
			<SettingsTwoFactorSetup
				class="menu-item"
			/>
		</div>
	</div>
</template>

<script>
	import store from '@/store/index.js'
	import SettingsTwoFactorSetup from '@/components/SettingsTwoFactorSetup.vue'
	import SettingsChangeAvatar from '@/components/SettingsChangeAvatar.vue'
	import SettingsChangeStatus from '@/components/SettingsChangeStatus.vue'
	import SettingsChangeName from '@/components/SettingsChangeName.vue'

	export default {
		name: 'SettingsView',

		components: {
			SettingsTwoFactorSetup,
			SettingsChangeAvatar,
			SettingsChangeStatus,
			SettingsChangeName
		},

		async created() {
			await store.dispatch('fetchCurrentUser');
		},

		computed: {
			currentUser() {
				return store.getters.getCurrentUser;
			},
		}
	}
</script>

<style scoped>
	.settings-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 50px;
	}

	.menu {
		display: flex;
		flex-direction: row;
		justify-content: center;
		flex-wrap: wrap;
		gap: 20px;
	}

	.menu-item {
		width: 450px;
		height: 450px;
	}

	a, button {
		border: 2px solid black;
		padding: 5px;
		border-radius: 5px;
		text-decoration: none;
		background-color: var(--grey);
		font-size: 14px;
		font-weight: bold;
		color: black;
	}

	a.router-link-exact-active {
		background-color: var(--orange);
	}
</style>

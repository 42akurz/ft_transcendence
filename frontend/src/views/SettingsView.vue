<template>
	<div class="wrapper">
		<div class="menu" v-if="currentUser">
			<SettingsChangeAvatar :currentUser="currentUser"/>
			<SettingsChangeStatus :currentUser="currentUser"/>
			<SettingsChangeName :currentUser="currentUser"/>
			<SettingsTwoFactorSetup />
		</div>
	</div>
</template>

<script>
	import store from '@/store/index.js'
	import SettingsTwoFactorSetup from '@/components/SettingsTwoFactorSetup.vue'
	import SettingsTwoFactorLogin from '@/components/SettingsTwoFactorLogin.vue'
	import SettingsChangeAvatar from '@/components/SettingsChangeAvatar.vue'
	import SettingsChangeStatus from '@/components/SettingsChangeStatus.vue'
	import SettingsChangeName from '@/components/SettingsChangeName.vue'

	export default {
		name: 'SettingsView',

		components: {
			SettingsTwoFactorSetup,
			SettingsTwoFactorLogin,
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
	.wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 50px 0;
	}

	.menu {
		display: flex;
		flex-direction: column;
		gap: 20px;
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

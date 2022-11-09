<template>
	<div class="app-wrapper">
		<NavBar/>
		<router-view class="app-main"/>
	</div>
</template>

<script>
	import NavBar from '@/components/NavBar.vue'
	import store from '@/store/index.js'

	export default {
		components: {
			NavBar,
		},

		async created() {
			await store.dispatch('fetchCurrentUser');
			await store.dispatch('setupSockets');
		}
	}
</script>

<style>
	:root {
		--blue-dark: #0A1931;
		--blue-light: #185ADB;
		--grey: #EFEFEF;
		--orange: #FFC947;
		--black: #000000;
		--nav-bar-height: 60px;


		--alert-text-color: #039b00;
		--alert-background-color: rgba(66, 224, 132, 0.424);
		--alert-background-hover-color: rgba(8, 165, 74, 0.35);
		--alert-border-color: #039b00;
	}

	body {
		height: 100vh;
		padding: 0;
		margin: 0;
	}

	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
	}

	.app-wrapper {
		/* width: 100%;
		height: 100%; */
		/* margin: 0; */
	}

	.app-main {
		/* height: calc(100vh - var(--nav-bar-height) - 30px); */
		/* margin: 0; */
	}
</style>

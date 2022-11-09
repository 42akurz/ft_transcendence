<template>
	<div class="dropdown" @click="toggleRiskLevels">
		<span class="text">{{title}}</span>
		<i class="angle" :class="(isBottomSectionToggled) ? 'angle-up' : 'angle-down'"></i>
		<div v-if="isBottomSectionToggled" class="sub-menu">
			<div class="menu-item" @click="$emit('selected', option.title)" v-for="option in options" :key="option">
				{{option.title}}
			</div>
		</div>
	</div>

</template>

<script>
export default {
	name: 'ChatHeaderDropdown',

	props: {
		title: {
			type: String,
			default: 'Menu'
		},
		options: {
			type: Array,
			default: []
		}
	},

	data() {
		return {
			isBottomSectionToggled: false,
		}
	},

	methods: {
		toggleRiskLevels() {
			this.isBottomSectionToggled = !this.isBottomSectionToggled;
		},
	}
}
</script>

<style scoped>
	.dropdown {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		position: relative;
		cursor: pointer;
		user-select: none;
		background-color: rgb(28, 123, 212);
		border-radius: 5px;
		padding: 10px 15px;
	}

	.sub-menu {
		display: flex;
		flex-direction: column;
		width: 100%;
		position: absolute;
		right: 0;
		top: 50px;
		z-index: 1;
		border-radius: 5px;
		gap: 8px;
		background-color: rgb(28, 123, 212);
		padding: 15px 0;
	}

	.menu-item {
		display: flex;
		align-items: center;
		width: auto;
		margin: 0 15px;
		color: white;
		text-decoration: underline;
	}

	.angle {
		display: flex;
		justify-content: center;
		align-items: center;
		border: solid white;
		background: transparent;
		padding: 2px;
		width: 1px;
		height: 1px;
		border-color: white;
		transform: rotate(45deg);
	}

	.angle-down {
		border-width: 0 2px 2px 0;
		margin: -2px 5px 0 0;
	}

	.angle-up {
		margin: 3px 5px 0 0;
		border-width: 2px 0 0 2px;
	}
</style>
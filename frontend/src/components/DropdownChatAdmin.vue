<template>
	<div class="button-wrapper">
		<button id="toggle-button" @click="changeDropdownState">&uarr;</button>
		<div class="button-dropdown" id="dropdown">
			<button @click="emitMakeAdmin">Admin</button>
			<button @click="emitBanUser">Ban</button>
			<button @click="emitMuteUser">Mute</button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'DropdownChatAdmin',

	emits: ['makeAdmin', 'banUser', 'muteUser'],

	data() {
		return {
			dropdownIsShown: false
		}
	},

	methods: {
		showDropdown() {
			this.dropdownIsShown = true;
			const elem = document.getElementById('dropdown');
			elem.style.display = 'flex';
		},

		hideDropdown() {
			this.dropdownIsShown = false;
			const elem = document.getElementById('dropdown');
			elem.style.display = 'none';
		},

		emitMakeAdmin() {
			this.hideDropdown()
			this.$emit('makeAdmin')
		},

		emitMuteUser() {
			this.hideDropdown()
			this.$emit('muteUser')
		},

		emitBanUser() {
			this.hideDropdown()
			this.$emit('banUser')
		},

		addAnimation() {
			const elem = document.getElementById('toggle-button');
			elem.classList.add('animate');
		},

		removeAnimation() {
			const elem = document.getElementById('toggle-button');
			elem.classList.remove('animate');
		},

		changeDropdownState() {
			if (this.dropdownIsShown) {
				this.removeAnimation();
				this.hideDropdown();
			}
			else if (!this.dropdownIsShown) {
				this.addAnimation();
				this.showDropdown();
			}
		}
	}
}
</script>

<style scoped>
	.button-wrapper {
		position: relative;
	}

	#toggle-button {
		transition: 0.5s;
		border: 1px solid white;
		background-color: var(--blue-dark);
		color: white;
		border-radius: 50%;
		height: 35px;
		width: 35px;
		margin-left: 10px;
		padding-bottom: 3px;
		cursor: pointer;
	}

	#toggle-button:hover {
		border-color: var(--orange);
		color: var(--orange);
	}

	.button-dropdown {
		display: none;
		border-radius: 25px;
		border: 1px solid white;
		background-color: black;
		position: absolute;
		right: 0;
		margin-top: 5px;
		padding: 15px;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 5px;
	}

	.button-dropdown button {
		width: 80px;
		height: 30px;
		padding: 5px 0;
		cursor: pointer;
		background-color: rgb(28, 123, 212);
		border: 1px solid black;
		border-radius: 5px;
		color: white;
	}

	.button-dropdown button:hover {
		border: none;
	}

	.animate {
		transition: 0.5s;
		transform: rotate(-180deg);
	}
</style>
<template>
	<div class="modal" v-if="visible">
		<div class="text">{{info}}</div>
		<div class="choices">
			<button class="cancel" @click="userCanceled">{{cancelButtonText}}</button>
			<button class="confirm" @click="userConfirmed">{{confirmButtonText}}</button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'PopupChoice',

	emits: ['confirmed', 'canceled'],

	props: {
		title: {
			type: String,
			required: true
		},
		info: {
			type: String,
			required: true
		},
		visible: {
			type: Boolean,
			required: true,
		},
		cancelButtonText: {
			type: String,
			default: 'Cancel'
		},
		confirmButtonText: {
			type: String,
			default: 'Confirm'
		},
	},

	methods: {
		userConfirmed() {
			this.$emit("confirmed", this.title);
		},

		userCanceled() {
			this.$emit("canceled");
		}
	}
}
</script>

<style scoped>
	.modal {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: white;
		box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
		border-radius: 5px;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}

	.cancel {
		background-color: rgb(98, 98, 98);
	}

	.modal .text {
		color: black;
		font-weight: 700;
		font-size: 22px;
		padding: 30px;
	}

	.modal .choices {
		display: flex;
		justify-content: space-between;
		padding: 30px;
	}

	button {
		margin: 0 20px;
		padding: 10px;
		background-color: rgb(28, 123, 212);
		border: 1px solid black;
		border-radius: 5px;
		color: white;
	}
</style>
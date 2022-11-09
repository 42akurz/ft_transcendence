<template>
	<div class="modal" v-if="visible">
		<div class="text">{{info}}</div>
		<div class="choices">
			<button class="confirm" @click="userConfirmed">{{confirmButtonText}}</button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'PopupInformation',

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
		confirmButtonText: {
			type: String,
			default: 'Ok'
		},
	},

	methods: {
		userConfirmed() {
			this.$emit("confirmed");
		},
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
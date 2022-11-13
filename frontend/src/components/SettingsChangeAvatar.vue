<template>
	<div class="change-avatar-wrapper">
		<h2>Change Profile Picture</h2>
		<div>Current Picture:</div>
		<img :src="imageLink" width="65">
		<form @submit.prevent="onSubmit" enctype="multipart/form-data">
			<img v-if="previewImage" :src="previewImage" class="uploading-image" width="100" height="100"/>
			<input type="file" ref="file" id="selectedFile" style="display: none;" @change="onSelect"/>
			<input type="button" value="Upload Image" onclick="document.getElementById('selectedFile').click();" />
			<button>Submit</button>
			<small v-if="message">{{message}}</small>
		</form>
	</div>
</template>

<script>
import axios from 'axios'
import store from '@/store/index.js'

export default {
	name: 'SettingsChangeAvatar',

	data() {
		return {
			previewImage: '',
			file: '',
			message: ''
		}
	},

	props: {
		currentUser: {
			type: Object,
			required: true
		}
	},

	computed: {
		imageLink() {
			if (this.currentUser.avatarId === 1 && this.currentUser.profilePictureURL)
				return this.currentUser.profilePictureURL;
			else
				return `${process.env.VUE_APP_HOST_URL}:3000/database-files/${this.currentUser.avatarId}`;
		},
	},

	methods: {
		onSelect(e){
			const image = e.target.files[0];
			const reader = new FileReader();
			reader.readAsDataURL(image);
			reader.onload = e => {
				this.previewImage = e.target.result;
			}
			const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
			const file = this.$refs.file.files[0];
			this.file = file;
			if (!allowedTypes.includes(file.type)) {
				this.message = "Filetype is wrong!!"
			}
			if (file.size > 500000) {
				this.message = 'Too large, max size allowed is 500kb'
			}
		},

		async onSubmit(){
			const formData = new FormData();
			formData.append('file',this.file);
			try {
				await axios.post(`${process.env.VUE_APP_HOST_URL}:3000/users/avatar/`, formData, {withCredentials: true});
				this.previewImage = '';
				store.dispatch('fetchCurrentUser');
			}
			catch (err) {
				console.log(err);
				this.message = err.response.data.error
			}
		}
	},
}
</script>

<style scoped>
	.change-avatar-wrapper {
		background-color: var(--grey);
		padding: 50px;
		border: 5px solid var(--blue-dark);
		/* border-radius: 60px; */
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		gap: 14px;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 5px;
		justify-content: center;
		align-items: center;
	}

	input {
		width: 150px;
		height: 30px;
		cursor: pointer;
		margin: 0 10px;
		border: 2px solid var(--blue-dark);
		background-color: var(--orange);
		color: var(--blue-dark);
		border-radius: 25px;
	}

	button {
		width: 150px;
		height: 30px;
		cursor: pointer;
		margin: 0 10px;
		border: 2px solid var(--blue-dark);
		background-color: var(--blue-light);
		color: var(--grey);
		border-radius: 25px;
	}

	button:hover {
		border: 2px solid  var(--blue-dark);
		color:  var(--grey);
		background-color:  var(--blue-light);
	}
</style>
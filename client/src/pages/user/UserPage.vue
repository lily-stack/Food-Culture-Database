<template>
	<div class="p-4">
		<!-- User Profile Section -->
		<div class="flex items-center justify-between mb-6">
			<div class="flex items-center gap-4">
				<img
					:src="user.profilePicture"
					alt="Profile Picture"
					class="w-16 h-16 rounded-full object-cover border border-gray-200"
				/>
				<div class="flex flex-col">
					<h2 class="text-xl font-bold">{{ user.username }}</h2>
					<p class="text-gray-600 text-sm">{{ user.email }}</p>
				</div>
			</div>
			<button
				class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
				@click="editProfile"
			>
				Edit Profile
			</button>
		</div>

		<!-- Recipes Section -->
		<div class="flex justify-between items-center mb-4">
			<h2 class="text-xl font-bold">My Recipes</h2>
			<!-- TODO: fix this router link -->
			<RouterLink to="/recipes/create">
				<button
					class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
				>
					+ Add Recipe
				</button>
			</RouterLink>
		</div>

		<!-- TODO: needs to actually be filled with recipes -->
		<RecipeList :recipes="undefined"/>

		<!-- Edit Profile Modal -->
		<div
			v-if="editingProfile"
			class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
		>
			<div class="bg-white rounded p-6 w-full max-w-md">
				<h2 class="text-xl font-bold mb-4">Edit Profile</h2>
				<form @submit.prevent="saveProfile">
					<label class="block mb-2 font-semibold">Username</label>
					<input
						v-model="userForm.username"
						type="text"
						class="border p-2 rounded w-full mb-4"
						required
					/>

					<label class="block mb-2 font-semibold">Email</label>
					<input
						v-model="userForm.email"
						type="email"
						class="border p-2 rounded w-full mb-4"
						required
					/>

					<label class="block mb-2 font-semibold">Profile Picture</label>
					<input
						type="file"
						accept="image/*"
						@change="handleFile"
						class="border p-2 rounded w-full mb-4"
					/>

					<div class="flex justify-end gap-2">
						<button
							type="button"
							class="px-4 py-2 rounded border hover:bg-gray-100"
							@click="cancelProfileEdit"
						>
							Cancel
						</button>
						<button
							type="submit"
							class="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
						>
							Save
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import RecipeList from '../map/RecipeList.vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

interface User {
	username: string;
	email: string;
	profilePicture: string;
}
const authStore = useAuthStore();

const user = computed(() => {
	return {
		username: authStore.fullName ?? '',
		email: authStore.currentUser?.signInDetails?.loginId ?? '',
		profilePicture: authStore.userAttributes?.picture ?? 'Default_profile_pic.jpg'
	}
});

const userForm = reactive<User>({
	username: '',
	email: '',
	profilePicture: ''
});

const editingProfile = ref(false);

const selectedFile = ref<File | null>(null);

async function handleFile(event: Event) {
	const file = (event.target as HTMLInputElement).files?.[0] || null;
	if (!file) {
		selectedFile.value = null;
		return;
	}
	selectedFile.value = file;
	const res = await fetch(`/api/s3/pictures?fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}`);
	const { uploadUrl, fileUrl } = await res.json();
	await fetch(uploadUrl, {
		method: 'PUT',
		headers: {
			'Content-Type': file.type
		},
		body: file
	});
	userForm.profilePicture = fileUrl;
}

// Profile editing
function editProfile() {
	editingProfile.value = true;
	userForm.username = user.value.username;
	userForm.email = user.value.email;
	userForm.profilePicture = user.value.profilePicture;
}

async function saveProfile() {
	await authStore.updateProfile(userForm);
	editingProfile.value = false;
}

function cancelProfileEdit() {
	editingProfile.value = false;
}
</script>

<style scoped></style>

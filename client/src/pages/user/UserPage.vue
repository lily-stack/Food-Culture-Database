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
			<RouterLink to="/recipe/new-recipe">
				<button
					class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
				>
					+ Add Recipe
				</button>
			</RouterLink>
		</div>

		<!-- TODO: needs to actually be filled with recipes -->
		<RecipeList :loading="false"/>

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

					<label class="block mb-2 font-semibold">Profile Picture URL</label>
					<input
						v-model="userForm.profilePicture"
						type="text"
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

interface Recipe {
	id: number;
	title: string;
	imageSrc: string;
}

interface User {
	username: string;
	email: string;
	profilePicture: string;
}
const authStore = useAuthStore();

const user = computed(() => {
	return {
		username: authStore.currentUser?.username ?? '',
		email: authStore.currentUser?.signInDetails?.loginId ?? '',
		profilePicture: authStore.currentUser?.signInDetails?.picture ?? 'https://via.placeholder.com/150'
	}
});

const userForm = reactive<User>({
	username: '',
	email: '',
	profilePicture: ''
});

const editingProfile = ref(false);

// Profile editing
function editProfile() {
	editingProfile.value = true;
	userForm.username = user.value.username;
	userForm.email = user.value.email;
	userForm.profilePicture = user.value.profilePicture;
}

function saveProfile() {
	// TODO: Implement updateProfile
	// await authStore.updateProfile(userForm);
	editingProfile.value = false;
}

function cancelProfileEdit() {
	editingProfile.value = false;
}
</script>

<style scoped></style>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import Navbar from './navbar/Navbar.vue';
import { useRoute } from 'vue-router';

const authStore = useAuthStore();
const route = useRoute();

onMounted(async () => {
	await authStore.checkAuthStatus();
});
</script>

<template>
	<!-- Loading Page While Authenticating -->
	<div v-if="authStore.isCheckingAuth"
		class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
		<div class="text-center">
			<div
				class="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4">
			</div>
			<p class="text-gray-600 font-semibold">Loading...</p>
		</div>
	</div>

	<!-- Main App While Not Authenticating -->
	<div v-else class="bg h-screen overflow-auto gutter-stable">
		<div class="bg-white max-w-5xl px-6 m-auto min-h-full border-x border-gray-200">
			<Navbar v-if="route.path !== '/auth'" class="sticky top-0" />
			<div class="px-1 mt-2">
				<main>
					<!-- Map a path to your page components in src/router/index.ts -->
					<RouterView />
				</main>
			</div>
		</div>
	</div>
</template>

<style scoped>
.bg {
	background: linear-gradient(to bottom, #fafafa, #f0f0f0);
}
.gutter-stable {
	scrollbar-gutter: stable;
}
</style>
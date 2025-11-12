<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router';
import PageLayout from './PageLayout.vue';

const authStore = useAuthStore();
const route = useRoute();

onMounted(async () => {
	await authStore.checkAuthStatus();
});
</script>

<template>
	<!-- Loading Page While Authenticating -->
	<div v-if="authStore.isCheckingAuth"
		class="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
		<div class="text-center">
			<div
				class="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4">
			</div>
			<p class="text-gray-600 font-semibold">Loading...</p>
		</div>
	</div>

	<!-- Main App While Not Authenticating -->
	<template v-else>
		<PageLayout v-if="!route.meta.ignorePageLayout">
			<RouterView />
		</PageLayout>
		<main v-else>
			<RouterView />
		</main>
	</template>
</template>

<style scoped>
.bg {
	background: linear-gradient(to bottom, #fafafa, #f0f0f0);
}

.gutter-stable {
	scrollbar-gutter: stable;
}
</style>
<script setup lang="ts">
import Navbar from './navbar/Navbar.vue';

</script>

<template>
	<div class="bg h-screen overflow-auto">
		<div class="bg-white max-w-6xl px-6 m-auto min-h-full border-x border-gray-200">
			<Navbar class="sticky top-0" />
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
</style>

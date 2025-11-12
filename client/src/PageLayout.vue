<template>
	<div class="bg h-screen overflow-auto gutter-stable">
		<div class="bg-white max-w-5xl px-6 m-auto min-h-full border-x border-gray-200">
			<Navbar class="sticky top-0" />
			<main class="px-1 mt-2">
				<slot></slot>
			</main>
		</div>
	</div>
</template>

<script setup lang="ts">
import Navbar from './navbar/Navbar.vue';

</script>

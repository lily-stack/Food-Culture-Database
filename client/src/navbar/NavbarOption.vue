<template>
	<div class="py-1 px-2 rounded-xl transition-colors duration-300"
		:class="{ 'bg-gray-100': route.path === path }">
		<RouterLink :to="path">
			<span class="transition-colors duration-300 text-gray-500 hover:text-gray-800"
				:class="{ 'text-gray-800': route.path === path }">
				<slot></slot>
			</span>
		</RouterLink>
	</div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const props = defineProps<{
	path: string
}>();
</script>


<style scoped></style>

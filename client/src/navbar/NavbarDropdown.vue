<template>
	<div class="min-w-52 bg-white border border-gray-200 rounded-lg shadow-lg py-1 flex flex-col">
		<div class="py-2 px-4 hover:bg-gray-100 transition-colors cursor-pointer" tabindex="0" @click="navigate('profile')">
			<i class="fa-solid fa-circle-user mr-0.5"></i>
			Profile
		</div>
		<div class="py-2 px-4 hover:bg-gray-100 transition-colors cursor-pointer" tabindex="0">
			<i class="fa-solid fa-right-from-bracket mr-0.5 rotate-180"></i>
			Log out
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const emit = defineEmits(['close']);
const router = useRouter();

function navigate(path: string) {
	emit('close');
	router.push({ path });
}
</script>

<style scoped></style>

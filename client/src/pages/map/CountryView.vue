<template>
	<div class="bg-white rounded-lg shadow-lg p-4">
		<div>
			<div class="float-right text-2xl mr-1 text-gray-800 cursor-pointer" @click="cancel">
				<i class="fa-solid fa-xmark"></i>
			</div>
			<h1>{{ countryName }}</h1>
		</div>
	</div>
</template>

<script setup lang="ts">
	const props = defineProps<{
		countryName: string
	}>();
	const emit = defineEmits<{
		(e: 'cancel'): void;
	}>();

	function cancel() {
		emit("cancel");
	}
</script>

<style scoped></style>

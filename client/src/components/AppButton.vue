<template>
	<button class="border transition-colors rounded-lg px-2 py-0.5 text-gray-700 cursor-pointer shadow-sm"
		:class="{
			'': variant === 'primary',
			'bg-white border-gray-300 hover:bg-gray-100 active:bg-gray-200': variant === 'secondary'
		}"
		
		@click="emit('click')"
	>
		<slot></slot>
	</button>
</template>

<script setup lang="ts">

//TODO: figure out good primary colors
const props = withDefaults(defineProps<{
	variant?: "primary" | "secondary"
}>(), {
	variant: "secondary"
});
const emit = defineEmits<{
	(e: 'click'): void;
}>();
</script>

<style scoped></style>

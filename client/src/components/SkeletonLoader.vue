<template>
	<div class="animate-pulse" :class="{
		'h-6': type === 'text'
	}">
		<div class="h-full bg-gray-300 rounded"></div>
	</div>
</template>

<script setup lang="ts">
type SkeletonType = "text" | "card";

const props = withDefaults(defineProps<{
	type?: SkeletonType
}>(), {
	type: "text"
})
</script>

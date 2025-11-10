<template>
	<div class="animate-pulse" :class="{
		'h-[1.5em]': type === 'text'
	}">
		<div class="h-full bg-gray-300 rounded"></div>
	</div>
</template>

<script setup lang="ts">

// Text will make it the height of text. Card will make it grow in height to fit its container.
type SkeletonType = "text" | "card";

const props = withDefaults(defineProps<{
	type?: SkeletonType
}>(), {
	type: "text"
})
</script>

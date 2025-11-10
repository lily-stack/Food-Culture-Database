<template>
	<div class="p-3 justify-between flex gap-3">
		<SkeletonLoader class="w-24 h-24 rounded-md shrink-0" type="card" />
		<div class="flex flex-col w-full">
			<SkeletonLoader class="mt-1 w-1/2" />
			<SkeletonLoader class="mt-2 w-full" />
			<SkeletonLoader class="mt-1 w-1/4" />
		</div>
	</div>
</template>

<script setup lang="ts">
import SkeletonLoader from '@/components/SkeletonLoader.vue';

</script>

<style scoped></style>

<template>
	<div class="border border-gray-200 rounded-lg shadow-lg">
		<div class="py-1 px-3 border-b border-gray-200 bg-gray-100">
			<p class="text-gray-600 font-semibold italic">
				<slot name="name"></slot>
			</p>
		</div>
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
</script>

<style scoped></style>

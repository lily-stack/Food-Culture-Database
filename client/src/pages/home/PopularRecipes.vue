<template>
	<Card>
		<template #name>
			<span class="italic">Popular Recipes</span>
		</template>
		<Transition name="fade" appear>
			<div class="p-3 h-[300px]">Hello, world!</div>
		</Transition>
	</Card>
</template>

<script setup lang="ts">
import Card from './Card.vue';

</script>


<style scoped></style>

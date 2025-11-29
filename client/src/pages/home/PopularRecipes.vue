<template>
	<Card>
		<template #name>
			Popular Recipes
		</template>
		<Transition name="fade" appear>
			<div class="p-3">Hello, world!</div>
		</Transition>
	</Card>
</template>

<script setup lang="ts">
import Card from './Card.vue';

</script>


<style scoped></style>

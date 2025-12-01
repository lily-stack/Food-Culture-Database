<template>
	<Card>
		<template #name>
			<span>Popular Recipes</span>
		</template>
		<div class="p-2 grid grid-cols-1 md:grid-cols-2">
			<RecipeListItemSkeletonLoader v-for="_ in new Array(6)" />
		</div>
	</Card>
</template>

<script setup lang="ts">
import RecipeListItemSkeletonLoader from '../map/RecipeListItemSkeletonLoader.vue';
import Card from './Card.vue';

</script>


<style scoped></style>

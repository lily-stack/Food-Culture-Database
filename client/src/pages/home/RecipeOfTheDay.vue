<template>
	<Card>
		<template #name>
			Recipe of the Day
		</template>
		<template v-if="recipe === null">
			<RecipeListItemSkeletonLoader />
		</template>
		<template v-else>
			<Transition name="fade" appear>
				<RouterLink :to="`/recipes/${recipe?.recipe_id}`">
					<RecipeListItemContent :recipe="recipe" />
				</RouterLink>
			</Transition>
		</template>
	</Card>
</template>

<script setup lang="ts">
import type { Recipe } from 'shared';
import { onMounted, ref } from 'vue';
import Card from './Card.vue';
import RecipeListItemSkeletonLoader from '../map/RecipeListItemSkeletonLoader.vue';
import RecipeListItemContent from '../map/RecipeListItemContent.vue';

const recipe = ref<Recipe | null>(null);

onMounted(() => {
	fetch('/api/recipes/daily').then(async response => {
		if (response.ok) {
			recipe.value = await response.json();
		};
	})
})
</script>


<style scoped></style>

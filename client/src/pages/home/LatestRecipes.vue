<template>
	<Card>
		<template #name>Latest Recipes</template>
		<div class="p-2 grid grid-cols-1 md:grid-cols-2">
			<template v-if="recipes == null">
				<RecipeListItemSkeletonLoader v-for="_ in new Array(6)" />
			</template>
			<template v-else>
				<TransitionGroup name="fade" appear>
					<RecipeListItemContent v-for="recipe in recipes"
						:key="recipe.recipe_id"
						:recipe="recipe"
						:show-arrow="false"
					/>
				</TransitionGroup>
			</template>
		</div>
	</Card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import RecipeListItemSkeletonLoader from '../map/RecipeListItemSkeletonLoader.vue';
import Card from './Card.vue';
import type { PaginatedRecipesResponse, Recipe } from 'shared';
import RecipeListItemContent from '../map/RecipeListItemContent.vue';

const recipes = ref<Recipe[] | null>(null);

onMounted(() => {
	fetch('/api/recipes?page=1&sortby=date').then(async response => {
		if (response.ok) {
			const body = await response.json() as PaginatedRecipesResponse;
			recipes.value = body.recipes.slice(0, 6);
		};
	})
})

</script>


<style scoped></style>

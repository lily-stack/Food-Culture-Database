<template>
	<Card>
		<template #name>Popular Recipes</template>
		
		<div class="p-2 grid grid-cols-1 md:grid-cols-2 gap-2">
			<template v-if="recipes == null">
				<RecipeListItemSkeletonLoader v-for="_ in new Array(6)" :key="_" />
			</template>
			<template v-else-if="recipes.length === 0">
				<div class="col-span-full text-center py-8 text-gray-500">
					No recipes found. Be the first to add one!
				</div>
			</template>
			<template v-else>
				<TransitionGroup name="fade" appear>
					<RouterLink v-for="recipe in recipes"
						:key="recipe.recipe_id"
						:to="`/recipes/${recipe.recipe_id}`"
					>
						<RecipeListItemContent
							:recipe="recipe"
							:show-arrow="false"
						/>
					</RouterLink>
				</TransitionGroup>
			</template>
		</div>
		
		<div v-if="error" class="px-4 pb-4 text-red-600 text-sm">
			Failed to load recipes. Please try again.
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
const error = ref(false);

async function loadRecipes() {
	try {
		error.value = false;
		const response = await fetch('/api/recipes?page=1&sortby=popularity');
		if (response.ok) {
			const body = await response.json() as PaginatedRecipesResponse;
			recipes.value = body.recipes.slice(0, 6);
		} else {
			error.value = true;
		}
	} catch (err) {
		error.value = true;
		console.error('Failed to fetch recipes:', err);
	}
}

onMounted(() => {
	loadRecipes();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
	opacity: 0;
	transform: translateY(10px);
}

.fade-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}

.fade-move {
	transition: transform 0.3s ease;
}
</style>
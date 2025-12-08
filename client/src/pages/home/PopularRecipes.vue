<template>
	<Card>
		<template #name>
			<div class="flex items-center justify-between">
				<span>Popular Recipes</span>
				<button 
					v-if="recipes && recipes.length > 0"
					@click="refreshRecipes" 
					class="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1 group"
					:disabled="isRefreshing"
				>
					<svg 
						class="w-4 h-4 transition-transform duration-500 group-hover:rotate-180"
						:class="{ 'animate-spin': isRefreshing }"
						fill="none" 
						stroke="currentColor" 
						viewBox="0 0 24 24"
					>
						<path 
							stroke-linecap="round" 
							stroke-linejoin="round" 
							stroke-width="2" 
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
						/>
					</svg>
					{{ isRefreshing ? 'Refreshing...' : 'Refresh' }}
				</button>
			</div>
		</template>
		
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
					<RecipeListItemContent 
						v-for="(recipe, index) in recipes"
						:key="recipe.recipe_id"
						:recipe="recipe"
						:show-arrow="false"
					/>
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
const isRefreshing = ref(false);

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

async function refreshRecipes() {
	isRefreshing.value = true;
	await loadRecipes();
	isRefreshing.value = false;
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
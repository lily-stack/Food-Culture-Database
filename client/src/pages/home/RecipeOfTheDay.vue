<template>
	<div class="border border-gray-200 rounded-lg shadow-md">
		<div class="py-1 px-3 border-b border-gray-200 bg-gray-100">
			<p class="text-gray-600 font-semibold">Recipe of the Day</p>
		</div>
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
	</div>
</template>

<script setup lang="ts">
import type { Recipe } from 'shared';
import { onMounted, ref } from 'vue';
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

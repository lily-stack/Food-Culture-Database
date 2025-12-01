<template>
	<RouterLink :to="`recipes/${recipe.recipe_id}`">
		<RecipeListItemContent class="border border-gray-200 rounded-lg shadow-md" :recipe="recipe" />
	</RouterLink>
</template>

<script setup lang="ts">
import { convertMinutesToReadableString } from '@/util/recipe/recipeUtils';
import type { Recipe } from 'shared';
import RecipeListItemContent from './RecipeListItemContent.vue';


const props = defineProps<{
	recipe: Recipe
}>();

</script>

<style scoped></style>

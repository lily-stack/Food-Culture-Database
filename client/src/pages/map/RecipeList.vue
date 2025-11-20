<template>
	<div class="flex flex-col gap-2 overflow-y-auto pb-2">
		<TransitionGroup name="fade" appear>
			<template v-if="isLoading">
				<RecipeListItemSkeletonLoader
					v-for="(_, index) in new Array(3)"
					:key="index"
				/>
			</template>
			<template v-else>
				<RecipeListItem
					v-for="(recipe, index) in recipes"
					:key="recipe.title"
					:recipeId="recipe.recipe_id"
					:title="recipe.title"
					:description="recipe.dish_description"
					:imgSrc="recipe.img_src"
					:ratings="recipe.ratings"
					:servings="recipe.servings"
					:cookingTime="recipe.cooking_time"
				/>
			</template>
		</TransitionGroup>
	</div>
</template>

<script setup lang="ts">
import { computed, TransitionGroup } from 'vue';
import RecipeListItem from './RecipeListItem.vue';
import RecipeListItemSkeletonLoader from './RecipeListItemSkeletonLoader.vue';
import type { RecipeDTO } from 'shared';

const props = defineProps<{
	recipes: RecipeDTO[] | undefined
}>();

const isLoading = computed(() => props.recipes === undefined);
</script>

<style scoped>
</style>

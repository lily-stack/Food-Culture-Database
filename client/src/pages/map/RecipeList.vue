<template>
	<div class="flex flex-col gap-2.5 overflow-y-auto pb-2">
		<TransitionGroup name="fade" appear>
			<template v-if="isLoading">
				<RecipeListItemSkeletonLoader
					v-for="(_, index) in new Array(3)"
					:key="index"
				/>
			</template>
			<template v-else>
				<template v-if="recipes && recipes.length">
					<RecipeListItem
						v-for="(recipe, index) in recipes"
						:key="recipe.recipe_id"
						:recipe="recipe"
					/>
				</template>
				<template v-else>
					<span class="text-gray-500 m-auto">No recipes found</span>
				</template>
			</template>
		</TransitionGroup>
	</div>
</template>

<script setup lang="ts">
import { computed, TransitionGroup } from 'vue';
import RecipeListItem from './RecipeListItem.vue';
import RecipeListItemSkeletonLoader from './RecipeListItemSkeletonLoader.vue';
import type { Recipe } from 'shared';

// Will assume loading if recipes is undefined
const props = defineProps<{
  recipes?: Recipe[];
}>();

const isLoading = computed(() => props.recipes === undefined);
</script>

<style scoped>
</style>

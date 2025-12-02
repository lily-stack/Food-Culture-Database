<template>
	<Card>
		<template #name>
			<span>Recipe of the Day</span>
		</template>
		<template v-if="recipe === null">
			<div class="p-1">
				<RecipeListItemSkeletonLoader />
			</div>
		</template>
		<template v-else>
			<Transition name="fade" appear>
				<div class="p-1">
					<RouterLink :to="`/recipes/${recipe?.recipe_id}`">
						<RecipeListItemContent class="rounded-md" :recipe="recipe" />
					</RouterLink>
				</div>
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

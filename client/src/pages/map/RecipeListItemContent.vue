<template>
	<div class="p-3 flex justify-between gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
		<div class="flex gap-3 grow min-w-0">
			<img :src="recipe.img_src" class="w-24 h-24 rounded-md object-cover border border-gray-200" />
			<div class="flex flex-col grow min-w-0">
				<h4 class="text-gray-900 truncate">{{ recipe.title }}</h4>
				<div class="text-xs text-gray-600 flex flex-row">
					<div title="Rating" class="pr-2 mr-2 border-r border-gray-200">
						<i class="fa-regular fa-heart"></i>
						<span class="ml-0.5">{{ recipe.rating.toLocaleString('en-US') }}</span>
					</div>
					<div title="Preparation time" class="mr-2">
						<i class="fa-regular fa-clock"></i>
						<span class="ml-0.5">{{ convertMinutesToReadableString(recipe.cooking_time) }}</span>
					</div>
					<div title="Number of servings">
						<i class="fa-regular fa-user"></i>
						<span class="ml-0.5">{{ recipe.servings }}</span>
					</div>
				</div>
				<p class="mt-1.5 text-gray-700 line-clamp-2 text-sm">
					{{ recipe.dish_description }}
				</p>
			</div>
		</div>
		<div class="flex">
			<div class="m-auto text-2xl text-gray-800">
				<i class="fa-solid fa-angle-right"></i>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { convertMinutesToReadableString } from '@/util/recipe/recipeUtils';
import type { Recipe } from 'shared';

const props = defineProps<{
	recipe: Recipe
}>();

</script>

<style scoped></style>

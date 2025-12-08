<template>
	<div class="p-3 flex justify-between gap-2 cursor-pointer rounded-md hover:bg-gray-50 transition-colors">
		<div class="flex gap-3 grow min-w-0">
			<img :src="recipe.image_src" class="w-24 h-24 rounded-md object-cover border border-gray-200" />
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
					<div title="Number of servings" class="pr-2 mr-2 border-r border-gray-200">
						<i class="fa-regular fa-user"></i>
						<span class="ml-0.5">{{ recipe.servings }}</span>
					</div>
					<div title="Countries" class="truncate min-w-0 basis-0 grow">
						<i class="fa-regular fa-flag"></i>
						<span class="ml-0.5">{{ countryNames }}</span>
					</div>
				</div>
				<p class="mt-1.5 text-gray-700 line-clamp-2 text-sm">
					{{ recipe.dish_description }}
				</p>
			</div>
		</div>
		<div v-if="showArrow" class="flex">
			<div class="m-auto text-2xl text-gray-800">
				<i class="fa-solid fa-angle-right"></i>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { getCountryName } from '@/util/country/countryUtils';
import { convertMinutesToReadableString } from '@/util/recipe/recipeUtils';
import type { Recipe } from 'shared';
import { computed } from 'vue';

const props = withDefaults(defineProps<{
	recipe: Recipe
	showArrow?: boolean
}>(), {
	showArrow: true
});

const countryNames = computed<string>(() => {
	const limit = 2;
	let ret = props.recipe.countries
		.slice(0, limit)
		.map(code => getCountryName(code))
		.join(', ');
	if (props.recipe.countries.length > limit) {
		ret += `, and ${props.recipe.countries.length - limit} more`;
	}
	return ret;
});

</script>

<style scoped></style>

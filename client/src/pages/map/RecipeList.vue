<template>
	<div class="flex flex-col gap-2 overflow-y-auto pb-2">
		<TransitionGroup name="fade" appear>
			<template v-if="loading">
				<RecipeListItemSkeletonLoader
					v-for="(_, index) in new Array(3)"
					:key="index"
				/>
			</template>
			<template v-else>
				<RecipeListItem
					v-for="(recipe, index) in fakeRecipes"
					:key="recipe.title"
					:imgSrc="recipe.imageSrc"
					:title="recipe.title"
				/>
			</template>
		</TransitionGroup>
	</div>
</template>

<script setup lang="ts">
import type { CountryCode } from '@/types/country';
import { computed, reactive, ref, TransitionGroup } from 'vue';
import RecipeListItem from './RecipeListItem.vue';
import RecipeListItemSkeletonLoader from './RecipeListItemSkeletonLoader.vue';

const props = defineProps<{
	loading: boolean
}>();

type Recipe = {
	title: string
	imageSrc: string
	countries: CountryCode[]
}

const fakeRecipes = reactive<Recipe[]>([
	{
		title: "Bibimbap",
		imageSrc: "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_4:3/k%2FPhoto%2FRecipes%2F2024-03-bimbimbap%2Fbibimbap-074",
		countries: ["KR", "KP"]
	},
	{
		title: "Jajangmyeon",
		imageSrc: "https://www.beyondkimchee.com/wp-content/uploads/2023/11/jajangmyeon-black-bean-noodles-thumbnail.jpg",
		countries: ["KR", "KP", "CN"]
	},
])
</script>

<style scoped>
</style>

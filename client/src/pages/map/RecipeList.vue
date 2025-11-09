<template>
	<div class="flex flex-col gap-2 overflow-y-auto pb-2">
		<RecipeListItem v-for="recipe in fakeRecipes"
			:imgSrc="recipe.imageSrc"
			:title="recipe.title"
		/>
	</div>
</template>

<script setup lang="ts">
import type { CountryCode } from '@/types/country';
import { computed, reactive, ref } from 'vue';
import RecipeListItem from './RecipeListItem.vue';

const props = defineProps<{
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

<style scoped></style>

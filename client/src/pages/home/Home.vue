<template>
	<div class="">
		<div class="flex">
			<h1 class="m-auto text-gray-900 font-[Merriweather] font-normal">
				Welcome to Recipes Worldwide
			</h1>
		</div>
		<p class="mt-4 text-gray-600 text-center">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultrices, nisi nec 
			vehicula commodo, purus diam ultricies leo, sed euismod quam est id diam. Mauris 
			pretium rhoncus nisl, ac varius augue sagittis non. Ut fermentum risus a blandit auctor. 
			Donec eget mollis dolor. Quisque sit amet euismod nulla. Phasellus ullamcorper venenatis 
			magna. Duis eu facilisis tellus. 
		</p>
		<div class="mt-3 flex justify-center gap-4">
			<AppButton variant="primary" @click="router.push('/map')">
				<i class="fa-solid fa-earth-americas"></i>
				Explore the World
			</AppButton>
			<AppButton @click="router.push('/recipes/create')">
				<i class="fa-solid fa-plus"></i>
				Create a Recipe
			</AppButton>
		</div>
		<div class="mt-7 mb-4 flex flex-col gap-5">
			<RecipeOfTheDay />
			<PopularRecipes />
			<LatestRecipes />
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import RecipeOfTheDay from './RecipeOfTheDay.vue';
import PopularRecipes from './PopularRecipes.vue';
import LatestRecipes from './LatestRecipes.vue';
import AppButton from '@/components/AppButton.vue';
import { useRouter } from 'vue-router';

const router = useRouter()

onMounted(() => {
})
</script>


<style scoped></style>

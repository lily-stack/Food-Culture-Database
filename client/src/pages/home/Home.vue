<template>
	<img class="w-full h-[100px]" src="../../burger.jpg"></img>
	<div class="mt-2">
		<h2 v-if="requestReceived === true">
			API connection working!
		</h2>
		<h2 v-else-if="requestReceived === false">
			API connection failed. Run npm run dev in the server directory to start it
		</h2>
		<h2 v-else>
			Testing connection to API...
		</h2>
	</div>
	<RecipeOfTheDay class="mt-3"/>
	<PopularRecipes class="mt-4"/>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import RecipeOfTheDay from './RecipeOfTheDay.vue';
import PopularRecipes from './PopularRecipes.vue';


const requestReceived = ref<boolean | undefined>(undefined);

onMounted(() => {
	fetch('/api/test').then(response => {
		if (response.ok) {
			requestReceived.value = true;
		} else {
			requestReceived.value = false;
		}
	})
	fetch('/api/recipes?page=1&country=kr').then(async response => {
		if (response.ok) {
			const data = await response.json();
			console.log(data)
		}
	})
})
</script>


<style scoped></style>

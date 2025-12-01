<template>
	<div class="flex flex-col">
		<RecipeList class="basis-0 min-h-0 grow" :recipes="recipes" />
		<PageController v-if="numPages !== undefined" :numPages="numPages" :current-page="currentPage" @update:current-page="onChangePage" />
	</div>
</template>

<script setup lang="ts">
import RecipeList from './RecipeList.vue';
import PageController from './PageController.vue';
import type { Recipe } from 'shared';

const props = defineProps<{
	recipes: Recipe[] | undefined
	numPages: number | undefined
	currentPage: number
}>();

const emit = defineEmits<{
	(e: 'changePage', page: number): void
}>();

function onChangePage(page: number) {
	emit('changePage', page);
}

</script>

<style scoped></style>

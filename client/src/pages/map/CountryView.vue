<template>
	<div class="bg-white rounded-lg shadow-lg p-4 border border-gray-200 flex flex-col">
		<div>
			<div class="float-right text-2xl mr-1 text-gray-800 cursor-pointer" @click="cancel">
				<i class="fa-solid fa-xmark"></i>
			</div>
			<h1>{{ countryName }}</h1>
		</div>
		<div class="mt-4">
			<SkeletonLoader v-if="isLoading" type="text" class="w-1/4" />
			<Transition v-else name="fade" appear>
				<p class="text-gray-700">Found {{ totalRecipes }} dishes:</p>
			</Transition>
		</div>
		<PaginatedRecipeList
			class="mt-2 grow"
			:recipes="recipes"
			:num-pages="totalPages"
			:current-page="currentPage"
			@change-page="handleChangePage" />
	</div>
</template>

<script setup lang="ts">
import SkeletonLoader from '@/components/SkeletonLoader.vue';
import { computed, ref, watch } from 'vue';
import PaginatedRecipeList from './PaginatedRecipeList.vue';
import type { CountryCode, PaginatedRecipesResponse, RecipeDTO } from 'shared';
import { getCountryName } from '@/util/country/country';

const props = defineProps<{
	countryCode: CountryCode
}>();
const emit = defineEmits<{
	(e: 'cancel'): void;
}>();

const isLoading = ref<boolean>(true);
const currentPage = ref<number>(1);
const totalPages = ref<number | undefined>(undefined);
const totalRecipes = ref<number | undefined>(undefined)
const recipes = ref<RecipeDTO[] | undefined>(undefined);

const countryName = computed(() => getCountryName(props.countryCode));

function cancel() {
	emit("cancel");
}

function handleChangePage(page: number) {
	currentPage.value = page;
}

async function loadRecipes() {
	isLoading.value = true;
	recipes.value = undefined;
	totalPages.value = undefined;
	try {
		const result = await fetch(`/api/recipes?country=${props.countryCode.toLowerCase()}&limit=10`);
		if (result.ok) {
			const res = await result.json() as PaginatedRecipesResponse;
			recipes.value = res.recipes;
			totalRecipes.value = res.totalItems;
			totalPages.value = res.totalPages;
		} else {
			alert('failure')
		}
	} finally {
		isLoading.value = false;
	}
}

watch(() => props.countryCode, () => {
	loadRecipes();
}, { immediate: true });
</script>

<style scoped></style>

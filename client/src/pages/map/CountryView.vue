<template>
	<div class="bg-white rounded-lg shadow-lg p-4 border border-gray-200 flex flex-col">
		<div>
			<div class="float-right text-2xl mr-1 text-gray-800 cursor-pointer" @click="cancel">
				<i class="fa-solid fa-xmark"></i>
			</div>
			<h1>{{ countryName }}</h1>
		</div>
		<div class="mt-2 flex justify-between items-end">
			<SkeletonLoader v-if="isLoadingFirstPage" type="text" class="w-1/4" />
			<Transition v-else name="fade" appear>
				<p class="text-gray-700">Found {{ totalRecipes ?? 0 }} dish{{ totalRecipes === 1 ? '' : 'es' }}:</p>
			</Transition>
			<RouterLink :to="`/recipes/create?country=${countryCode}`">
				<AppButton variant="secondary">
					<i class="fa-solid fa-plus"></i>
					Create Recipe
				</AppButton>
			</RouterLink>
		</div>
		<PaginatedRecipeList v-if="!error" class="mt-2 grow" :recipes="recipes" :num-pages="totalPages"
			:current-page="currentPage" @change-page="handleChangePage" />
		<div v-else class="m-auto text-red-500">
			{{ error }}
		</div>
	</div>
</template>

<script setup lang="ts">
import SkeletonLoader from '@/components/SkeletonLoader.vue';
import AppButton from '@/components/AppButton.vue';
import { computed, ref, watch } from 'vue';
import PaginatedRecipeList from './PaginatedRecipeList.vue';
import type { CountryCode, PaginatedRecipesResponse, Recipe } from 'shared';
import { getCountryName } from '@/util/country/countryUtils';

const props = defineProps<{
	countryCode: CountryCode
}>();
const emit = defineEmits<{
	(e: 'cancel'): void;
}>();

const isLoading = ref<boolean>(true);
const isLoadingFirstPage = ref<boolean>(true);
const currentPage = ref<number>(1);
const totalPages = ref<number | undefined>(undefined);
const totalRecipes = ref<number | undefined>(undefined)
const recipes = ref<Recipe[] | undefined>(undefined);
const error = ref<string | undefined>(undefined);

const countryName = computed(() => getCountryName(props.countryCode));

function cancel() {
	emit("cancel");
}

function handleChangePage(page: number) {
	currentPage.value = page;
	loadRecipes();
}

async function loadRecipes() {
	isLoading.value = true;
	recipes.value = undefined;
	totalPages.value = undefined;
	error.value = undefined;
	if (currentPage.value === 1) {
		isLoadingFirstPage.value = true;
	}
	try {
		const response = await fetch(`/api/recipes?country=${props.countryCode}&page=${currentPage.value}`);
		if (!response.ok) throw new Error(`HTTP ${response.status}`);

		const res = await response.json() as PaginatedRecipesResponse;
		recipes.value = res.recipes;
		totalRecipes.value = res.totalItems;
		totalPages.value = res.totalPages;
	} catch (err) {
		console.error(err);
		error.value = "An error occured. Please try again.";
	} finally {
		isLoading.value = false;
		isLoadingFirstPage.value = false;
	}
}

watch(() => props.countryCode, () => {
	currentPage.value = 1;
	loadRecipes();
}, { immediate: true });
</script>

<style scoped></style>

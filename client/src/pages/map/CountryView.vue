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
				<p class="text-gray-700">Found 0 dishes:</p>
			</Transition>
		</div>
		<PaginatedRecipeList class="mt-2 grow" :loading="isLoading" :current-page="currentPage"
			@change-page="handleChangePage" />
	</div>
</template>

<script setup lang="ts">
import SkeletonLoader from '@/components/SkeletonLoader.vue';
import { countryNames, type CountryCode } from '@/types/country';
import { computed, ref, watch } from 'vue';
import PaginatedRecipeList from './PaginatedRecipeList.vue';
// import RecipeList from './RecipeList.vue';


const props = defineProps<{
	countryCode: CountryCode
}>();
const emit = defineEmits<{
	(e: 'cancel'): void;
}>();

const isLoading = ref<boolean>(true);
const currentPage = ref<number>(1);

const countryName = computed(() => countryNames[props.countryCode]);

function cancel() {
	emit("cancel");
}

const fakeLoad = (() => {
	let timeout: number | null = null;
	return function () {
		if (timeout) {
			clearTimeout(timeout);
		}
		isLoading.value = true;
		timeout = window.setTimeout(() => {
			isLoading.value = false
		}, 600);
	}
})();

function handleChangePage(page: number) {
	currentPage.value = page;
	fakeLoad();
}

watch(() => props.countryCode, () => {
	fakeLoad();
}, { immediate: true });
</script>

<style scoped></style>

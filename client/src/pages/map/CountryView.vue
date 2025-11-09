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
			<p v-else class="text-gray-700">Found 0 dishes:</p>
		</div>
		<RecipeList class="mt-2" />
	</div>
</template>

<script setup lang="ts">
import SkeletonLoader from '@/components/SkeletonLoader.vue';
import { countryNames, type CountryCode } from '@/types/country';
import { computed, ref } from 'vue';
import RecipeList from './RecipeList.vue';

const props = defineProps<{
	countryCode: CountryCode
}>();
const emit = defineEmits<{
	(e: 'cancel'): void;
}>();

const isLoading = ref<boolean>(false);

const countryName = computed(() => countryNames[props.countryCode]);

function cancel() {
	emit("cancel");
}
</script>

<style scoped></style>

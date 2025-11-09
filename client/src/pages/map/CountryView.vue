<template>
	<div class="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
		<div>
			<div class="float-right text-2xl mr-1 text-gray-800 cursor-pointer" @click="cancel">
				<i class="fa-solid fa-xmark"></i>
			</div>
			<h1>{{ countryName }}</h1>
		</div>
	</div>
</template>

<script setup lang="ts">
import { countryNames, type CountryCode } from '@/types/country';
import { computed } from 'vue';

const props = defineProps<{
	countryCode: CountryCode
}>();
const emit = defineEmits<{
	(e: 'cancel'): void;
}>();

const countryName = computed(() => countryNames[props.countryCode]);

function cancel() {
	emit("cancel");
}
</script>

<style scoped></style>

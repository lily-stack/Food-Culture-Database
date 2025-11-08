<template>
	<div class="fixed left-0 top-0 w-screen h-screen">
		<WorldMap @select="onSelectCountry" />
		<MapOptions class="absolute left-0 bottom-0" />
		<p>Active country: {{ activeCountry }}</p>
		<Transition
			enter-active-class="transition-opacity duration-300"
			enter-from-class="opacity-0"
			enter-to-class="opacity-100"
			leave-active-class="transition-opacity duration-300"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0"
		>
			<div v-if="activeCountry !== null" class="absolute right-0 top-0 h-screen w-full sm:w-[70%] md:w-[40%] pt-20 pb-4 px-4">
				<CountryView class="h-full"
					:countryCode="activeCountry"
					@cancel="activeCountry = null"
				/>
			</div>
		</Transition>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MapOptions from './MapOptions.vue';
import WorldMap from './WorldMap.vue';
import CountryView from './CountryView.vue';
import type { CountryCode } from '@/types/country';

const activeCountry = ref<CountryCode | null>(null);

function onSelectCountry(countryCode: CountryCode | null) {
	activeCountry.value = countryCode;
}

</script>

<style scoped>
</style>

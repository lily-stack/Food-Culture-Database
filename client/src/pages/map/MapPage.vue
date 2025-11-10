<template>
	<div class="fixed left-0 top-0 w-screen h-screen">
		<WorldMap ref="worldMapRef"
			:resolution="mapResolution"
			@select="onSelectCountry"
		/>
		<MapOptions
			class="absolute left-0 bottom-0"
			v-model:resolution="mapResolution"
			@goToCountry="goToCountry"
		/>
		<p>Map resolution: {{ mapResolution }}</p>
		<Transition
			enter-active-class="transition-opacity duration-300"
			enter-from-class="opacity-0"
			enter-to-class="opacity-100"
			leave-active-class="transition-opacity duration-300"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0"
		>
			<div v-if="activeCountry !== null" class="absolute right-0 bottom-0 w-full h-[60%] sm:h-screen sm:w-[70%] md:w-[40%] pt-20 pb-4 px-4 pointer-events-none">
				<CountryView class="h-full pointer-events-auto"
					:countryCode="activeCountry"
					@cancel="onCountryViewClosed"
				/>
			</div>
		</Transition>
	</div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import MapOptions from './MapOptions.vue';
import WorldMap from './WorldMap.vue';
import CountryView from './CountryView.vue';
import type { CountryCode } from '@/types/country';
import type { MapResolution } from './types';

const activeCountry = ref<CountryCode | null>(null);
const mapResolution = ref<MapResolution>("medium");
const worldMapRef = useTemplateRef("worldMapRef");

function goToCountry(countryName: string | null) {
	worldMapRef.value?.goToCountry(countryName);
}

function onSelectCountry(countryCode: CountryCode | null) {
	activeCountry.value = countryCode;
}
function onCountryViewClosed() {
	activeCountry.value = null;
	goToCountry(null)
}

</script>

<style scoped>
</style>

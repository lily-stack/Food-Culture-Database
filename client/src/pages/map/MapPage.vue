<template>
	<div class="fixed left-0 top-0 w-screen h-screen">
		<WorldMap @select="onSelectCountry" />
		<MapOptions class="absolute left-0 bottom-0" />
		<p>Active country: {{ activeCountryTitle }}</p>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MapOptions from './MapOptions.vue';
import WorldMap from './WorldMap.vue';

const activeCountryTitle = ref<string | null>(null);

function onSelectCountry(countryName: string | null) {
	activeCountryTitle.value = countryName;
}

</script>

<style scoped></style>

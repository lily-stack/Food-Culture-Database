<template>
	<div class="w-full h-full">
		<div ref="mapContainer" class="w-full h-full bg-blue-200 cursor-grab active:cursor-grabbing overflow-hidden">
		</div>
		<div v-if="isLoading"
			class="fixed top-1/2 left-1/2 p-4 bg-white rounded-lg shadow-lg text-gray-700 border border-gray-200 transform -translate-x-1/2 -translate-y-1/2">
			Loading...
		</div>
	</div>
</template>

<script lang="ts" setup>
import * as d3 from "d3";
import { ref, watchEffect } from "vue";
import type { CountryCode } from "@/types/country";
import type { MapResolution } from "./types";

// Constants
const COUNTRY_FILL_COLOR = "#faf7f2";
const COUNTRY_BORDER_COLOR = "#555";
const COUNTRY_HIGHLIGHT_COLOR = "#f4f5ae";
const COUNTRY_TEXT_COLOR = "#52525c";
const BASE_FONT_SIZE = 6;

const props = defineProps<{
	resolution: MapResolution
}>();
const emit = defineEmits<{
	(e: 'select', value: CountryCode | null): void;
}>();
defineExpose({
	goToCountry
});

const isLoading = ref<boolean>(true);

// Types
interface CountryFeatureProperties {
	sovereignt: string;
	[key: string]: any;
}

interface CountryFeature extends GeoJSON.Feature<GeoJSON.Geometry, CountryFeatureProperties> {
	minZoomForLabel?: number;
}

// Map container
const mapContainer = ref<HTMLDivElement | null>(null);
let selected: SVGPathElement | null = null;
let path: d3.GeoPath<any, CountryFeature>
let zoom: any

function loadMap(worldData: any) {
	if (!mapContainer.value) return;

	// Clear previous map
	d3.select(mapContainer.value).selectAll("*").remove();

	const width = mapContainer.value.clientWidth;
	const height = mapContainer.value.clientHeight;

	const svg = d3
		.select(mapContainer.value)
		.append("svg")
		.attr("width", width)
		.attr("height", height);

	const projection = d3
		.geoMercator()
		.scale(width / 6.3)
		.translate([width / 2, height / 1.4]);

	path = d3.geoPath<CountryFeature>().projection(projection);

	const g = svg.append("g");

	// Zoom behavior
	zoom = d3
		.zoom<SVGSVGElement, unknown>()
		.scaleExtent([1, 8])
		.on("zoom", (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
			const { transform } = event;
			g.attr("transform", transform.toString());
			g.attr("stroke-width", 1 / transform.k);

			// Update text font-size instantly, animate opacity
			g.selectAll<SVGTextElement, CountryFeature>("text")
				.attr("font-size", d => `${BASE_FONT_SIZE / transform.k * 2}px`)
				.transition()
				.duration(200)
				.attr("opacity", d => (transform.k >= (d.minZoomForLabel ?? 1) ? 1 : 0));
		});

	svg.call(zoom);

	// Draw countries
	g.selectAll<SVGPathElement, CountryFeature>("path")
		.data(worldData.features as CountryFeature[])
		.enter()
		.append("path")
		.attr("d", path)
		.attr("fill", COUNTRY_FILL_COLOR)
		.attr("stroke", COUNTRY_BORDER_COLOR)
		.attr("stroke-width", 0.5)
		.attr("cursor", "pointer")
		.on("click", (event, d: CountryFeature) => {
			event.stopPropagation();
			selectCountry(event.currentTarget as SVGPathElement, d);
		});

	// Add country labels
	g.selectAll<SVGTextElement, CountryFeature>("text")
		.data(worldData.features as CountryFeature[])
		.enter()
		.append("text")
		.attr("transform", d => {
			const [x, y] = path.centroid(d);
			return `translate(${x},${y})`;
		})
		.attr("text-anchor", "middle")
		.attr("fill", COUNTRY_TEXT_COLOR)
		.attr("opacity", 0)
		.attr("pointer-events", "none")
		.text(d => d.properties.sovereignt)
		.each(function (d) {
			const [[x0, y0], [x1, y1]] = path.bounds(d);
			const dx = x1 - x0;
			const dy = y1 - y0;
			// assign min zoom for label visibility
			d.minZoomForLabel = Math.min(
				8,
				Math.max(1, 0.08 / Math.max(dx / width, dy / height))
			);
		});

	setTimeout(() => {
		isLoading.value = false;
	});
}

function deselectSelectedCountry() {
	if (selected) {
		d3.select(selected).attr("fill", COUNTRY_FILL_COLOR);
		selected = null;
		emit("select", null);
	}
}

function selectCountry(element: SVGPathElement, d: CountryFeature) {
	if (!mapContainer.value) return;
	const name = d.properties.name_en;
	const iso_a2 = d.properties.iso_a2.length !== 2 ? d.properties.iso_a2_eh : d.properties.iso_a2;

	// Deselect previous
	if (selected && selected !== element) {
		d3.select(selected).attr("fill", COUNTRY_FILL_COLOR);
	}

	if (selected === element) {
		deselectSelectedCountry();
	} else {
		selected = element;
		d3.select(selected).attr("fill", COUNTRY_HIGHLIGHT_COLOR);
		emit("select", iso_a2);
	}

	const width = mapContainer.value.clientWidth;
	const height = mapContainer.value.clientHeight;

	// Zoom to country bounds
	const [[x0, y0], [x1, y1]] = path.bounds(d);
	let scale = Math.min(
		8,
		0.8 / Math.max((x1 - x0) / width, (y1 - y0) / height)
	);

	let targetX = width * 0.35;
	let targetY = height / 2;
	const isSmallScreen = window.matchMedia('(max-width: 639px)').matches;
	if (isSmallScreen) {
		targetX = width / 2;
		targetY = height / 3.8;
	} else {
		targetX = width * 0.35;
		targetY = height / 2;
	}

	if (name === "Russia") {
		targetX /= 12;
		scale *= 1.8;
	}

	const svg = d3.select(mapContainer.value).select("svg");
	const g = svg.select("g");
	svg
		.transition()
		.duration(750)
		.call(
			zoom.transform,
			d3.zoomIdentity
				.translate(targetX, targetY)
				.scale(scale)
				.translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
		);
}

function goToCountry(countryName: string | null) {
	if (!mapContainer.value) return;
	if (countryName === null) {
		deselectSelectedCountry()
		return;
	}

	const svg = d3.select(mapContainer.value).select("svg");
	const g = svg.select("g");

	const countryPath = g.selectAll<SVGPathElement, CountryFeature>("path")
		.filter(d => d.properties.sovereignt.toLowerCase() === countryName.toLowerCase())
		.node();

	if (!countryPath) return;

	const d = d3.select(countryPath).datum() as CountryFeature;
	selectCountry(countryPath, d);
}

watchEffect(async () => {
	isLoading.value = true;
	let worldData;
	if (props.resolution === 'medium') {
		worldData = await import("./light.geo.json");
	} else {
		worldData = await import("./medium.geo.json");
	}
	loadMap(worldData);
})
</script>

<style scoped></style>

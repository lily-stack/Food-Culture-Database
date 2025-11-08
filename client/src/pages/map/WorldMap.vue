<template>
	<div ref="mapContainer"
		class="w-full h-[600px] bg-blue-200 rounded-xl cursor-grab active:cursor-grabbing overflow-hidden"></div>
</template>

<script lang="ts" setup>
import * as d3 from "d3";
import { onMounted, ref } from "vue";
import worldData from "./custom.geo.json";

// Constants
const COUNTRY_FILL_COLOR = "#e5e7eb";
const COUNTRY_BORDER_COLOR = "#555";
const COUNTRY_HIGHLIGHT_COLOR = "#f4f5ae";
const COUNTRY_TEXT_COLOR = "#52525c";
const BASE_FONT_SIZE = 6;

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

onMounted(() => {
	if (!mapContainer.value) return;

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

	const path = d3.geoPath<CountryFeature>().projection(projection);

	const g = svg.append("g");

	// Zoom behavior
	const zoom = d3
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
		.on("click", (event, d) => {
			event.stopPropagation();
			const name = d.properties.sovereignt;
			console.log(name);

			// Deselect previous
			if (selected && selected !== event.currentTarget) {
				d3.select(selected).attr("fill", COUNTRY_FILL_COLOR);
			}

			if (selected === event.currentTarget) {
				d3.select(selected).attr("fill", COUNTRY_FILL_COLOR);
				selected = null;
			} else {
				selected = event.currentTarget as SVGPathElement;
				d3.select(selected).attr("fill", COUNTRY_HIGHLIGHT_COLOR);
			}

			// Zoom to country bounds
			const [[x0, y0], [x1, y1]] = path.bounds(d);
			const scale = Math.min(
				8,
				0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)
			);

			svg
				.transition()
				.duration(750)
				.call(
					zoom.transform,
					d3.zoomIdentity
						.translate(width / 2, height / 2)
						.scale(scale)
						.translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
				);
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
});
</script>

<style scoped></style>

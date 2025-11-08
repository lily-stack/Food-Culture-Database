<template>
	<div ref="mapContainer"
		class="w-full h-[600px] bg-blue-200 rounded-xl cursor-grab active:cursor-grabbing overflow-hidden"></div>
</template>

<script setup>
import * as d3 from "d3";
import { onMounted, ref } from "vue";
import worldData from "./custom.geo.json"; // download a GeoJSON file here

const COUNTRY_FILL_COLOR = "#e5e7eb";
const COUNTRY_BORDER_COLOR = "#555";
const COUNTRY_HIGHLIGHT_COLOR = "#f4f5ae";
const COUNTRY_TEXT_COLOR = "#52525c";
const BASE_FONT_SIZE = 6;

const mapContainer = ref(null);
let selected = null;

onMounted(() => {
	const width = mapContainer.value.clientWidth;
	const height = mapContainer.value.clientHeight;

	const svg = d3.select(mapContainer.value)
		.append("svg")
		.attr("width", width)
		.attr("height", height);

	const projection = d3.geoMercator()
		.scale(width / 6.3)
		.translate([width / 2, height / 1.4]);

	const path = d3.geoPath().projection(projection);
	const g = svg.append("g");

	const zoom = d3.zoom()
		.scaleExtent([1, 8])
		.on("zoom", (event) => {
			const { transform } = event;
			g.attr("transform", transform);
			g.attr("stroke-width", 1 / transform.k);

			// Hide or show labels based on zoom level
			g.selectAll("text")
				.attr("font-size", d => `${BASE_FONT_SIZE / transform.k * 2}px`)
				.transition()
				.duration(200)
				.attr("opacity", d => (transform.k >= d.minZoomForLabel ? 1 : 0));
		});

	svg.call(zoom);

	let selected = null;

	g.selectAll("path")
		.data(worldData.features)
		.enter()
		.append("path")
		.attr("d", path)
		.attr("fill", COUNTRY_FILL_COLOR)
		.attr("stroke", COUNTRY_BORDER_COLOR)
		.attr("stroke-width", 0.5)
		.on("click", (event, d) => {
			event.stopPropagation();
			const name = d.properties.sovereignt;
			console.log(name);

			function deselect() {
				if (selected) d3.select(selected).attr("fill", COUNTRY_FILL_COLOR);
				selected = null;
			}

			if (event.target !== selected) {
				deselect();
				selected = event.target;
				d3.select(event.target).attr("fill", COUNTRY_HIGHLIGHT_COLOR);
			} else {
				deselect();
			}

			const [[x0, y0], [x1, y1]] = path.bounds(d);
			svg.transition().duration(750).call(
				zoom.transform,
				d3.zoomIdentity
					.translate(width / 2, height / 2)
					.scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
					.translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
			);
		});

	g.selectAll("text")
		.data(worldData.features)
		.enter()
		.append("text")
		.attr("transform", d => {
			const [x, y] = path.centroid(d);
			return `translate(${x},${y})`;
		})
		.attr("text-anchor", "middle")
		.attr("font-size", "8px")
		.attr("fill", COUNTRY_TEXT_COLOR)
		.attr("opacity", 0)
		.text(d => d.properties.sovereignt)
		.each(function (d) {
			const [[x0, y0], [x1, y1]] = path.bounds(d);
			const dx = x1 - x0;
			const dy = y1 - y0;
			// store a min zoom level that fits the label
			d.minZoomForLabel = Math.min(8, Math.max(1, 0.08 / Math.max(dx / width, dy / height)));
			// optional: scale factor to make small countries appear earlier
			// d.minZoomForLabel *= 0.8;
		});
});
</script>

<style scoped></style>

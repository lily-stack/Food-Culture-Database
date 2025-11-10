<template>
	<RouterLink to="recipes/recipeid">
		<div
			class="border border-gray-200 rounded-lg shadow-md p-3 flex justify-between gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
			<div class="flex gap-3">
				<img :src="imgSrc" class="w-24 h-24 rounded-md object-cover border border-gray-200" />
				<div class="flex flex-col">
					<h4>{{ title }}</h4>
					<div class="text-xs text-gray-600 flex flex-row">
						<div title="Rating" class="pr-2 mr-2 border-r border-gray-200">
							<i class="fa-regular fa-star"></i>
							<span class="ml-0.5">1,000</span>
						</div>
						<div title="Preparation time" class="mr-2">
							<i class="fa-regular fa-clock"></i>
							<span class="ml-0.5">1h 30m</span>
						</div>
						<div title="Number of servings">
							<i class="fa-regular fa-user"></i>
							<span class="ml-0.5">4</span>
						</div>
					</div>
					<p class="mt-1.5 text-gray-800 line-clamp-2 text-sm">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean auctor finibus lectus, vel
						aliquam massa dignissim ut. Maecenas tristique tellus nec erat porta, sit amet pretium enim
						consectetur. Suspendisse potenti. Nulla sed pellentesque sapien.
					</p>
				</div>
			</div>
			<div class="flex">
				<div class="m-auto text-2xl text-gray-800">
					<i class="fa-solid fa-angle-right"></i>
				</div>
			</div>
		</div>
	</RouterLink>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
	title: string,
	imgSrc: string
}>();
</script>

<style scoped></style>

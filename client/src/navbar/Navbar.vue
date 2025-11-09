<template>
	<div class="py-4 flex justify-center z-20">
		<div
			class="bg-white grow shadow-lg rounded-lg h-12 border border-gray-200 flex gap-2 items-center justify-between px-4 py-2 text-gray-600 transition-colors font-semibold">
			<div class="basis-0 grow text-xl font-semibold select-none font-[Merriweather] text-black">
				<span class="cursor-pointer whitespace-nowrap">
					<RouterLink to="/">Recipes Worldwide</RouterLink>
				</span>
			</div>
			<div class="hidden sm:flex gap-2 md:gap-8">
				<NavbarOption path="/">
					<i class="fa-solid fa-house"></i>
					Home
				</NavbarOption>
				<NavbarOption path="/map">
					<i class="fa-solid fa-map"></i>
					World Map
				</NavbarOption>
				<NavbarOption path="/search">
					<i class="fa-solid fa-magnifying-glass"></i>
					Search
				</NavbarOption>
			</div>
			<div class="ml-1 basis-0 grow text-right truncate">
				<span class="cursor-pointer hover:text-gray-800">
					<i class="fa-regular fa-user"></i>
					Username
				</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import NavbarOption from './NavbarOption.vue';
</script>

<style scoped></style>

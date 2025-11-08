<template>
	<div class="py-4 flex justify-center">
		<div class="bg-white grow shadow-lg rounded-lg h-12 border border-gray-200 flex gap-2 items-center justify-between p-4 text-gray-600 transition-colors font-semibold">
			<div class="basis-0 grow text-xl font-semibold select-none font-[Merriweather] text-black">
				<span class="cursor-pointer">
					<RouterLink to="/">Recipes Worldwide</RouterLink>
				</span>
			</div>
			<div class="hidden sm:flex gap-8">
				<RouterLink to="/">
					<span class="hover:text-gray-800">
						<i class="fa-solid fa-house"></i>
						Home
					</span>
				</RouterLink>
				<RouterLink to="/map">
					<span class="hover:text-gray-800">
						<i class="fa-solid fa-map"></i>
						World Map
					</span>
				</RouterLink>
				<RouterLink to="/search">
					<span class="hover:text-gray-800">
						<i class="fa-solid fa-magnifying-glass"></i>
						Search
					</span>
				</RouterLink>
			</div>
			<div class="basis-0 grow text-right">
				<span class="cursor-pointer whitespace-nowrap hover:text-gray-800">
					<i class="fa-regular fa-user"></i>
					Username
				</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
</script>


<style scoped>
</style>

<template>
	<div class="py-4 flex justify-center z-20">
		<div
			class="bg-white grow shadow-lg rounded-lg h-12 border border-gray-200 flex gap-2 items-center justify-between px-4 py-2 text-gray-600 transition-colors font-semibold">
			<div class="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
				<img 
					src="/WorldFoodIcon.ico" 
					alt="Recipe icon" 
					class="w-full h-full object-cover object-center scale-125" 
				/>
			</div>
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
			<div class="ml-1 basis-0 grow text-right whitespace-nowrap truncate">
				<span class="cursor-pointer hover:text-gray-800" @click="openUserOptions">
					<i class="fa-regular fa-user"></i>
					Username
				</span>
				<Transition name="growin">
					<UserDropdown v-if="isUserOptionsOpen" class="absolute right-0 top-17.5 text-left"
						v-click-away="closeUserOptions" @close="closeUserOptions" />
				</Transition>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NavbarOption from './NavbarOption.vue';
import UserDropdown from './NavbarDropdown.vue';

const isUserOptionsOpen = ref<boolean>(false);

function openUserOptions() {
	isUserOptionsOpen.value = true;
}
function closeUserOptions() {
	isUserOptionsOpen.value = false;
}
</script>

<style scoped>
.growin-enter-from,
.growin-appear-from,
.growin-leave-to {
	opacity: 0;
	transform: scale(0.95);
}

.growin-enter-to,
.growin-appear-to {
	opacity: 1;
	transform: scale(1);
}

.growin-enter-active,
.growin-appear-active {
	transform-origin: top right;
	transition: opacity 80ms ease-out, transform 80ms ease-out;
}

.growin-leave-active {
	transform-origin: top right;
	transition: opacity 80ms ease-in, transform 80ms ease-in;
}
</style>

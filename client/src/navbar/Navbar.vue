<template>
	<div class="py-4 flex justify-center z-20">
		<div
			class="bg-white grow shadow-lg rounded-lg h-12 border border-gray-200 flex gap-2 items-center justify-between pl-2 pr-4 py-2 text-gray-600 transition-colors font-semibold">
			<div class="w-10 h-10 rounded-full overflow-hidden shrink-0">
				<RouterLink to="/">
					<img src="/WorldFoodIcon.ico" alt="Recipe icon"
						class="w-full h-full object-cover object-center scale-125" />
				</RouterLink>
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
					{{ displayName }}
				</span>
				<Transition name="growin">
					<NavbarDropdown v-if="isUserOptionsOpen" class="absolute right-0 top-17.5 text-left"
						v-click-away="closeUserOptions" @close="closeUserOptions" @logout="handleLogout" />
				</Transition>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import NavbarOption from './NavbarOption.vue';
import NavbarDropdown from './NavbarDropdown.vue';

const router = useRouter();
const authStore = useAuthStore();

const isUserOptionsOpen = ref<boolean>(false);

const displayName = computed(() => {
	return authStore.fullName || authStore.firstName || 'Login/Register';
});

function openUserOptions() {
    if (!authStore.fullName && !authStore.firstName) {
        router.push('/auth');
    } else {
        isUserOptionsOpen.value = true;
    }
}

function closeUserOptions() {
	isUserOptionsOpen.value = false;
}

async function handleLogout() {
	try {
		await authStore.logout();
		router.push('/auth');
	} catch (error) {
		console.error('Error logging out:', error);
	}
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

import Home from '@/pages/home/Home.vue'
import MapPage from '@/pages/map/MapPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{ path: '/', component: Home },
		{ path: '/map', component: MapPage }
	],
})

export default router

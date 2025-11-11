import Home from '@/pages/home/Home.vue'
import MapPage from '@/pages/map/MapPage.vue'
import RecipePage from '@/pages/recipes/RecipePage.vue'
import CreateRecipe from '@/pages/recipes/CreateRecipe.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{ path: '/', component: Home },
		{ path: '/map', component: MapPage },
		{ path: '/recipes/recipeid', component: RecipePage}, //path: '/recipes/:recipeid'
		{ path: '/createRecipe', component: CreateRecipe}
	],
})

export default router

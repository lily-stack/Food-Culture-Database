import Home from '@/pages/home/Home.vue'
import MapPage from '@/pages/map/MapPage.vue'
import RecipePage from '@/pages/recipes/RecipePage.vue'
import CreateRecipe from '@/pages/recipes/CreateRecipe.vue'
import NotFoundPage from '@/pages/notfound/NotFoundPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{ path: '/', component: Home },
		{ path: '/map', component: MapPage },
		{ path: '/recipes/:recipe_id', component: RecipePage},
		{ path: '/createRecipe', component: CreateRecipe},
		{ path: '/:pathMatch(.*)*', component: NotFoundPage}
	],
})

export default router

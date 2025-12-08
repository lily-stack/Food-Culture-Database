import Home from '@/pages/home/Home.vue'
import MapPage from '@/pages/map/MapPage.vue'
import UserPage from '@/pages/user/UserPage.vue'
import RecipePage from '@/pages/recipes/RecipePage.vue'
import EditRecipe from '@/pages/recipes/EditRecipe.vue'
import CreateRecipe from '@/pages/recipes/CreateRecipe.vue'
import LoginRegister from '@/pages/authentication/LoginRegister.vue'
import NotFoundPage from '@/pages/notfound/NotFoundPage.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SearchPage from '@/pages/search/SearchPage.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			component: Home,
		},
		{
			path: '/map',
			component: MapPage,
		},
		{
			path: '/recipes/:recipeid',
			name: 'RecipePage',
			component: RecipePage,
		},
		{
			path: '/recipes/create',
			component: CreateRecipe,
			meta: { requiresAuth: true }
		},
		{
			path: '/recipes/edit/:recipeid',
			name: 'EditRecipe',
			component: EditRecipe,
			meta: { requiresAuth: true }
		},
		{
			path: '/auth',
			component: LoginRegister,
			meta: { requiresAuth: false, ignorePageLayout: true }
		},
		{
			path: '/profile',
			component: UserPage,
			meta: { requiresAuth: true }
		},
		{
			path: '/search',
			component: SearchPage,
			meta: { requiresAuth: false }
		},
		{ path: '/login', redirect: '/auth' },
		{ path: '/register', redirect: '/auth' },
		{ path: '/:pathMatch(.*)*', component: NotFoundPage }
	],
})

let previousRoute: string | null = null

router.beforeEach((to, from) => {
	if(from.path !== '/auth') {
		previousRoute = from.path
	}
})

router.beforeEach(async (to, from, next) => {
	const authStore = useAuthStore()

	const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

	if (!requiresAuth) {
		next()
		return
	}

	if (authStore.isCheckingAuth) {
		await new Promise<void>((resolve) => {
			const interval = setInterval(() => {
				if (!authStore.isCheckingAuth) {
					clearInterval(interval)
					resolve()
				}
			}, 50)
		})
	}

	if (authStore.isAuthenticated) {
		next()
	} else {
		next('/auth')
	}
})

router.beforeEach(async (to, from, next) => {
	const authStore = useAuthStore()

	const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

	if (!requiresAuth) {
		next()
		return
	}

	if (authStore.isCheckingAuth) {
		await new Promise<void>((resolve) => {
			const interval = setInterval(() => {
				if (!authStore.isCheckingAuth) {
					clearInterval(interval)
					resolve()
				}
			}, 50)
		})
	}

	if (authStore.isAuthenticated) {
		next()
	} else {
		next('/auth')
	}
})

export { previousRoute }
export default router

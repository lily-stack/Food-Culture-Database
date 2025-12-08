<template>
  <div class="min-h-screen bg-gray-50 p-6 flex justify-center">
    <div v-if="state.loading" class="text-gray-600">Loading recipe...</div>

    <div v-else-if="state.recipe" class="max-w-3xl w-full bg-white rounded-lg shadow-lg overflow-hidden">

      <div class="p-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ state.recipe.title }}</h1>
        <p class="text-gray-600 mb-4">{{ state.recipe.dish_description }}</p>
        <img :src="state.recipe.image_src" class="w-24 h-24 rounded-md object-cover border border-gray-200" />

        <div class="flex gap-4 text-gray-700 mb-1 items-center">
          <span v-if="state.recipe.cooking_time">⏱ {{ state.recipe.cooking_time }} min</span>
          <span v-if="state.recipe.servings">🍽 Serves {{ state.recipe.servings }}</span>
          <span v-if="state.recipe.rating">⭐ {{ state.recipe.rating }}</span>

          <button @click="toggleFavorite" class="cursor-pointer flex items-center gap-1 focus:outline-none">
            <svg v-if="!state.isFavorited" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500 hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.682l-7.682-7.682a4.5 4.5 0 010-6.364z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500 transition-colors" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.343l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
            </svg>
            <span class="select-none text-gray-700 hover:text-red-500 transition-colors">Favorite</span>
          </button>
        </div>

        <div class="flex gap-2 items-center text-gray-700 flex-wrap mb-1">
          <span class="font-semibold">Country of Origin:</span>
          
          <template v-for="country in state.recipe.countries" :key="country">
            <span class="bg-gray-200 text-gray-800 text-sm px-2 py-1 rounded-full">
              {{ country }}
            </span>
          </template>
        </div>

        <div class="flex gap-2 items-center text-gray-700 flex-wrap mb-1">
          <span class="font-semibold">Tags:</span>
          
          <template v-for="tag in state.recipe.tags" :key="tag">
            <span class="bg-gray-200 text-gray-800 text-sm px-2 py-1 rounded-full">
              {{ tag }}
            </span>
          </template>
        </div>

        <div class="flex gap-4 text-gray-700 mb-6 items-center">
          <span>Created By {{ state.recipe?.creator_name }}</span>

          <button
            v-if="state.isCreator"
            @click="goToEdit"
            class="cursor-pointer flex items-center gap-2 bg-orange-700 hover:bg-orange-600 text-white px-3 py-1.5 rounded-md shadow-2xl transition-colors focus:outline-none"
          >
            Edit Recipe
          </button>
        </div>



        <section class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-2">Ingredients</h2>
          <ul class="list-disc list-inside space-y-1">
            <li v-for="ingredient in state.recipe.ingredients" :key="ingredient.ingredient_id">
              {{ ingredient.amount_quantity }} — {{ ingredient.ingredient_name }}
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-gray-800 mb-2">Steps</h2>
          <ol class="list-decimal list-inside space-y-2">
            <li v-for="(step, index) in state.recipe.recipe_steps" :key="index">
              {{ step }}
            </li>
          </ol>
        </section>
      </div>
    </div>

    <div v-else class="text-gray-600">Recipe not found.</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'



interface Ingredient {
  ingredient_id: number
  ingredient_name: string
  amount_quantity: number
}

interface Recipe {
  image_src: string,
  recipe_id: number
  title: string
  dish_description: string
  cooking_time?: number
  servings?: number
  recipe_steps: string[] // split recipe_steps into array
  ingredients: Ingredient[]
  creator_name: string
  tags: string[]
  rating: number
  countries: string[]
}

const state = reactive({
  route: useRoute(),
  loading: true,
  isFavorited: false, //TODO: need api route
  isCreator: false,
  recipe: null as Recipe | null,
  router: useRouter()
})

// const recipe = ref<Recipe | null>(null)
// const loading = ref(true)
// const isFavorited = ref(false)//TODO: need api route
// const isCreator = ref(false)

// TODO: Replace with real API later ---
//const response = await axios.get(`/api/recipes/${route.params.recipeid}`)
//recipe.value = response.data
// const fetchRecipe = async () => {
//   state.loading = true

//   // TODO: Replace this with real API call to /api/recipes/:recipeid
//   //how to save images?
//   const mockRecipe: Recipe = {
//     image_src: "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_4:3/k%2FPhoto%2FRecipes%2F2024-03-bimbimbap%2Fbibimbap-074",
//     recipe_id: 1,
//     title: 'Spaghetti Bolognese',
//     dish_description: 'A classic Italian pasta dish with rich meat sauce.',
//     cooking_time: 45,
//     servings: 4,
//     recipe_steps: [
//       'Cook spaghetti according to package instructions.',
//       'Sauté onions and garlic in olive oil.',
//       'Add ground beef and cook until browned.',
//       'Add tomato sauce and simmer for 20 minutes.',
//       'Serve sauce over spaghetti and sprinkle with Parmesan.'
//     ],
//     ingredients: [
//       { ingredient_id: 1, ingredient_name: 'Spaghetti', amount_quantity: 200 },
//       { ingredient_id: 2, ingredient_name: 'Ground beef', amount_quantity: 300 },
//       { ingredient_id: 3, ingredient_name: 'Tomato sauce', amount_quantity: 400 },
//       { ingredient_id: 4, ingredient_name: 'Onion', amount_quantity: 1 },
//       { ingredient_id: 5, ingredient_name: 'Garlic', amount_quantity: 2 },
//     ],
//     creator_name: "Lily Hill",
//     tags: ["Italy", "Pasta"],
//     rating: 3.8,
//     countries: ["Italy", "France"]
//   }

//   state.recipe = mockRecipe
//   state.loading = false
// }

const fetchRecipe = async () => {
  state.loading = true
  try {
    const recipeId = state.route.params.recipeid
    if (!recipeId) {
      state.recipe = null;
      state.loading = false;
      return;
    }
    const { data } = await axios.get(`/api/recipes/${recipeId}`)
    
    // Make sure steps are an array
    const recipe: Recipe = {
      ...data,
      recipe_steps: Array.isArray(data.recipe_steps)
        ? data.recipe_steps
        : data.recipe_steps.split("\n") // if stored as text
    }

    state.recipe = recipe
  } catch (error) {
    console.error("Error fetching recipe:", error)
    state.recipe = null
  } finally {
    state.loading = false
  }
}



const toggleFavorite = () => {
  state.isFavorited = !state.isFavorited

  // TODO: Call API to save favorite status
  
}

async function findIsCreator() {
  // TODO: call api route to verify if user is creator
  return true
}

const goToEdit = () => {
  if (state.recipe) {
    state.router.push(`/recipes/edit/recipeid`)
    //state.router.push(`/editRecipe/${state.recipe.recipe_id}`)
  }
}


onMounted(async () => {
  await fetchRecipe()
  state.isCreator = await findIsCreator()
})

</script>
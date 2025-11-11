<template>
  <div class="min-h-screen bg-gray-50 p-6 flex justify-center">
    <div class="max-w-3xl w-full bg-white rounded-lg shadow-lg p-6">

      <h1 class="text-3xl font-bold text-gray-800 mb-4">Add New Recipe</h1>

      <form @submit.prevent="submitRecipe" class="space-y-4">

        <div>
          <label class="block font-semibold text-gray-700 mb-1">Recipe Title</label>
          <input v-model="newRecipe.title" type="text" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
        </div>

        <div>
          <label class="block font-semibold text-gray-700 mb-1">Description</label>
          <textarea v-model="newRecipe.dish_description" rows="3" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required></textarea>
        </div>

        <!-- Image URL -->
        <div>
          <label class="block font-semibold text-gray-700 mb-1">Image URL</label>
          <input v-model="newRecipe.image_src" type="text" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>

        <div class="flex gap-4">
          <div>
            <label class="block font-semibold text-gray-700 mb-1">Cooking Time (min)</label>
            <input v-model.number="newRecipe.cooking_time" type="number" min="1" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label class="block font-semibold text-gray-700 mb-1">Servings</label>
            <input v-model.number="newRecipe.servings" type="number" min="1" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
        </div>
<!-- TODO: maybe make tag circle buttons you can select -->
        <div>
          <label class="block font-semibold text-gray-700 mb-1">Tags (comma separated)</label>
          <input v-model="tagsInput" type="text" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="e.g. Italy, Pasta" />
        </div>

        <div>
          <label class="block font-semibold text-gray-700 mb-2">Ingredients</label>
          <div v-for="(ingredient, index) in newRecipe.ingredients" :key="index" class="flex gap-2 mb-2">
            <input v-model="ingredient.amount_quantity" type="number" min="0" placeholder="Amount" class="w-24 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <select v-model="ingredient.unit" class="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="fl oz">fl oz</option>
              <option value="oz">oz</option>
              <option value="lb">lb</option>
              <option value="cup">cup</option>
              <option value="tbsp">tbsp</option>
              <option value="tsp">tsp</option>
              <option value="pt">pt</option>
              <option value="qt">qt</option>
              <option value="gal">gal</option>
            </select>
            <input v-model="ingredient.ingredient_name" type="text" placeholder="Ingredient name" class="flex-1 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <button type="button" @click="removeIngredient(index)" class="text-red-500 font-bold px-2">✕</button>
          </div>
          <button type="button" @click="addIngredient" class="text-blue-500 font-semibold">+ Add Ingredient</button>
        </div>

        <div>
          <label class="block font-semibold text-gray-700 mb-1">Steps</label>
          <textarea v-model="newRecipe.recipe_steps_text" rows="6" placeholder="Write all steps here..." class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"></textarea>
        </div>

        <div class="pt-4">
          <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded transition-colors">
            Create Recipe
          </button>
        </div>

      </form>

      <div v-if="submitted" class="mt-4 text-green-600 font-semibold">
        Recipe submitted successfully! (Mock)
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

interface Ingredient {
  ingredient_name: string
  amount_quantity: number
  unit: string
}

interface NewRecipe {
  title: string
  dish_description: string
  image_src: string
  cooking_time?: number
  servings?: number
  tags: string[]
  ingredients: Ingredient[]
  recipe_steps_text: string
}

const newRecipe = ref<NewRecipe>({
  title: '',
  dish_description: '',
  image_src: '',
  cooking_time: undefined,
  servings: undefined,
  tags: [],
  ingredients: [],
  recipe_steps_text: ''
})

const tagsInput = ref('')
const submitted = ref(false)

const addIngredient = () => {
  newRecipe.value.ingredients.push({ ingredient_name: '', amount_quantity: 0, unit: 'cup' })
}

const removeIngredient = (index: number) => {
  newRecipe.value.ingredients.splice(index, 1)
}

const submitRecipe = () => {
  newRecipe.value.tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag)

  console.log('Submitting Recipe:', newRecipe.value)

  // TODO: Replace with API call
  submitted.value = true
}
</script>

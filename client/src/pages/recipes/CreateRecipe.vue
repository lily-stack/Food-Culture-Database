<template>
  <div class="min-h-screen bg-gray-50 p-6 flex justify-center">
    <div class="max-w-3xl w-full bg-white rounded-lg shadow-lg p-6">

      <h1 class="text-3xl font-bold text-gray-800 mb-4">Add New Recipe</h1>

      <RecipeForm @submit="submitRecipe" submitButtonText="Create Recipe" />

      <div v-if="submitted" class="mt-4 text-green-600 font-semibold">
        Recipe submitted successfully! (Mock)
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import RecipeForm from './RecipeForm.vue'
import type { Recipe } from './RecipeForm.vue'
import { useRouter } from 'vue-router'

const tagsInput = ref('')
const submitted = ref(false)
const router = useRouter()

const submitRecipe = async (recipe: Recipe) => {
  router.push('/recipes/recipeid')
  // try {
  //   console.log('Submitting Recipe:', recipe)

  //   // Example API call
  //   const response = await fetch('/api/recipes', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(recipe)
  //   })

  //   if (!response.ok) throw new Error('Failed to create recipe')

  //   const newRecipe = await response.json() //make sure it has the new recipe's ID

  //   router.push({ name: 'RecipeDetails', params: { id: newRecipe.id } })

  // } catch (error) {
  //   console.error('Error creating recipe:', error)
  // }
}
</script>

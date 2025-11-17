<template>
  <div>
    <h1>Edit Recipe</h1>
    <RecipeForm
      :initialRecipe="existingRecipe"
      submitButtonText="Update Recipe"
      @submit="updateRecipe"
    />
  </div>
</template>

<script setup lang="ts">
import RecipeForm from './RecipeForm.vue'
import type { Recipe } from './RecipeForm.vue'
import { ref, onMounted } from 'vue'

// Load recipe data, e.g., from API
const existingRecipe = ref(null)

onMounted(async () => {
  const id = 123 // get recipe ID from route
  const response = await fetch(`/api/recipes/${id}`)
  existingRecipe.value = await response.json()
})

const updateRecipe = (recipe: Recipe) => {
  console.log('Update Recipe:', recipe)
  // Call API to update
}
</script>

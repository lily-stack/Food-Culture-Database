<template>
  <div>
    <h1>Edit Recipe</h1>

    <div v-if="loading">Loading recipe...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <RecipeForm
        :initialRecipe="existingRecipe"
        submitButtonText="Update Recipe"
        @submit="updateRecipe"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import RecipeForm from './RecipeForm.vue'
import type { Recipe } from './RecipeForm.vue'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

interface RouteParams {
  recipeid: string
}

const route = useRoute() as unknown as { params: RouteParams }
const router = useRouter()
const authStore = useAuthStore()

const existingRecipe = ref<Recipe | null>(null)
const loading = ref(true)
const error = ref('')
const recipeId = route.params.recipeid

onMounted(async () => {
  if (!recipeId) {
    error.value = 'No recipe ID provided'
    loading.value = false
    return
  }

  try {
    const res = await fetch(`/api/recipes/${recipeId}`)
    if (!res.ok) throw new Error(`Failed to load recipe: ${res.statusText}`)
    existingRecipe.value = await res.json()
  } catch (err: any) {
    console.error(err)
    error.value = err.message || 'Error fetching recipe'
  } finally {
    loading.value = false
  }
})

const updateRecipe = async (recipe: Recipe, file: File | null) => {
  if (!recipeId) return

  if (file) {
    try {
      const res = await fetch(`/api/s3/recipe-images?fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}`);
      const { uploadUrl, fileUrl } = await res.json();
      await fetch( uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
      recipe.image_src = fileUrl;
    }
    catch (err) {
      console.error('Failed to upload image:', err);
      return;
    }
  }
  else if (!recipe.image_src) {
    recipe.image_src = 'WorldFoodLogo.png';
  }

  try {
    const userId = authStore.userAttributes?.sub
    if (!userId) throw new Error("User not logged in")

    const ingredientsPayload = recipe.ingredients.map(i => ({
      ingredient_name: i.ingredient_name || "",
      amount_quantity: i.amount_quantity ?? null,
      unit: i.unit || "unit",
    }))

    const payload = {
      user_id: userId,
      title: recipe.title || "",
      dish_description: recipe.dish_description || "",
      cooking_time: recipe.cooking_time ?? 0,
      servings: recipe.servings ?? 1,
      recipe_steps: recipe.recipe_steps_text || "",
      countries: recipe.country ? [recipe.country] : [],
      tags: recipe.tags || [],
      rating: 0,
      ingredients: ingredientsPayload,
      image_src: recipe.image_src
    }

    const token = await authStore.getAccessToken()
    const res = await fetch(`/api/recipes/${recipeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`Failed to update recipe: ${errorText}`)
    }

    const updated = await res.json()
    router.push(`/recipes/${recipeId}`)
  } catch (err: any) {
    console.error("Update failed:", err)
    alert(err.message || "Failed to update recipe")
  }
}
</script>

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

<script setup lang="ts">
import { ref } from 'vue'
import RecipeForm from './RecipeForm.vue'
import type { Recipe } from './RecipeForm.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const tagsInput = ref<string>('')
const submitted = ref<boolean>(false)
const router = useRouter()

const authStore = useAuthStore();

interface RecipeIngredientPayload {
  ingredient_name: string;
  amount_quantity: number | null;
  unit: string;
}

const submitRecipe = async (recipe: Recipe, file: File | null) => {
  if (file) {
    try {
      const res = await fetch(`/api/s3/recipe-images?fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}`);
      const { uploadUrl, fileUrl } = await res.json();
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file
      });

      if (!uploadResponse.ok) throw new Error('S3 upload failed');
      recipe.image_src = fileUrl;
    } catch (err) {
      console.error('Failed to upload image: ', err);
      return;
    }
  }
  else {
    recipe.image_src = 'WorldFoodLogo.png';
  }

  try {
    const ingredientsPayload: RecipeIngredientPayload[] = recipe.ingredients.map(i => ({
      ingredient_name: i.ingredient_name || "",
      amount_quantity: i.amount_quantity ?? null,
      unit: i.unit || "unit",
    }));

    const userId = authStore.userAttributes?.sub;
    if (!userId) throw new Error("User not logged in");

    const payload = {
      user_id: userId, // replace with logged-in user ID
      title: recipe.title || "",
      dish_description: recipe.dish_description || "",
      cooking_time: recipe.cooking_time ?? 0,
      servings: recipe.servings ?? 1,
      recipe_steps: recipe.recipe_steps_text || "",
      countries: recipe.country ? [recipe.country] : [],
      tags: recipe.tags || [],
      rating: 0,
      creation_date: new Date().toISOString(),
      ingredients: ingredientsPayload,
      image_src: recipe.image_src || ""
    };

    const token = await authStore.getAccessToken();

    const response = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create recipe: ${errorText}`);
    }

    const newRecipe = await response.json();
    // Redirect to the new recipe page
    router.push(`/recipes/${newRecipe.recipe_id}`);
  } catch (error) {
    console.error("Error creating recipe:", error);
  }
};


</script>

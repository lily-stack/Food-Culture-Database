<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
    
    <div class="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-semibold text-center mb-4">AI Search</h2>

      <input
        v-model="query"
        @keyup.enter="search"
        type="text"
        placeholder="Ask anything..."
        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        @click="search"
        class="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Search
      </button>
    </div>

    <div
      v-if="result"
      class="bg-white mt-6 p-6 rounded-xl shadow-lg w-full max-w-md"
    >
      <h3 class="text-xl font-semibold mb-2">Result</h3>
      <p class="text-gray-700 whitespace-pre-line">{{ result }}</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const query = ref<string>("")
const result = ref<string | null>(null)

function search(): void {
  if (!query.value.trim()) {
    result.value = "Please enter a search query."
    return
  }

  // Placeholder — replace with real AI call later
  result.value = `AI response placeholder.\nYou searched for: "${query.value}"`

  // Example future call:
  /*
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: query.value })
  })
  const data = await response.json()
  result.value = data.answer
  */
}
</script>

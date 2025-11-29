<template>
	<img class="w-full h-[100px]" src="../../burger.jpg"></img>
	<div class="mt-2">
		<h2 v-if="requestReceived === true">
			API connection working!
		</h2>
		<h2 v-else-if="requestReceived === false">
			API connection failed. Run npm run dev in the server directory to start it
		</h2>
		<h2 v-else>
			Testing connection to API...
		</h2>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';


const requestReceived = ref<boolean | undefined>(undefined);

onMounted(() => {
	fetch('/api/test').then(response => {
		if (response.ok) {
			requestReceived.value = true;
		} else {
			requestReceived.value = false;
		}
	})
	fetch('/api/recipes/1').then(async response => {
		const body = await response.json()
		console.log('test query for recipe with id 1:', body)
	})
})
</script>


<style scoped></style>

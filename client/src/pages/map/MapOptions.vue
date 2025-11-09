<template>
	<div class="min-w-[200px] bg-white mb-4 ml-4 rounded-lg shadow-lg flex px-2 py-1 text-sm border border-gray-200">
		<div>
			<strong>Map Resolution</strong>
			<div class="flex gap-3">
				<div>
					<RadioInput v-model="model" value="medium">
						Medium
					</RadioInput>
				</div>
				<div>
					<RadioInput v-model="model" value="high">
						High
					</RadioInput>
				</div>
			</div>
		</div>
		<div class="border-l border-gray-200 ml-4 pl-4 flex flex-col">
			<strong>Go to Country</strong>
			<div class="flex gap-1">
				<TextInput class="w-42 py-0.5!" v-model="findCountryText" @enter="search"></TextInput>
				<button
					class="border border-gray-300 hover:bg-gray-100 active:bg-gray-200 transition-colors rounded-lg w-7"
					@click="search"
				>
					<i class="fa-solid fa-arrow-right"></i>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import RadioInput from '@/components/RadioInput.vue';
import TextInput from '@/components/TextInput.vue';
import { ref } from 'vue';

const model = defineModel('resolution');
const findCountryText = ref<string>("");
const emit = defineEmits<{
	(e: 'goToCountry', text: string): void
}>();

function search() {
	emit("goToCountry", findCountryText.value);
}

</script>

<style scoped></style>

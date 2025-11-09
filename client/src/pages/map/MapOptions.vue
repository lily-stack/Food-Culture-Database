<template>
	<div class="w-[200px] bg-white mb-4 ml-4 rounded-lg shadow-lg flex px-2 py-1 text-sm">
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
	</div>
</template>

<script setup lang="ts">
import RadioInput from '@/components/RadioInput.vue';

const model = defineModel('resolution')

</script>

<style scoped></style>

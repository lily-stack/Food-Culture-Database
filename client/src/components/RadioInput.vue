<template>
	<label>
		<input type="radio" :value="value" :checked="model === value"
			@change="update" />
		<slot></slot>
	</label>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const model = defineModel()
const props = defineProps<{
	value: string | number | boolean
}>()

function update() {
	model.value = props.value;
}

</script>

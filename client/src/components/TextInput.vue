<template>
	<input :id="id" :type="type" :placeholder="placeholder" :disabled="disabled" v-model="model"
		@focus="$emit('focus', $event)" @blur="$emit('blur', $event)" @keydown.enter="$emit('enter', $event)"
		:class="[
			'px-3 py-1 rounded-lg border transition-colors duration-150 focus:outline-none',
			error ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
		]" :aria-invalid="error ? 'true' : 'false'" />
</template>

<script setup lang="ts">

const model = defineModel<string>({ default: '' });

const props = defineProps({
	label: { type: String, default: '' },
	placeholder: { type: String, default: '' },
	type: { type: String, default: 'text' },
	disabled: { type: Boolean, default: false },
	error: { type: Boolean, default: false },
	id: { type: String, default: () => `txt-${Math.random().toString(36).slice(2, 9)}` }
});

const emit = defineEmits(['focus', 'blur', 'enter']);
</script>

<style scoped>
input:focus {
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
}
</style>

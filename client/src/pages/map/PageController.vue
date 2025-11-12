<template>
	<div class="flex justify-center p-2 gap-1 text-gray-700">
		<div class="item" @click="goToPrev" :class="{ 'pointer-events-none opacity-40': currentPage === 1 }">
			<i class="fa-solid fa-angle-left"></i>
		</div>
		<template v-if="numPages <= MAX_PAGES_SHOWN">
			<div v-for="n in numPages" :key="n" :class="['item', { 'bg-gray-200': n === currentPage }]">
				{{ n }}
			</div>
		</template>
		<template v-else>
			<div class="item" :class="{ 'bg-gray-200': currentPage === 1 }" @click="goTo(1)">
				1
			</div>
			<div v-if="showLeftEllipsis" class="item pointer-events-none">...</div>
			<div v-for="n in middlePages" :key="n" :class="['item', { 'bg-gray-200': n === currentPage }]"
				@click="goTo(n)">
				{{ n }}
			</div>
			<div v-if="showRightEllipsis" class="item pointer-events-none">...</div>
			<div class="item" :class="{ 'bg-gray-200': currentPage === numPages }" @click="goTo(numPages)">
				{{ numPages }}
			</div>
		</template>

		<div class="item" @click="goToNext" :class="{ 'pointer-events-none opacity-40': currentPage === numPages }">
			<i class="fa-solid fa-angle-right"></i>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
	numPages: number
	currentPage: number // 1-indexed
}>()

const emit = defineEmits(['update:currentPage'])

const MAX_PAGES_SHOWN = 6;

const showLeftEllipsis = computed(() => props.currentPage > 3)
const showRightEllipsis = computed(() => props.currentPage < props.numPages - 2)

const middlePages = computed(() => {
	if (props.numPages <= MAX_PAGES_SHOWN) return []
	if (props.currentPage <= 3) return [2, 3, 4, 5]
	if (props.currentPage >= props.numPages - 2)
		return [props.numPages - 4, props.numPages - 3, props.numPages - 2, props.numPages - 1]
	return [props.currentPage - 1, props.currentPage, props.currentPage + 1]
})

function goTo(page: number) {
	if (page >= 1 && page <= props.numPages) emit('update:currentPage', page)
}
function goToPrev() {
	goTo(props.currentPage - 1)
}
function goToNext() {
	goTo(props.currentPage + 1)
}
</script>

<style scoped>
.item {
	width: 24px;
	height: 24px;
	text-align: center;
	border-radius: var(--radius-xl);
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
}

.item:hover {
	background-color: var(--color-gray-200);
}
</style>

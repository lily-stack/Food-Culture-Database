import { nextTick, type DirectiveBinding, type ObjectDirective } from 'vue';

interface ClickOutsideElement extends HTMLElement {
	_clickOutsideHandler?: (event: MouseEvent) => void;
}

const clickAway: ObjectDirective = {
	async mounted(el: ClickOutsideElement, binding: DirectiveBinding) {
		await new Promise(resolve => setTimeout(resolve, 0));
		el._clickOutsideHandler = async (event: MouseEvent) => {
			if (!(el === event.target || el.contains(event.target as Node))) {
				binding.value(event);
			}
		};
		document.addEventListener('click', el._clickOutsideHandler);
	},
	unmounted(el: ClickOutsideElement) {
		if (el._clickOutsideHandler) {
			document.removeEventListener('click', el._clickOutsideHandler);
			delete el._clickOutsideHandler;
		}
	},
};

export default clickAway;

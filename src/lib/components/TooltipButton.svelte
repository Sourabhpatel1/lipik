<script lang="ts">
	import { onDestroy, onMount, type Snippet } from 'svelte';
	import { computePosition, flip, shift, arrow } from '@floating-ui/dom';
	let {
		children,
		tooltipContent,
		onclick,
		...rest
	}: { children: Snippet; tooltipContent: string; onclick?: () => void } = $props();

	let button: HTMLButtonElement;
	let tooltip: HTMLDivElement;
	let arrowEl: HTMLDivElement;

	function update() {
		computePosition(button, tooltip, {
			placement: 'top',
			middleware: [flip(), shift(), arrow({ element: arrowEl })]
		}).then(({ x, y }) => {
			Object.assign(tooltip.style, {
				left: `${x}px`,
				top: `${y - 7}px`
			});
		});
	}

	function showTooltip() {
		tooltip.style.display = 'block';
		update();
	}

	function hideTooltip() {
		tooltip.style.display = '';
	}

	onMount(() => {
		[
			['mouseenter', showTooltip],
			['mouseleave', hideTooltip],
			['focus', showTooltip],
			['blur', hideTooltip]
		].forEach(([event, listener]) => {
			button.addEventListener(event as keyof HTMLElementEventMap, listener as () => void);
		});
	});

	onDestroy(() => {
		if (button) {
			[
				['mouseenter', showTooltip],
				['mouseleave', hideTooltip],
				['focus', showTooltip],
				['blur', hideTooltip]
			].forEach(([event, listener]) => {
				button.removeEventListener(event as keyof HTMLElementEventMap, listener as () => void);
			});
		}
	});
</script>

<button
	type="button"
	id="button"
	class="btn"
	{onclick}
	{...rest}
	aria-describedby="tooltip"
	bind:this={button}
>
	{@render children()}
</button>
<div id="tooltip" bind:this={tooltip}>
	<p>
		{tooltipContent}
	</p>
</div>

<style>
	#tooltip {
		position: absolute;
		width: max-content;
		padding: 0.25rem 0.5rem;
		top: 0;
		left: 0;
		display: none;
		color: var(--color-bg);
		background: var(--color-text);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-lg);

		&::after {
			content: '';
			position: absolute;
			top: 85%;
			left: 50%;
			transform: translateX(-50%);
			border-left: 10px solid transparent;
			border-right: 10px solid transparent;
			border-top: 10px solid var(--color-text);
		}
	}
</style>

<script lang="ts">
	import { Link } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	let {
		href,
		children
	}: {
		href: string;
		children: Snippet;
	} = $props();
</script>

<a {href}>
	{@render children()}
	<Link size={18} />
</a>

<style>
	a {
		padding: 0.5rem 0;
		position: relative;
		width: fit-content;
		display: flex;
		align-items: center;
		gap: 1rem;
		font-size: var(--fs-lg);
		font-weight: var(--fw-dark);
		text-decoration: none;
		color: currentColor;
		font-size: var(--fs-lg);
		transition: all 0.3s ease;

		&::after {
			content: '';
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 100%;
			border-block-end: 1px solid var(--color-green);
			transform: scaleX(0);
			transition: all 0.3s ease;
			transform-origin: bottom left;
		}

		&:hover::after {
			transform: scaleX(100%);
		}
	}
</style>

<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		description,
		children
	}: { title: string; description?: string; children?: Snippet } = $props();
</script>

<div class="page-header">
	<div class="title">
		<div class="page-title">
			<h1>{title}</h1>
		</div>
		{#if description}
			<div class="page-description">
				<p>{description}</p>
			</div>
		{/if}
	</div>
	{#if children}
		<div class="actions">{@render children()}</div>
	{/if}
</div>

<style>
	.page-header {
		position: sticky;
		top: 0;
		padding: 0.5rem 1rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: var(--color-bg);
		border-block-end: 1px solid currentColor;
		z-index: 999;

		& .title {
			display: flex;
			flex-direction: column;
			gap: 0.9rem;

			& h1 {
				font-weight: var(--fw-base);
			}
			& p {
				padding-left: 0.125rem;
			}
		}

		& .actions {
			display: flex;
			align-items: center;
			gap: 1rem;
		}
	}
</style>

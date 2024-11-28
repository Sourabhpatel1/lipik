<script lang="ts">
	import { page } from '$app/stores';
	import { Bell, ChevronRight, Search } from 'lucide-svelte';

	let paths = $page.route.id?.split('/').slice(1);
</script>

<nav id="top-nav" aria-label="top-navigation">
	<div class="crumbs">
		<a href="/" class="logo" aria-label="logo"> </a>
		{#if paths}
			{#each paths as path, i}
				<ChevronRight />
				<a href="/{paths.slice(0, i + 1).join('/')}">{path.toUpperCase().replace('-', ' ')}</a>
			{/each}
		{/if}
	</div>
	<div class="actions">
		<div class="search">
			<Search />
			<input type="text" placeholder="Search" />
		</div>
		<button>
			<Bell size={16} />
		</button>
	</div>
</nav>

<style>
	nav {
		position: relative;
		max-height: 48px;
		padding: 0 1.4rem;
		grid-column: span 2;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-block-end: 1px solid lightgray;

		& .actions {
			display: flex;
			align-items: center;
			justify-content: start;
			gap: 4rem;

			& .search {
				padding: 0.125rem 0.5rem;
				display: flex;
				align-items: center;
				gap: 0.25rem;
				border: 1px solid lightgray;
				border-radius: var(--radius-md);

				&:focus-within {
					border-color: currentColor;
				}

				& input {
					border: none;
					outline: none;
					box-shadow: none;
				}
			}

			& button {
				padding: 0.125rem;
				justify-content: center;
				width: 24px;
				height: 24px;
			}
		}

		& .logo,
		& .crumbs,
		& .search,
		& .actions {
			display: flex;
			align-items: center;

			& a {
				color: currentColor;
				text-decoration: none;

				&:first-child {
					margin-right: -0.25rem;
				}
			}
		}
	}
</style>

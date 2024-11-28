<script lang="ts">
	import '../app.css';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import { navigating, page } from '$app/stores';

	let { children } = $props();
</script>

{#if $navigating}
	<Loader />
{/if}
<main>
	<Sidebar />
	<div id="app-content">
		{@render children()}
	</div>
</main>

<style>
	main {
		height: 100vh;
		display: grid;
		grid-template-columns: auto 1fr;
		overflow: hidden;

		& #app-content {
			height: 100%;
			display: flex;
			flex-direction: column;
			overflow: hidden;
		}
	}
</style>

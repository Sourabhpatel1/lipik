<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';

	let { data } = $props();
</script>

<div class="container">
	<PageHeader
		title="Dashboard"
		description="Information about your business in a
    glace"
	>
		<BackButton />
	</PageHeader>
</div>

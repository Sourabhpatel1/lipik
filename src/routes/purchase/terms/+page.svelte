<script lang="ts">
	import { goto } from '$app/navigation';
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { PlusCircle } from 'lucide-svelte';
</script>

<div class="container">
	<PageHeader
		title="Purchase Terms And Conditions"
		description="View and manage terms and conditions for purchase orders and purchase invoices"
	>
		<button
			class="btn"
			onclick={() => {
				goto('/purchase/terms/add-terms');
			}}
		>
			<PlusCircle size={16} />
			Add New Terms
		</button>
		<BackButton />
	</PageHeader>
</div>

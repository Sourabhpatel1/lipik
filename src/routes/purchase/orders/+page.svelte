<script lang="ts">
	import { goto } from '$app/navigation';
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { PlusCircle } from 'lucide-svelte';

	let { data } = $props();
	console.log(data);
</script>

<div class="container">
	<PageHeader title="Purchase Orders" description="View and Manage Purchase Orders">
		<button
			class="btn"
			onclick={() => {
				goto('/purchase/orders/add-order');
			}}
		>
			<PlusCircle size={16} />
			Add New Order
		</button>
		<BackButton />
	</PageHeader>
</div>

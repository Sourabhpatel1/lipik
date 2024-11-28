<script lang="ts">
	import { goto } from '$app/navigation';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { PlusCircle } from 'lucide-svelte';
</script>

<div class="container">
	<PageHeader title="Purchases" description="Information about purchases">
		<button class="btn" onclick={() => goto('/purchase/orders/add-order')}>
			<PlusCircle size={16} />
			New Purchase Order
		</button>
		<button class="btn" onclick={() => goto('/purchase/invoices/add-invoice')}>
			<PlusCircle size={16} />
			New Purchase Invoice
		</button>
	</PageHeader>
</div>

<script lang="ts">
	import { goto } from '$app/navigation';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { ExternalLink } from 'lucide-svelte';
</script>

<div class="container">
	<PageHeader title="Purchases" description="Information about purchases">
		<button class="btn" onclick={() => goto('/purchase/orders')}>
			Purchase Orders
			<ExternalLink size={16} />
		</button>
		<button class="btn" onclick={() => goto('/purchase/invoices')}>
			Purchase Invoices
			<ExternalLink size={16} />
		</button>
	</PageHeader>
</div>

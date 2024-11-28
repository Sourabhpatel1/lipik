<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { PlusCircle } from 'lucide-svelte';
</script>

<div class="container">
	<PageHeader title="Inventory" description="&nbsp">
		<button class="btn">
			<PlusCircle size={16} />
			Add New Category
		</button>
		<button class="btn">
			<PlusCircle size={16} />
			Add New Product
		</button>
		<button class="btn">
			<PlusCircle size={16} />
			Add New Service
		</button>
		<BackButton />
	</PageHeader>
</div>

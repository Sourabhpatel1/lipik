<script lang="ts">
	import { goto } from '$app/navigation';
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { PlusCircle } from 'lucide-svelte';

	let { data } = $props();

	let name: string | undefined = $state();
	let rate: number | undefined = $state();

	let filteredTaxes = $derived.by(() => {
		let taxes = data.taxes;
		if (name) {
			taxes = taxes.filter((t) => t.name.toLowerCase().includes(name ? name.toLowerCase() : ''));
		}
		if (rate) {
			taxes = taxes.filter((t) => t.rate === rate);
		}
		return taxes;
	});
</script>

<div class="container">
	<PageHeader title="Taxes" description="View and setup taxes for your company">
		<button
			class="btn"
			onclick={() => {
				goto('/taxes/add-tax');
			}}
		>
			<PlusCircle size={16} />
			Add New Tax
		</button>
		<BackButton />
	</PageHeader>

	<fieldset class="filters">
		<div class="filter">
			<input type="text" bind:value={name} placeholder="Tax Name" />
		</div>
		<div class="filter">
			<input type="number" placeholder="Tax Rate" bind:value={rate} />
		</div>
	</fieldset>

	<div class="row-container">
		<div class="header">
			<span>#</span>
			<span>Name</span>
			<span>Rate</span>
		</div>
		<div class="rows">
			{#each filteredTaxes as tax, i}
				<div class="row">
					<span>{i + 1}</span>
					<span>{tax.name}</span>
					<span>{tax.rate}</span>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.container {
		gap: 0.5rem;

		.filters {
			width: fit-content !important;
		}

		.header,
		.row {
			grid-template-columns: 40px repeat(2, 400px);
		}
	}
</style>

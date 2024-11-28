<script lang="ts">
	import { goto } from '$app/navigation';
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SelectBox from '$lib/components/SelectBox.svelte';
	import TooltipButton from '$lib/components/TooltipButton.svelte';
	import { PenLine, PlusCircle } from 'lucide-svelte';

	let { data } = $props();
	let selectedCategory: string | undefined = $state();
	let selectedUnit: string | undefined = $state();
	let selectedAccount: string | undefined = $state();
	let searchTerm: string | undefined = $state();

	let filteredProducts = $derived.by(() => {
		let products = data.products;
		if (searchTerm) {
			products = products.filter((p) =>
				p.name.toLowerCase().includes(searchTerm ? searchTerm.toLowerCase() : '')
			);
		}
		if (selectedAccount) {
			products = products.filter((p) => p.account.name === selectedAccount);
		}
		if (selectedUnit) {
			products = products.filter((p) => p.unit.name === selectedUnit);
		}
		if (selectedCategory) {
			products = products.filter((p) => p.category?.name === selectedCategory);
		}
		return products;
	});

	let categories = $derived.by(() => {
		let cat = [...new Set(data.products.map((p) => p.category?.name))].map((c) => ({
			label: c ?? 'Uncategorized',
			value: c ?? 'Uncategorized'
		}));
		return cat;
	});
	let units = $derived.by(() => {
		return [...new Set(data.products.map((p) => p.unit.name))].map((u) => ({ label: u, value: u }));
	});
	let accounts = $derived.by(() => {
		return [...new Set(data.products.map((p) => p.account.name))].map((a) => ({
			label: a,
			value: a
		}));
	});
</script>

<div class="container">
	<PageHeader title="Products" description="View, add and edit products">
		<button
			class="btn"
			onclick={() => {
				goto('/inventory/products/add-product');
			}}
		>
			<PlusCircle size={16} />
			Add New Product
		</button>
		<BackButton />
	</PageHeader>
	<fieldset class="filters">
		<legend>Filter Products</legend>
		<input type="text" placeholder="Product Name" bind:value={searchTerm} />
		<SelectBox
			options={accounts}
			placeholder="Product Account"
			bind:value={selectedAccount}
			onClear={() => (selectedAccount = undefined)}
		/>
		<SelectBox
			options={categories}
			placeholder="Product Category"
			bind:value={selectedCategory}
			onClear={() => (selectedCategory = undefined)}
		/>
		<SelectBox
			options={units}
			placeholder="Product Unit"
			bind:value={selectedUnit}
			onClear={() => (selectedUnit = undefined)}
		/>
	</fieldset>

	<div class="row-container">
		<div class="header">
			<span>#</span>
			<span>Product Name</span>
			<span>Product Account</span>
			<span>Product Category</span>
			<span>Product Unit</span>
			<span>Description</span>
			<span>Actions</span>
		</div>
		<div class="rows">
			{#each filteredProducts as product, i}
				<div class="row">
					<span>{i + 1}</span>
					<span>{product.name}</span>
					<span>{product.account.name}</span>
					<span>{product.category?.name}</span>
					<span>{product.unit.name}</span>
					<span>{product.description}</span>
					<div class="actions">
						<TooltipButton tooltipContent="Edit Product">
							<PenLine size={16} />
						</TooltipButton>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.row-container {
		.header,
		.row {
			grid-template-columns: 40px 1fr 1fr 1fr 1fr 2fr 100px;
		}
	}
</style>

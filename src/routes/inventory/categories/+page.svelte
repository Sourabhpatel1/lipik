<script lang="ts">
	import { goto } from '$app/navigation';
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import TooltipButton from '$lib/components/TooltipButton.svelte';
	import { Eye, PlusCircle, X } from 'lucide-svelte';

	let { data } = $props();

	let viewingCategory: undefined | number = $state(undefined);
	let selectedCategory = $derived(data.categories.find((c) => c.id === viewingCategory));
	let searchTerm: string | undefined = $state();

	let filteredCategories = $derived.by(() => {
		let categories = data.categories;
		if (searchTerm) {
			categories = categories.filter((c) =>
				c.name.toLowerCase().includes(searchTerm?.toLowerCase() || '')
			);
		}
		return categories;
	});
</script>

<div class="container">
	<PageHeader
		title="Product Categories"
		description="View, add and edit product
    categories"
	>
		<button
			class="btn"
			onclick={() => {
				goto('/inventory/categories/add-category');
			}}
		>
			<PlusCircle size={16} />
			Add New Category
		</button>
		<BackButton />
	</PageHeader>
	<fieldset class="filters">
		<legend>Filter Categories</legend>
		<input type="text" placeholder="Category Name" bind:value={searchTerm} />
	</fieldset>
	<div class="row-container">
		<div class="header">
			<span>#</span>
			<span>Category Name</span>
			<span>Category Description</span>
			<span>Actions</span>
		</div>
		<div class="rows">
			{#each filteredCategories as category, i (i)}
				<div class="row">
					<span>{i + 1}</span>
					<span>{category.name}</span>
					<span>{category.description}</span>
					<div class="actions">
						<TooltipButton
							tooltipContent="View Products"
							onclick={() => {
								viewingCategory = category.id;
							}}
						>
							<Eye size={16} />
						</TooltipButton>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

{#if selectedCategory}
	<div class="product-view">
		<div class="row-container">
			<h2>{selectedCategory.name}</h2>
			<hr />
			<div class="header">
				<span>#</span>
				<span>Product Name</span>
				<span>Unit</span>
				<span>List Price</span>
				<span>Purchase Price</span>
				<span>Sale Price</span>
			</div>
			<div class="rows">
				{#each selectedCategory.products as product, i}
					<div class="row">
						<span>{i + 1}</span>
						<span>{product.name}</span>
						<span>{product.unit.name} - ({product.unit.symbol})</span>
						<span>{product.listPrice}</span>
						<span>{product.purchasePrice}</span>
						<span>{product.salePrice}</span>
					</div>
				{/each}
			</div>
			<button
				class="btn"
				onclick={() => {
					viewingCategory = undefined;
				}}
			>
				<X size={16} />
			</button>
		</div>
	</div>
{/if}

<style>
	fieldset {
		width: fit-content;
	}
	.container {
		.header,
		.row {
			grid-template-columns: 25px 1fr 3fr 100px;
		}
	}
	.product-view {
		height: 100vh;
		width: 100vw;
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.25);
		backdrop-filter: blur(5px);
		z-index: 999;
		overflow: hidden;

		.row-container {
			position: relative;
			flex-grow: 1;
			max-width: 80% !important;
			height: 80% !important;
			padding: 2rem 1rem;
			background: var(--color-bg);
			overflow: hidden;

			h2 {
				font-weight: var(--fw-base);
			}

			hr {
				margin-block: 0.5rem;
			}

			> button {
				padding: 0.3rem;
				position: absolute;
				top: 0px;
				right: 0px;
				width: 12px;
				height: 12px;
				display: flex;
				align-items: center;
				justify-content: center;
				background: var(--color-red);
				border-radius: var(--radius-sm);
			}

			.rows {
				flex-grow: 1;
				padding: 1rem 0;
				height: 100%;
				overflow-y: auto !important;
			}

			.header,
			.row {
				grid-template-columns: 40px repeat(5, 1fr);
			}
		}
	}
</style>

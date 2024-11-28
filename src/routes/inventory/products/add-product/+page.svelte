<script lang="ts">
	import { goto } from '$app/navigation';
	import BackButton from '$lib/components/BackButton.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SelectBox from '$lib/components/SelectBox.svelte';
	import { newProductSchema } from '$lib/zod/inventory.js';
	import { Control, Field, FieldErrors, Label } from 'formsnap';
	import { PlusCircle, CircleCheckBig } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data } = $props();

	let loading = $state(false);

	const form = superForm(data.form, {
		dataType: 'json',
		validators: zodClient(newProductSchema),
		validationMethod: 'oninput',
		onSubmit: () => (loading = true),
		onUpdated: ({ form }) => {
			loading = false;
			if (form.message) {
				alert(form.message.type + ' : ' + form.message.text);
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

{#if loading}
	<Loader />
{:else}
	<div class="container">
		<PageHeader
			title="Add New Product"
			description="Fill out the information and
    click on submit to add new product"
		>
			<button
				class="btn"
				onclick={() => {
					goto('/inventory/products/add-unit');
				}}
			>
				<PlusCircle size={16} />Add New Unit
			</button>
			<button
				class="btn"
				onclick={() => {
					goto('/inventory/categories/add-category');
				}}
			>
				<PlusCircle size={16} />Add New Category
			</button>
			<BackButton />
		</PageHeader>

		<form method="POST" class="simple-form" use:enhance>
			<div class="field">
				<Field {form} name="name">
					<Control let:attrs>
						<Label>Product Name</Label>
						<input type="text" {...attrs} bind:value={$formData.name} />
					</Control>
					<FieldErrors></FieldErrors>
				</Field>
			</div>
			<div class="general">
				<div class="field">
					<Field {form} name="unitId">
						<Control let:attrs>
							<Label>Product Unit</Label>
							<SelectBox
								{...attrs}
								bind:value={$formData.unitId}
								onClear={() => {
									$formData.unitId = undefined as unknown as number;
								}}
								options={data.units.map((u) => ({
									label: u.name + ` - (${u.symbol})`,
									value: u.id
								}))}
							/>
						</Control>
						<FieldErrors></FieldErrors>
					</Field>
				</div>
				<div class="field">
					<Field {form} name="categoryId">
						<Control let:attrs>
							<Label>Product Category (Optional)</Label>
							<SelectBox
								{...attrs}
								bind:value={$formData.categoryId}
								onClear={() => {
									$formData.categoryId = undefined as unknown as number;
								}}
								options={data.categories.map((c) => ({ label: c.name, value: c.id }))}
							/>
						</Control>
						<FieldErrors></FieldErrors>
					</Field>
				</div>
			</div>
			<div class="accounting">
				<div class="field">
					<Field {form} name="accountId">
						<Control let:attrs>
							<Label>Product Account</Label>
							<SelectBox
								{...attrs}
								bind:value={$formData.accountId}
								onClear={() => {
									$formData.accountId = undefined as unknown as number;
								}}
								options={data.inventoryAccounts.map((a) => ({ label: a.name, value: a.id }))}
							/>
						</Control>
						<FieldErrors></FieldErrors>
					</Field>
				</div>
				<div class="field">
					<Field {form} name="taxId">
						<Control let:attrs>
							<Label>Product Tax (Optional)</Label>
							<SelectBox
								{...attrs}
								bind:value={$formData.taxId}
								onClear={() => {
									$formData.taxId = undefined as unknown as number;
								}}
								options={data.taxes.map((a) => ({ label: a.name, value: a.id }))}
							/>
						</Control>
						<FieldErrors></FieldErrors>
					</Field>
				</div>
			</div>
			<div class="pricing">
				<div class="field">
					<Field {form} name="listPrice">
						<Control let:attrs>
							<Label>List Price (Optional)</Label>
							<input type="number" {...attrs} bind:value={$formData.listPrice} />
						</Control>
						<FieldErrors></FieldErrors>
					</Field>
				</div>
				<div class="field">
					<Field {form} name="purchasePrice">
						<Control let:attrs>
							<Label>Purchase Price (Optional)</Label>
							<input type="number" {...attrs} bind:value={$formData.purchasePrice} />
						</Control>
						<FieldErrors></FieldErrors>
					</Field>
				</div>
				<div class="field">
					<Field {form} name="salePrice">
						<Control let:attrs>
							<Label>Sale Price (Optional)</Label>
							<input type="number" {...attrs} bind:value={$formData.salePrice} />
						</Control>
						<FieldErrors></FieldErrors>
					</Field>
				</div>
			</div>
			<div class="footer">
				<button type="submit" class="btn">
					<CircleCheckBig />Submit
				</button>
			</div>
		</form>
	</div>
{/if}

<style>
	form {
		height: 100%;
		margin: 1rem;
		gap: 0;
		.general,
		.accounting,
		.pricing {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 1rem;
		}
	}
</style>

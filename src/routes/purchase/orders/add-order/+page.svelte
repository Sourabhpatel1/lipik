<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SelectBox from '$lib/components/SelectBox.svelte';
	import TooltipButton from '$lib/components/TooltipButton.svelte';
	import { newOrderSchema } from '$lib/zod/trade.js';
	import { Control, Field, FieldErrors, Label, Fieldset, Legend, ElementField } from 'formsnap';
	import { CheckCircle, CircleCheckBig, PlusCircle, Trash } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data } = $props();
	console.log(data.products);
	let loading = $state(false);
	let form = superForm(data.form, {
		dataType: 'json',
		validators: zodClient(newOrderSchema),
		validationMethod: 'onblur',
		taintedMessage: true,
		onSubmit: () => (loading = true),
		onUpdated: ({ form }) => {
			loading = false;
			if (form.message) {
				alert(form.message.type + ' : ' + form.message.text);
			}
		}
	});

	const { form: formData, enhance, errors } = form;

	const defaultItem = $formData.lineItems[0];

	function calculateAmounts(index: number) {
		let grossAmount = $formData.lineItems[index].quantity * $formData.lineItems[index].price;
		$formData.lineItems[index].discountAmount =
			grossAmount * ($formData.lineItems[index].discountPercent / 100);
		let amountAfterDiscount = grossAmount - $formData.lineItems[index].discountAmount;
		$formData.lineItems[index].taxAmount =
			amountAfterDiscount * ($formData.lineItems[index].taxRate / 100);
		$formData.lineItems[index].total = amountAfterDiscount + $formData.lineItems[index].taxAmount;
		console.log($errors);
	}

	function addItem() {
		$formData.lineItems = [...$formData.lineItems, defaultItem];
	}

	function removeItem(index: number) {
		$formData.lineItems = $formData.lineItems.filter((_, i) => i !== index);
	}

	onMount(() => {
		$formData.date = new Date().toISOString().slice(0, 10);
		$formData.number = data.po.length + 1;
	});
</script>

{#if loading}
	<Loader />
{:else}
	<div class="container">
		<PageHeader
			title="New Purchase Order"
			description="Fill out the inforamation and click on submit to add new purchase order"
		>
			<BackButton />
		</PageHeader>

		<form method="post" class="dynamic-form" use:enhance>
			<div class="information">
				<div class="field">
					<Field {form} name="date">
						<Control let:attrs>
							<Label>Order Date</Label>
							<input type="date" {...attrs} bind:value={$formData.date} />
						</Control>
						<FieldErrors />
					</Field>
				</div>
				<div class="field">
					<Field {form} name="number">
						<Control let:attrs>
							<Label>Order Number</Label>
							<input type="text" {...attrs} bind:value={$formData.number} />
						</Control>
						<FieldErrors />
					</Field>
				</div>
				<div class="field">
					<Field {form} name="partyId">
						<Control let:attrs>
							<Label>Vendor</Label>
							<SelectBox
								options={data.vendors.map((v) => ({ label: v.name, value: v.id }))}
								bind:value={$formData.partyId}
								onSelect={(o) => {
									if (data.vendors.find((v) => v.id === o.value)!.state === data.company.state) {
										$formData.taxationType = 'intra';
									} else {
										$formData.taxationType = 'inter';
									}
								}}
								onClear={() => {
									$formData.partyId = undefined as unknown as number;
								}}
								{...attrs}
							/>
						</Control>
						<FieldErrors />
					</Field>
				</div>
				<div class="field">
					<Field {form} name="taxationType">
						<Control let:attrs>
							<Label>Supply State</Label>
							<SelectBox
								{...attrs}
								bind:value={$formData.taxationType}
								options={[
									{ label: 'Intra-State', value: 'intra' },
									{ label: 'Inter-State', value: 'inter' }
								]}
							/>
						</Control>
						<FieldErrors />
					</Field>
				</div>
			</div>
			<Fieldset {form} name="lineItems">
				<Legend>Purchase Order Items</Legend>
				<div class="header">
					<span>#</span>
					<span>ITEM</span>
					<span>UOM</span>
					<span>Qty.</span>
					<span>Price</span>
					<span>Disc (%)</span>
					<span>Disc Amt.</span>
					<span>Tax</span>
					{#if $formData.taxationType === 'intra'}
						<span>CGST</span>
						<span>SGST</span>
					{:else}
						<span>IGST</span>
					{/if}
					<span>Total</span>
					<span></span>
				</div>
				<div class="rows">
					{#each $formData.lineItems as _, i}
						<div class="row">
							<span class="row-num">{i + 1}</span>
							<div class="element-field">
								<ElementField {form} name="lineItems[{i}].productId">
									<Control let:attrs>
										<Label class="sr-only">Item {i + 1}</Label>
										<SelectBox
											class={$errors.lineItems?.[i]?.productId ? 'error' : ''}
											{...attrs}
											placeholder="Item"
											options={data.products.map((p) => ({ label: p.name, value: p.id }))}
											bind:value={$formData.lineItems[i].productId}
											onSelect={(o) => {
												$formData.lineItems[i].productId = o.value;
												$formData.lineItems[i].price = data.products.find(
													(p) => p.id === $formData.lineItems[i].productId
												)?.salePrice as unknown as number;
												$formData.lineItems[i].taxId = data.taxes.find(
													(t) =>
														t.id ===
														(data.products.find((p) => p.id === o.value)
															?.taxId as unknown as number)
												)?.id as unknown as number;
												$formData.lineItems[i].taxRate = data.taxes.find(
													(t) => t.id === $formData.lineItems[i].taxId
												)?.rate as unknown as number;
												calculateAmounts(i);
											}}
											onClear={() => {
												$formData.lineItems[i].productId = undefined as unknown as number;
												calculateAmounts(i);
											}}
										/>
									</Control>
								</ElementField>
							</div>
							<span>
								{data.products.find((p) => p.id === $formData.lineItems[i].productId)?.unit.symbol}
							</span>
							<div class="element-field">
								<ElementField {form} name="lineItems[{i}].quantity">
									<Control let:attrs>
										<Label class="sr-only">Quantity {i + 1}</Label>
										<input
											type="number"
											bind:value={$formData.lineItems[i].quantity}
											placeholder="Qty"
											oninput={() => {
												calculateAmounts(i);
											}}
											{...attrs}
										/>
									</Control>
								</ElementField>
							</div>
							<div class="element-field">
								<ElementField {form} name="lineItems[{i}].price">
									<Control let:attrs>
										<Label class="sr-only">Price {i + 1}</Label>
										<input
											type="number"
											bind:value={$formData.lineItems[i].price}
											placeholder="Price"
											oninput={() => {
												calculateAmounts(i);
											}}
											{...attrs}
										/>
									</Control>
								</ElementField>
							</div>
							<div class="element-field">
								<ElementField {form} name="lineItems[{i}].discountPercent">
									<Control let:attrs>
										<Label class="sr-only">Discount Percent {i + 1}</Label>
										<input
											type="number"
											bind:value={$formData.lineItems[i].discountPercent}
											placeholder="Disc (%)"
											oninput={() => {
												calculateAmounts(i);
											}}
											{...attrs}
										/>
									</Control>
								</ElementField>
							</div>
							<span>
								{(
									($formData.lineItems[i].quantity *
										$formData.lineItems[i].price *
										$formData.lineItems[i].discountPercent) /
									100
								)?.toFixed(3) || 0}
							</span>
							<div class="element-field">
								<ElementField {form} name="lineItems[{i}].taxId">
									<Control let:attrs>
										<Label class="sr-only">Tax {i + 1}</Label>
										<SelectBox
											class={$errors.lineItems?.[i]?.taxId ? 'error' : ''}
											{...attrs}
											placeholder="Tax"
											options={data.taxes.map((p) => ({ label: p.name, value: p.id }))}
											bind:value={$formData.lineItems[i].taxId}
											onSelect={(o) => {
												$formData.lineItems[i].taxId = o.value;
												$formData.lineItems[i].taxRate = data.taxes.find((t) => t.id === o.value)
													?.rate as unknown as number;
												calculateAmounts(i);
											}}
											onClear={() => {
												$formData.lineItems[i].taxId = undefined as unknown as number;
												$formData.lineItems[i].taxRate = undefined as unknown as number;
												calculateAmounts(i);
											}}
										/>
									</Control>
								</ElementField>
							</div>
							{#if $formData.taxationType === 'intra'}
								<span>{($formData.lineItems[i].taxAmount / 2)?.toFixed(3)}</span>
								<span>{($formData.lineItems[i].taxAmount / 2)?.toFixed(3)}</span>
							{:else}
								<span>{$formData.lineItems[i].taxAmount?.toFixed(3)}</span>
							{/if}
							<span>{$formData.lineItems[i].total?.toFixed(3)}</span>
							<TooltipButton
								tooltipContent="Delete Item"
								onclick={() => {
									removeItem(i);
								}}
							>
								<Trash size={16} />
							</TooltipButton>
						</div>
					{/each}
				</div>
			</Fieldset>
			<div class="total">
				<div class="gross-total">
					<span>Gross Total</span>
					<span>{$formData.lineItems.reduce((a, b) => a + b.price * b.quantity, 0).toFixed(3)}</span
					>
				</div>
				<div class="discount">
					<span>Total Discount</span>
					<span>{$formData.lineItems.reduce((a, b) => a + b.discountAmount, 0).toFixed(3)}</span>
				</div>
				{#if $formData.taxationType === 'intra'}
					<div class="cgst">
						<span>CGST</span>
						<span>{($formData.lineItems.reduce((a, b) => a + b.taxAmount, 0) / 2).toFixed(3)}</span>
					</div>
					<div class="cgst">
						<span>SGST</span>
						<span>{($formData.lineItems.reduce((a, b) => a + b.taxAmount, 0) / 2).toFixed(3)}</span>
					</div>
				{:else}
					<div class="gst">
						<span>IGST</span>
						<span>{$formData.lineItems.reduce((a, b) => a + b.taxAmount, 0).toFixed(3)}</span>
					</div>
				{/if}
				<div class="tax">
					<span>Total Tax</span>
				</div>
				<div>
					<span>Total</span>
					<span>{$formData.lineItems.reduce((a, b) => a + b.total, 0).toFixed(3)}</span>
				</div>
			</div>
			<div class="actions">
				<button class="btn" type="button">Change Shipping Address</button>
			</div>
			<div class="footer">
				<button
					class="btn"
					type="button"
					onclick={() => {
						addItem();
					}}
				>
					<PlusCircle />Add Entry
				</button>
				<button class="btn" type="submit">
					<CircleCheckBig />
					Submit
				</button>
			</div>
		</form>
	</div>
{/if}

<style>
	.container {
		overflow: auto;
	}
	.dynamic-form {
		.row,
		.header {
			width: 100%;
			grid-template-columns: 40px 175px 35px repeat(4, minmax(120px, 1fr)) 135px 1fr 1fr 1fr 40px;
		}
		.total {
			padding: 0.25rem;
			display: flex;
			gap: 0.5rem;

			& > div {
				font-size: var(--fs-lg);
				& span:nth-child(1)::after {
					content: ' : ';
				}
				& span:nth-child(2) {
					font-weight: var(--fw-semibold);
				}
			}
		}
	}
</style>

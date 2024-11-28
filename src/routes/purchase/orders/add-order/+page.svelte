<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SelectBox from '$lib/components/SelectBox.svelte';
	import { newOrderSchema } from '$lib/zod/trade.js';
	import { Control, Field, FieldErrors, Label } from 'formsnap';
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data } = $props();
	let loading = $state(false);
	let form = superForm(data.form, {
		dataType: 'json',
		validators: zodClient(newOrderSchema),
		validationMethod: 'onblur',
		onSubmit: () => (loading = true),
		onUpdated: ({ form }) => {
			if (form.message) {
				alert(form.message.type + ' : ' + form.message.text);
			}
			loading = false;
		}
	});

	const { form: formData, enhance } = form;

	let enableTaxSelection = $derived.by(() => {
		return data.company.state && data.vendors.find((v) => v.id === $formData.partyId)?.state
			? true
			: false;
	});
	onMount(() => {
		$formData.date = new Date().toISOString().slice(0, 10);
		$formData.number = data.po.length + 1;
	});
</script>

<div class="container">
	<PageHeader
		title="New Purchase Order"
		description="Fill out the inforamation and click on submit to add new purchase order"
	>
		<BackButton />
	</PageHeader>

	<form method="post" class="item-form" use:enhance>
		<div class="doc-info">
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
						<Label>Taxation Type</Label>
						<SelectBox
							{...attrs}
							bind:value={$formData.taxationType}
							disabled={enableTaxSelection}
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
	</form>
</div>

<style>
	.item-form {
		padding: 1rem;
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		overflow: hidden;

		.doc-info {
			display: flex;
			gap: 1rem;
			flex-wrap: wrap;

			.field {
				flex-basis: 200px;
				display: flex;
				flex-direction: column;
				gap: 0.25rem;
				flex-shrink: 0;

				.input {
					min-width: 100%;
				}
			}
		}
	}
</style>

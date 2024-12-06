<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SelectBox from '$lib/components/SelectBox.svelte';
	import TooltipButton from '$lib/components/TooltipButton.svelte';
	import { newVoucherSchema, voucherTypes } from '$lib/zod/accounting.js';
	import { Control, Field, Label, Fieldset, Legend, ElementField } from 'formsnap';
	import { PlusCircle, Trash, CircleCheckBig } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data } = $props();

	const form = superForm(data.form, {
		dataType: 'json',
		validators: zodClient(newVoucherSchema),
		onSubmit: () => {
			loading = true;
		},
		onUpdated: ({ form }) => {
			if (form.errors.entries?.amount) {
				alert(form.errors.entries.amount);
			}
			if (form.message) {
				alert(form.message.type + ' : ' + form.message.text);
			}
			loading = false;
		}
	});
	const { form: formData, enhance, errors } = form;

	let loading = $state(false);

	function addRow() {
		$formData.entries = [
			...$formData.entries,
			{
				accountId: undefined as unknown as number,
				entryType: undefined as unknown as 'dr',
				amount: undefined as unknown as number
			}
		];
		setEntryType();
	}

	function removeRow(idx: number) {
		if ($formData.entries.length <= 2) {
			$formData.entries[idx] = {
				accountId: undefined as unknown as number,
				entryType: undefined as unknown as 'dr',
				amount: undefined as unknown as number
			};
			setEntryType();
		} else {
			$formData.entries = $formData.entries.filter((_, i) => idx !== i);
		}
	}

	function setEntryType() {
		const masterEntry = $formData.entries[0].entryType;
		if (!masterEntry) {
			$formData.entries.forEach((e) => (e.entryType = undefined as unknown as 'dr'));
		} else {
			$formData.entries.slice(1).forEach((e) => (e.entryType = masterEntry === 'dr' ? 'cr' : 'dr'));
		}
	}
</script>

{#if loading}
	<Loader />
{:else}
	<div class="container">
		<PageHeader
			title="New Accounting Vouchers"
			description="Create new accounting voucher by filling out the form below and
    click on submit"
		>
			<BackButton />
		</PageHeader>
		<form method="POST" class="dynamic-form" use:enhance>
			<div class="information">
				<div class="field">
					<Field {form} name="voucherDate">
						<Control let:attrs>
							<Label>Voucher Date</Label>
							<input type="date" {...attrs} bind:value={$formData.voucherDate} />
						</Control>
					</Field>
				</div>
				<div class="field">
					<Field {form} name="voucherType">
						<Control let:attrs>
							<Label>Voucher Type</Label>
							<SelectBox
								class={$errors.voucherType ? 'error' : ''}
								options={voucherTypes.map((v) => ({ label: v, value: v }))}
								{...attrs}
								bind:value={$formData.voucherType}
								onSelect={(o) => {
									$formData.voucherType = o.value;
								}}
								onClear={() => {
									$formData.voucherType = undefined as unknown as 'Journal';
								}}
							/>
						</Control>
					</Field>
				</div>
				<div class="field">
					<Field {form} name="voucherNumber">
						<Control let:attrs>
							<Label>Voucher Number</Label>
							<input type="number" {...attrs} bind:value={$formData.voucherNumber} />
						</Control>
					</Field>
				</div>
			</div>
			<Fieldset {form} name="entries">
				<Legend>Voucher Entries</Legend>
				<div class="rows">
					{#each $formData.entries as _, i}
						<div class="row">
							<span class="row-num">{i + 1}</span>
							<div class="element-field">
								<ElementField {form} name="entries[{i}].entryType">
									<Control let:attrs>
										<Label class="sr-only">Entry Type {i + 1}</Label>
										<SelectBox
											disabled={i > 0}
											class={$errors.entries?.[i]?.entryType ? 'error' : ''}
											{...attrs}
											placeholder="Entry Type"
											options={[
												{ label: 'dr', value: 'dr' },
												{ label: 'cr', value: 'cr' }
											]}
											bind:value={$formData.entries[i].entryType}
											onSelect={(o) => {
												$formData.entries[i].entryType = o.value as 'dr';
												setEntryType();
											}}
											onClear={() => {
												$formData.entries[i].entryType = undefined as unknown as 'dr';
												setEntryType();
											}}
										/>
									</Control>
								</ElementField>
							</div>
							<div class="element-field">
								<ElementField {form} name="entries[{i}].accountId">
									<Control let:attrs>
										<Label class="sr-only">Entry Account {i + 1}</Label>
										<SelectBox
											class={$errors.entries?.[i]?.accountId ? 'error' : ''}
											placeholder="Entry Account"
											{...attrs}
											options={data.accounts.map((a) => ({ label: a.name, value: a.id }))}
											bind:value={$formData.entries[i].accountId}
											onSelect={(o) => {
												$formData.entries[i].accountId = o.value;
											}}
											onClear={() => {
												$formData.entries[i].accountId = undefined as unknown as number;
											}}
										/>
									</Control>
								</ElementField>
							</div>
							<div class="element-field">
								<ElementField {form} name="entries[{i}].amount">
									<Control let:attrs>
										<Label class="sr-only">Entry Amount {i + 1}</Label>
										<input
											type="number"
											{...attrs}
											bind:value={$formData.entries[i].amount}
											placeholder="Entry Amount"
										/>
									</Control>
								</ElementField>
							</div>
							<TooltipButton
								tooltipContent="Delete Entry"
								onclick={() => {
									removeRow(i);
								}}
							>
								<Trash size={14} />
							</TooltipButton>
						</div>
					{/each}
				</div>
			</Fieldset>
			<div class="footer">
				<button class="btn" type="button" onclick={addRow}>
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
	.dynamic-form {
		width: 60vw;

		.row {
			grid-template-columns: 40px 1.25fr 3fr 2fr 40px;
		}
	}
</style>

<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SelectBox from '$lib/components/SelectBox.svelte';
	import { newAccountSchema } from '$lib/zod/accounting.js';
	import { Control, Field, Label, FieldErrors } from 'formsnap';
	import { CircleCheckBig } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data } = $props();
	const form = superForm(data.form, {
		dataType: 'json',
		validators: zodClient(newAccountSchema),
		validationMethod: 'oninput',
		onSubmit: () => {
			loading = true;
		},

		onUpdated: ({ form }) => {
			loading = false;
			alert(form.message.type + ' : ' + form.message.text);
		}
	});
	const { form: formData, enhance } = form;

	let loading = $state(false);
	let selectedRootAccount = $state();
	const rootAccountoptions = $derived(
		data.rootAccounts.map((r) => ({ label: r.name, value: r.id }))
	);
	const accountTypeOptions = $derived.by(() => {
		return data.groupAccounts
			.filter((g) => g.rootId === selectedRootAccount)
			.map((g) => ({ label: g.name, value: g.id }));
	});

	function generateNewAccountNumber() {
		if (!$formData.groupId) return NaN;
		const accounts = data.accounts.filter((a) => a.groupId === $formData.groupId);
		if (accounts.length === 0) {
			return $formData.groupId + 1;
		}
		const highestNumber = Math.max(...accounts.map((a) => a.number));
		const nextNumber = highestNumber + 1;
		const nextGroupBase = Math.floor($formData.groupId / 1000 + 1) * 1000;
		if (nextNumber >= nextGroupBase) {
			alert(
				'Max limit has been reached for group account ' +
					data.groupAccounts.find((g) => g.id === $formData.groupId)?.name
			);
			return NaN;
		}
		return nextNumber;
	}
</script>

{#if loading}
	<Loader />
{:else}
	<div class="container">
		<PageHeader
			title="Add New Account"
			description="Add new account by filling up
    the information in the form below and press on submit"
		>
			<BackButton />
		</PageHeader>

		<form method="post" class="simple-form" use:enhance>
			<div class="field">
				<Field {form} name="name">
					<Control let:attrs>
						<Label>Account Name</Label>
						<input type="text" {...attrs} bind:value={$formData.name} />
					</Control>
					<FieldErrors />
				</Field>
			</div>
			<div class="field">
				<label for="root">Root Account</label>
				<SelectBox
					options={rootAccountoptions}
					onSelect={(o) => {
						selectedRootAccount = o.value;
					}}
					onClear={() => {
						selectedRootAccount = undefined;
						$formData.groupId = undefined as unknown as number;
					}}
				/>
			</div>
			<div class="field">
				<Field {form} name="groupId">
					<Control>
						<Label>Account Type</Label>
						<SelectBox
							options={accountTypeOptions}
							name="groupId"
							emptyMessage="Please select a root account first"
							onSelect={(o) => {
								$formData.groupId = o.value;
								$formData.number = generateNewAccountNumber();
							}}
							onClear={() => {
								$formData.groupId = undefined as unknown as number;
							}}
						/>
					</Control>
					<FieldErrors />
				</Field>
			</div>
			<div class="field">
				<Field {form} name="number">
					<Control let:attrs>
						<Label>Account Number</Label>
						<input type="number" {...attrs} bind:value={$formData.number} />
					</Control>
					<FieldErrors />
				</Field>
			</div>
			<div class="footer">
				<button class="btn">
					<CircleCheckBig />
					Submit
				</button>
			</div>
		</form>
	</div>
{/if}

<style>
	form {
		height: 100%;
		margin: 1rem;
	}
</style>

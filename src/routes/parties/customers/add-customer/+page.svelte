<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { Control, Field, FieldErrors, Label } from 'formsnap';
	import { CircleCheckBig, PlusCircle } from 'lucide-svelte';
	import { newPartySchema } from '$lib/zod/parties.js';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import BackButton from '$lib/components/BackButton.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import SelectBox from '$lib/components/SelectBox.svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();
	let form = superForm(data.form, {
		dataType: 'json',
		validators: zod(newPartySchema),
		validationMethod: 'oninput',
		onSubmit: () => {
			loading = true;
		},
		onUpdated: ({ form }) => {
			loading = false;
			if (form.message) {
				alert(form.message.type + ' : ' + form.message.text);
			}
		}
	});

	let { form: formData, enhance } = form;

	let loading = $state(false);
</script>

{#if loading}
	<Loader />
{:else}
	<div class="container">
		<PageHeader
			title="Add New Customer"
			description="Fill out the information
    about the customer and click on submit"
		>
			<button class="btn" onclick={() => goto('/accounting/chart-of-accounts/add-account')}>
				<PlusCircle size={16} />
				Add New Account
			</button>
			<BackButton />
		</PageHeader>
		<div class="scrollarea">
			<form method="post" use:enhance class="simple-form">
				<div class="information">
					<div class="field">
						<Field {form} name="name">
							<Control let:attrs>
								<Label>Customer Name</Label>
								<input type="text" {...attrs} bind:value={$formData.name} />
							</Control>
							<FieldErrors />
						</Field>
					</div>
					<div class="field">
						<Field {form} name="accountId">
							<Control let:attrs>
								<Label>Customer Account</Label>
								<SelectBox
									emptyMessage={'No customer account found create a new account before proceeding'}
									options={data.accounts.map((a) => ({ label: a.name, value: a.id }))}
									{...attrs}
									bind:value={$formData.accountId}
								/>
							</Control>
						</Field>
					</div>
					<div class="field">
						<Field {form} name="phone">
							<Control let:attrs>
								<Label>Contact Number</Label>
								<input type="text" {...attrs} bind:value={$formData.phone} />
							</Control>
							<FieldErrors />
						</Field>
					</div>
					<div class="field">
						<Field {form} name="email">
							<Control let:attrs>
								<Label>Customer Email</Label>
								<input type="text" {...attrs} bind:value={$formData.email} />
							</Control>
							<FieldErrors />
						</Field>
					</div>
				</div>
				<div class="taxation">
					<div class="field">
						<Field {form} name="taxationId">
							<Control let:attrs>
								<Label>Customer Taxation ID</Label>
								<input type="text" {...attrs} bind:value={$formData.taxationId} />
							</Control>
							<FieldErrors />
						</Field>
					</div>
				</div>
				<div class="address">
					<div class="field">
						<Field {form} name="address">
							<Control let:attrs>
								<Label>Customer Address</Label>
								<textarea {...attrs} bind:value={$formData.address}></textarea>
							</Control>
							<FieldErrors />
						</Field>
					</div>
					<div class="field">
						<Field {form} name="city">
							<Control let:attrs>
								<Label>City</Label>
								<input type="text" {...attrs} bind:value={$formData.city} />
							</Control>
							<FieldErrors />
						</Field>
					</div>
					<div class="field">
						<Field {form} name="district">
							<Control let:attrs>
								<Label>District</Label>
								<input type="text" {...attrs} bind:value={$formData.district} />
							</Control>
							<FieldErrors />
						</Field>
					</div>
					<div class="field">
						<Field {form} name="state">
							<Control let:attrs>
								<Label>State</Label>
								<input type="text" {...attrs} bind:value={$formData.state} />
							</Control>
							<FieldErrors />
						</Field>
					</div>
					<div class="field">
						<Field {form} name="postalCode">
							<Control let:attrs>
								<Label>Postal Code</Label>
								<input type="text" {...attrs} bind:value={$formData.postalCode} />
							</Control>
							<FieldErrors />
						</Field>
					</div>
				</div>
				<div class="footer">
					<button type="submit" class="btn">
						<CircleCheckBig />
						Submit
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	form {
		margin: 1rem 1rem;

		.information,
		.taxation,
		.address {
			width: 100%;
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 0.25rem;
		}

		.information {
			.field:nth-of-type(1),
			.field:nth-of-type(2) {
				grid-column: span 2;
			}
		}
		.address {
			.field:nth-of-type(1) {
				grid-column: span 2;
			}
		}
	}
</style>

<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SelectBox from '$lib/components/SelectBox.svelte';
	import { newCompanySchema } from '$lib/zod/company';
	import { Control, Field, FieldErrors, Label } from 'formsnap';
	import { CircleCheckBig } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

	let { data } = $props();
	let form = superForm(data.form, {
		dataType: 'json',
		validators: zod(newCompanySchema),
		validationMethod: 'oninput',
		onUpdated: ({ form }) => {
			alert(form.message.type + ' : ' + form.message.text);
		},
		invalidateAll: 'force'
	});
	let { form: formData, enhance } = form;
</script>

<div class="container">
	<PageHeader
		title="Edit Company"
		description="Edit the details of your current
    company"
	>
		<BackButton />
	</PageHeader>
	<div class="scrollarea">
		<form method="post" use:enhance class="simple-form">
			<div class="information">
				<div class="field">
					<Field {form} name="name">
						<Control let:attrs>
							<Label>Company Name</Label>
							<input type="text" {...attrs} bind:value={$formData.name} />
						</Control>
						<FieldErrors />
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
							<Label>Company Email</Label>
							<input type="text" {...attrs} bind:value={$formData.email} />
						</Control>
						<FieldErrors />
					</Field>
				</div>
				<div class="field">
					<Field {form} name="financilaYearStart">
						<Control let:attrs>
							<Label>Start of Financial Year</Label>
							<input type="date" {...attrs} bind:value={$formData.financilaYearStart} />
						</Control>
						<FieldErrors />
					</Field>
				</div>
			</div>
			<div class="taxation">
				<div class="field">
					<Field {form} name="taxationtype">
						<Control let:attrs>
							<Label>Taxation Type</Label>
							<SelectBox
								options={['GST', 'SALES', 'VAT'].map((t) => ({ label: t, value: t }))}
								{attrs}
								bind:value={$formData.taxationtype}
								onSelect={(o) => {
									$formData.taxationtype = o.value as 'GST';
								}}
								onClear={() => {
									$formData.taxationtype = undefined as unknown as 'GST';
								}}
							/>
						</Control>
						<FieldErrors />
					</Field>
				</div>
				<div class="field">
					<Field {form} name="taxationId">
						<Control let:attrs>
							<Label>Company Taxation ID</Label>
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
							<Label>Company Address</Label>
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

<style>
	form {
		padding: 1rem 1rem;
		.information,
		.taxation,
		.address {
			width: 100%;
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 0.25rem;
		}

		.information,
		.address {
			.field:nth-of-type(1) {
				grid-column: span 2;
			}
		}
	}
</style>

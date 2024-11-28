<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { newTaxSchema } from '$lib/zod/accounting.js';
	import { Control, Field, Label, FieldErrors } from 'formsnap';
	import { CircleCheckBig } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data } = $props();
	const form = superForm(data.form, {
		dataType: 'json',
		validators: zodClient(newTaxSchema),
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
</script>

{#if loading}
	<Loader />
{:else}
	<div class="container">
		<PageHeader
			title="Add New Tax"
			description="Add new tax by filling up
    the information in the form below and press on submit"
		>
			<BackButton />
		</PageHeader>

		<form method="post" class="simple-form" use:enhance>
			<div class="field">
				<Field {form} name="name">
					<Control let:attrs>
						<Label>Tax Name</Label>
						<input type="text" {...attrs} bind:value={$formData.name} />
					</Control>
					<FieldErrors />
				</Field>
			</div>
			<div class="field">
				<Field {form} name="rate">
					<Control let:attrs>
						<Label>Tax Rate</Label>
						<input type="number" {...attrs} bind:value={$formData.rate} />
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

<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { newUOMSchema } from '$lib/zod/inventory.js';
	import { Field, Control, Label, FieldErrors } from 'formsnap';
	import { CircleCheckBig } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data } = $props();

	let loading = $state(false);

	const form = superForm(data.form, {
		dataType: 'json',
		validators: zodClient(newUOMSchema),
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

<div class="container">
	<PageHeader
		title="Add New U.O.M."
		description="Fill out the information and
    click on submit to add new U.O.M."
	>
		<BackButton />
	</PageHeader>

	<form method="POST" class="simple-form" use:enhance>
		<div class="field">
			<Field {form} name="name">
				<Control let:attrs>
					<Label>Unit Name</Label>
					<input type="text" {...attrs} bind:value={$formData.name} />
				</Control>
				<FieldErrors />
			</Field>
		</div>
		<div class="field">
			<Field {form} name="symbol">
				<Control let:attrs>
					<Label>Unit Symbol</Label>
					<input type="text" {...attrs} bind:value={$formData.symbol} />
				</Control>
				<FieldErrors />
			</Field>
		</div>
		<div class="footer">
			<button class="btn" type="submit">
				<CircleCheckBig />Submit
			</button>
		</div>
	</form>
</div>

<style>
	form {
		margin: 1rem;
	}
</style>

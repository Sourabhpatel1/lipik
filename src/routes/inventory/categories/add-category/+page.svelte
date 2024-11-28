<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { newCatrgorySchema } from '$lib/zod/inventory.js';
	import { Control, Field, Label } from 'formsnap';
	import { CircleCheckBig } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data } = $props();

	let loading = $state(false);

	const form = superForm(data.form, {
		dataType: 'json',
		validators: zodClient(newCatrgorySchema),
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

	const { form: formData, enhance } = form;
</script>

<div class="conatiner">
	<PageHeader
		title="Add New Category"
		description="Fill out the information and
    click on submit to add new product category"
	>
		<BackButton />
	</PageHeader>
	<form method="POST" class="simple-form" use:enhance>
		<div class="field">
			<Field {form} name="name">
				<Control let:attrs>
					<Label>Category Name</Label>
					<input type="text" {...attrs} bind:value={$formData.name} />
				</Control>
			</Field>
		</div>
		<div class="field">
			<Field {form} name="description">
				<Control let:attrs>
					<Label>Category Description</Label>
					<textarea {...attrs} bind:value={$formData.description}></textarea>
				</Control>
			</Field>
		</div>
		<div class="footer">
			<button class="btn">
				<CircleCheckBig /> Submit
			</button>
		</div>
	</form>
</div>

<style>
	form {
		margin: 1rem;
	}
</style>

<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { newTermsSchema } from '$lib/zod/common';
	import { Control, Field, FieldErrors, Label } from 'formsnap';
	import { CheckCircle } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data } = $props();
	let loading = $state(false);

	const form = superForm(data.form, {
		validators: zodClient(newTermsSchema),
		validationMethod: 'onblur',
		dataType: 'json',
		onSubmit: () => {
			loading = true;
		},
		onUpdated: ({ form }) => {
			loading = false;
			if (form.message) alert(form.message.type + ' : ' + form.message.text);
		}
	});
	const { form: formData, enhance } = form;
</script>

<div class="container">
	<PageHeader
		title="Add New Purchase Term"
		description="Fill out the form below and click on submit to add new purchase term"
	>
		<BackButton />
	</PageHeader>
	<form method="POST" class="simple-form" use:enhance>
		<div class="field">
			<Field {form} name="title">
				<Control let:attrs>
					<Label>Title</Label>
					<input type="text" bind:value={$formData.title} {...attrs} />
				</Control>
				<FieldErrors />
			</Field>
		</div>
		<div class="field">
			<Field {form} name="condition">
				<Control let:attrs>
					<Label>Terms and Conditions</Label>
					<textarea bind:value={$formData.condition} {...attrs}></textarea>
				</Control>
				<FieldErrors />
			</Field>
		</div>
		<div class="footer">
			<button class="btn">
				<CheckCircle />
				Submit
			</button>
		</div>
	</form>
</div>

<style>
	textarea {
		padding: 0.25rem;
		height: 450px;
	}
	.footer {
		margin: 1rem 0;
	}
</style>

<script lang="ts">
	import { enhance } from '$app/forms';
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SelectBox from '$lib/components/SelectBox.svelte';
	import { tick } from 'svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
	let formElement: HTMLFormElement;
	let selectedId: number | undefined = $state();
</script>

<div class="container">
	<PageHeader
		title="Select Company"
		description="Select a company to manage and record transactions"
	>
		<BackButton />
	</PageHeader>
	<div class="scrollarea">
		<form class="simple-form">
			<div class="field">
				<label for="company">Select a Company</label>
				<SelectBox
					name="id"
					id="id"
					options={data.companies.map((c) => ({ label: c.name, value: c.id }))}
					onSelect={async (o) => {
						selectedId = o.value;
						await tick();
						formElement.requestSubmit();
					}}
				/>
			</div>
		</form>
		<form
			use:enhance
			method="post"
			class="simple-form"
			bind:this={formElement}
			style="opacity: 0; pointer-events: none; position: absolute; left: -100rem;"
		>
			<input type="text" name="id" bind:value={selectedId} />
		</form>
	</div>
</div>

<style>
	form {
		padding: 1rem;
	}
</style>

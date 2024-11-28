<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageLinks from '$lib/components/PageLinks.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="container">
	<PageHeader title="Setting" description="Configure settings of your company">
		<BackButton />
	</PageHeader>

	<div class="company-info">
		<div class="info">
			<h3>Company Information</h3>
			<hr />
			<div class="field">
				<span>Name </span>
				<span>:</span>
				<span>{data.company?.name}</span>
			</div>
			<div class="field">
				<span>Contact </span>
				<span>:</span>
				<span>{data.company?.phone}</span>
			</div>
			<div class="field">
				<span>Email </span>
				<span>:</span>
				<span>{data.company?.email}</span>
			</div>
		</div>
		<div class="taxation">
			<h3>Taxation Details</h3>
			<hr />
			<div class="field">
				<span>Taxation Type </span>
				<span>:</span>
				<span>{data.company?.taxationType}</span>
			</div>
			<div class="field">
				<span>Taxation ID </span>
				<span>:</span>
				<span>{data.company?.taxationId}</span>
			</div>
		</div>
		<div class="address">
			<h3>Company Address</h3>
			<hr />
			<div class="field">
				<span>Address </span>
				<span>:</span>
				<span>{data.company?.address}</span>
			</div>
			<div class="field">
				<span>City </span>
				<span>:</span>
				<span>{data.company?.city}</span>
			</div>
			<div class="field">
				<span>State</span>
				<span>:</span>
				<span>{data.company?.state}</span>
			</div>
			<div class="field">
				<span>Postal Code </span>
				<span>:</span>
				<span>{data.company?.postalCode}</span>
			</div>
		</div>
	</div>

	<div class="links">
		<h2>Quick Links</h2>
		<div class="app-links">
			<PageLinks href="/settings/create-company">Create New Company</PageLinks>
			<PageLinks href="/settings/select-company">Select Active Company</PageLinks>
			<PageLinks href="/settings/edit-company">Edit Active Company</PageLinks>
			<PageLinks href="/settings/tax-settings">Tax Settings</PageLinks>
			<PageLinks href="/settings/general">General Settings</PageLinks>
		</div>
	</div>
</div>

<style>
	.company-info {
		width: fit-content;
		padding: 1rem;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;

		.info,
		.taxation,
		.address {
			padding: 1rem;
			display: flex;
			flex-direction: column;
			gap: 1rem;
			font-size: var(--fs-lg);
			border-radius: var(--radius-md);
			box-shadow: var(--shadow-sm);
			& .field {
				display: grid;
				grid-template-columns: 1fr 10px 2fr;
			}
		}
	}
	.links {
		width: fit-content;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;

		& h2 {
			padding: 0.5rem 0;
			font-weight: var(--fw-dark);
		}
	}
</style>

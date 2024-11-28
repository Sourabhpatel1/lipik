<script lang="ts">
	import { goto } from '$app/navigation';
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import TooltipButton from '$lib/components/TooltipButton.svelte';
	import { PenTool, PlusCircle } from 'lucide-svelte';

	let { data } = $props();

	let vendorName: string | undefined = $state();

	const filteredVendors = $derived.by(() => {
		let vendors = data.vendors;
		if (vendorName) {
			vendors = vendors.filter((c) =>
				c.name.toLowerCase().includes(vendorName?.toLowerCase() ?? '')
			);
		}
		return vendors;
	});
</script>

<div class="container">
	<PageHeader title="vendors" description="View and manage vendors">
		<button
			class="btn"
			onclick={() => {
				goto('/parties/vendors/add-vendor');
			}}
		>
			<PlusCircle size={16} />
			Add New Vendor
		</button>
		<BackButton />
	</PageHeader>
	<fieldset class="filters">
		<legend>Filter Vendors</legend>
		<input type="text" placeholder="Vendor Name" bind:value={vendorName} />
	</fieldset>
	<div class="row-container">
		<div class="header">
			<span>#</span>
			<span>Vendor Name</span>
			<span>Taxation ID</span>
			<span>Address</span>
			<span>Account Balance</span>
			<span>Actions</span>
		</div>
		<div class="rows">
			{#each filteredVendors as vendor, i (i)}
				<div class="row">
					<span>{i + 1}</span>
					<span>{vendor.name}</span>
					<span>{vendor.taxationId}</span>
					<span>{vendor.address}</span>
					<span>{vendor.account.currentBalance}</span>
					<div class="actions">
						<TooltipButton
							tooltipContent="Edit vendor details"
							onclick={() => {
								goto(`/parties/vendors/view/${vendor.id}`);
							}}
						>
							<PenTool size={16} />
						</TooltipButton>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	fieldset {
		width: fit-content;
	}
	.row-container {
		width: 65vw;

		& .header,
		& .row {
			grid-template-columns: 20px 1fr 1fr 2fr 1fr 50px;

			& span:last-child {
				text-align: center;
			}
		}
	}
</style>

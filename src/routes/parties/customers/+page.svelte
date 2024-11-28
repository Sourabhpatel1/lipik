<script lang="ts">
	import { goto } from '$app/navigation';
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import TooltipButton from '$lib/components/TooltipButton.svelte';
	import { PenTool, PlusCircle } from 'lucide-svelte';

	let { data } = $props();

	let customerName: string | undefined = $state();

	const filteredCustomers = $derived.by(() => {
		let customers = data.customers;
		if (customerName) {
			customers = customers.filter((c) =>
				c.name.toLowerCase().includes(customerName?.toLowerCase() ?? '')
			);
		}
		return customers;
	});
</script>

<div class="container">
	<PageHeader title="Customers" description="View and manage customers">
		<button
			class="btn"
			onclick={() => {
				goto('/parties/customers/add-customer');
			}}
		>
			<PlusCircle size={16} />
			Add New Customer
		</button>
		<BackButton />
	</PageHeader>
	<fieldset class="filters">
		<legend>Filter Customers</legend>
		<input type="text" placeholder="Customer Name" bind:value={customerName} />
	</fieldset>
	<div class="row-container">
		<div class="header">
			<span>#</span>
			<span>Customer Name</span>
			<span>Taxation ID</span>
			<span>Address</span>
			<span>Account Balance</span>
			<span>Actions</span>
		</div>
		<div class="rows">
			{#each filteredCustomers as customer, i (i)}
				<div class="row">
					<span>{i + 1}</span>
					<span>{customer.name}</span>
					<span>{customer.taxationId}</span>
					<span>{customer.address}</span>
					<span>{customer.account.currentBalance}</span>
					<div class="actions">
						<TooltipButton
							tooltipContent="Edit customer details"
							onclick={() => {
								goto(`/parties/customers/view/${customer.id}`);
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

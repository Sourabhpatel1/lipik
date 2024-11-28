<script lang="ts">
	import { goto } from '$app/navigation';
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SelectBox from '$lib/components/SelectBox.svelte';
	import TooltipButton from '$lib/components/TooltipButton.svelte';
	import { PlusCircle, BookOpenText } from 'lucide-svelte';

	let { data } = $props();

	let startDate: string = $state(undefined as unknown as string);
	let endDate: string = $state(undefined as unknown as string);
	let voucherType = $state(undefined as unknown as string);
	let voucherNumber = $state(undefined as unknown as number);

	let vouchers = $derived.by(() => {
		let filteredVouchers = data.vouchers;
		if (startDate) {
			let start = new Date(startDate);
			start.setDate(start.getDate() - 1);
			filteredVouchers = filteredVouchers.filter((v) => new Date(v.voucherDate) >= start);
		}
		if (endDate) {
			let end = new Date(endDate);
			end.setDate(end.getDate());
			filteredVouchers = filteredVouchers.filter((v) => new Date(v.voucherDate) <= end);
		}
		if (voucherType) {
			filteredVouchers = filteredVouchers.filter((v) => v.voucherType === voucherType);
		}
		if (voucherNumber) {
			filteredVouchers = filteredVouchers.filter((v) => v.voucherNumber === voucherNumber);
		}
		return filteredVouchers.sort((a, b) => a.voucherDate.localeCompare(b.voucherDate));
	});
</script>

<div class="container">
	<PageHeader
		title="Accounting Vouchers"
		description="View, add and edit
    accounting vouchers"
	>
		<button
			class="btn"
			onclick={() => {
				goto('/accounting/vouchers/add-voucher');
			}}
		>
			<PlusCircle size={16} />
			New Voucher
		</button>
		<BackButton />
	</PageHeader>

	<fieldset class="filters">
		<legend>Filter Vouchers</legend>
		<div class="filter">
			<label for="start">Date From</label>
			<input type="date" id="start" bind:value={startDate} />
		</div>
		<div class="filter">
			<label for="end">Date To</label>
			<input type="date" id="end" bind:value={endDate} />
		</div>
		<div class="filter">
			<label for="type">Voucher Type</label>
			<SelectBox
				placeholder="Voucher Type"
				options={[...new Set(data.vouchers.map((v) => v.voucherType))].map((v) => ({
					label: v,
					value: v
				}))}
				onSelect={(o) => {
					voucherType = o.value;
				}}
				onClear={() => {
					voucherType = undefined as unknown as string;
				}}
			/>
		</div>
		<div class="filter">
			<label for="number">Vocuher Number</label>
			<input type="number" placeholder="Voucher Number" id="number" bind:value={voucherNumber} />
		</div>
	</fieldset>

	<div class="row-container">
		<div class="header">
			<span>#</span>
			<span>Voucher Date</span>
			<span>V. Type</span>
			<span style="text-align: center;">V. No.</span>
			<span>Debit Accounts</span>
			<span>Credit Accounts</span>
			<span style="text-align: right;">Voucher Amount</span>
			<span>Actions</span>
		</div>
		<div class="rows">
			{#each vouchers as voucher, i (i)}
				<div class="row">
					<span>{i + 1}</span>
					<span>{voucher.voucherDate.slice(0, 10).split('-').reverse().join('-')}</span>
					<span>{voucher.voucherType}</span>
					<span style="text-align: center;">{voucher.voucherNumber}</span>
					<span>{voucher.drEntries.map((e) => e.account.name).join(', ')}</span>
					<span>{voucher.crEntries.map((e) => e.account.name).join(', ')}</span>
					<span style="text-align: right;"
						>{voucher.drEntries.reduce((a, b) => a + b.amount, 0).toFixed(3)}
					</span>
					<div class="actions">
						<TooltipButton
							tooltipContent="View Voucher"
							onclick={() => {
								goto(`/accounting/vouchers/view-voucher/${voucher.id}`);
							}}
						>
							<BookOpenText size={16} />
						</TooltipButton>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	fieldset,
	.row-container {
		min-width: 65vw;
		width: 75vw;
		max-width: 100%;
	}
	.row-container {
		.header,
		.row {
			grid-template-columns: 20px 1fr 85px 80px 2fr 2fr 1fr 1fr;
		}
	}
</style>

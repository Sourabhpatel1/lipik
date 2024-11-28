<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { formatDate, getCurrentFinancialYear } from '$lib/utils/general';
	import { Printer, Link } from 'lucide-svelte';

	let { data } = $props();

	let { start, end } = $state(getCurrentFinancialYear());

	let ledger = $derived.by(() => {
		return data.ledger
			.filter((l) => {
				let entryDate = new Date(l.voucherDate);
				let startDate = new Date(start);
				startDate.setDate(startDate.getDate() - 1);
				let endDate = new Date(end);
				return startDate <= entryDate && endDate >= entryDate;
			})
			.sort((a, b) => a.voucherDate.localeCompare(b.voucherDate));
	});

	const ledgerDebit = $derived(
		ledger.filter((l) => l.entryType === 'dr').reduce((a, b) => a + b.amount, 0)
	);

	const ledgerCredit = $derived(
		ledger.filter((l) => l.entryType === 'cr').reduce((a, b) => a + b.amount, 0)
	);

	const openingBalance = $derived(
		data.ledger
			.filter((l) => {
				let voucherDate = new Date(l.voucherDate);
				let startDate = new Date(start);
				startDate.setDate(startDate.getDate() - 1);
				return voucherDate <= startDate;
			})
			.reduce((a, b) => {
				if (b.entryType === 'dr') {
					a += b.amount;
				} else {
					a -= b.amount;
				}
				return a;
			}, 0)
	);

	const closingBalance = $derived(openingBalance + ledgerDebit - ledgerCredit);

	const columnTotal = $derived.by(() => {
		if (openingBalance >= 0 && closingBalance >= 0) {
			return openingBalance + ledgerDebit;
		}
		if (openingBalance < 0 && closingBalance < 0) {
			return closingBalance + ledgerDebit;
		}
		if (openingBalance < 0 && closingBalance >= 0) {
			return openingBalance + closingBalance + ledgerCredit;
		}
		if (openingBalance >= 0 && closingBalance <= 0) {
			return closingBalance + openingBalance + ledgerDebit;
		}
	});
</script>

<div class="container">
	<PageHeader
		title={`Ledger of ${data.account.name}`}
		description={`View and Print ledger account of ${data.account.name}`}
	>
		<button
			class="btn"
			onclick={() => {
				window.print();
			}}
		>
			<Printer size={16} />
			Print Ledger
		</button>
		<BackButton />
	</PageHeader>
	<fieldset class="filters">
		<legend>Ledger Period</legend>
		<div class="filter">
			<label for="start">Date from</label>
			<input type="date" bind:value={start} />
		</div>
		<div class="filter">
			<label for="end">Date To</label>
			<input type="date" bind:value={end} />
		</div>
	</fieldset>
	<div class="ledger" id="printable">
		<div class="ledger-header">
			<h2>{data.company.name}</h2>
			<span>
				Ledger of {data.account.name} from {formatDate(start)} to
				{formatDate(end)}
			</span>
		</div>
		<div class="entries">
			<div class="entry-header">
				<span>Voucher Date</span>
				<span>Account</span>
				<span>Voucher</span>
				<span class="money">Amount (Dr.)</span>
				<span class="money">Amount (Cr.)</span>
			</div>
			<div class="entry-rows">
				<div class="entry-row">
					<span></span>
					<span>Balance (B / D)</span>
					<span></span>
					<span class="money">
						{#if openingBalance >= 0}
							{openingBalance.toFixed(3)}
						{/if}
					</span>
					<span class="money">
						{#if openingBalance < 0}
							{Math.abs(openingBalance).toFixed(3)}
						{/if}
					</span>
				</div>
				{#each ledger as entry}
					<div class="entry-row">
						<span>{formatDate(entry.voucherDate.slice(0, 10))}</span>
						<span>{entry.account}</span>
						<a href="/accounting/vouchers/view-voucher/{entry.voucherId}">
							<span>
								{entry.voucherType} - {entry.voucherNumber}
							</span>
							<Link size={12} />
						</a>
						<span class="money">
							{#if entry.entryType === 'dr'}
								{entry.amount.toFixed(3)}
							{/if}
						</span>
						<span class="money">
							{#if entry.entryType === 'cr'}
								{entry.amount.toFixed(3)}
							{/if}
						</span>
					</div>
				{/each}
				<div class="entry-row closing">
					<span></span>
					<span>Balance (C / F)</span>
					<span></span>
					<span class="money">
						{#if closingBalance < 0}
							{Math.abs(closingBalance).toFixed(3)}
						{/if}
					</span>
					<span class="money">
						{#if closingBalance > 0}
							{closingBalance.toFixed(3)}
						{/if}
					</span>
				</div>
				<div class="entry-row">
					<span></span>
					<span>Total</span>
					<span></span>
					<span class="money">
						{Math.abs(columnTotal ?? 0).toFixed(3)}
					</span>
					<span class="money">
						{Math.abs(columnTotal ?? 0).toFixed(3)}
					</span>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.container {
		gap: 0.5rem;
		padding-block-end: 0.5rem;
	}
	.filters {
		min-width: 50%;
		width: 850px;
		max-width: 100%;
		gap: 1rem;
	}
	.ledger {
		max-height: 100%;
		min-width: 50%;
		width: 850px;
		max-width: 100%;
		padding: 0.5rem;
		display: flex;
		flex-direction: column;
		border: 1px solid currentColor;
		border-radius: var(--radius-md);
		overflow: hidden;

		.ledger-header {
			padding: 0.5rem;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 0.5rem;
			border-block-end: 1px solid currentColor;
		}

		.entries {
			height: 100%;
			display: flex;
			flex-direction: column;
			overflow: hidden;
		}

		.entry-header,
		.entry-row {
			display: grid;
			grid-template-columns: repeat(5, 1fr);
		}
		.entry-header {
			font-weight: var(--fw-dark);
			padding: 0.25rem;
			border-block-end: 1px solid currentColor;

			& span.money {
				text-align: right;
			}
		}
		.entry-rows {
			max-height: 100%;
			padding: 0.5rem 0 0 0;
			display: flex;
			flex-direction: column;
			overflow-y: scroll;
			gap: 0.5rem;

			& .entry-row {
				padding: 0.125rem 0.5rem;
				border-radius: var(--radius-md);
				transition: all 0.3s ease;
				cursor: pointer;

				a {
					color: currentColor;
					display: flex;
					align-items: center;

					span {
						min-width: 80px;
					}
				}

				&:hover {
					box-shadow: var(--shadow-sm);
				}

				& span.money {
					text-align: right;
				}
			}

			& .entry-row:last-child {
				padding-top: 0.5rem;
				border-block-start: 1px solid currentColor;
				border-radius: 0;
			}

			& .entry-row:first-child,
			& .entry-row.closing {
				background: var(--color-muted, lightgray);
			}
		}
	}
</style>

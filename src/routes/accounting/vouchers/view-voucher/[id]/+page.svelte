<script lang="ts">
	import { page } from '$app/stores';
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { Trash, Printer } from 'lucide-svelte';

	let { data } = $props();

	const [voucher] = $derived.by(() =>
		data.vouchers.filter((v) => v.id === parseInt($page.params.id))
	);

	const voucherEntries = $derived.by(() => {
		let entries: {
			account: string;
			entryType: string;
			amount: number;
		}[] = [];
		voucher.drEntries.forEach((e) => {
			entries.push({
				account: e.account.name,
				entryType: 'dr',
				amount: e.amount
			});
		});
		voucher.crEntries.forEach((e) => {
			entries.push({
				account: e.account.name,
				entryType: 'cr',
				amount: e.amount
			});
		});
		return entries;
	});
</script>

<div class="container">
	<PageHeader
		title="View Voucher"
		description="{voucher.voucherType}-{voucher.voucherNumber} dated {voucher.voucherDate
			.slice(0, 10)
			.split('-')
			.reverse()
			.join('-')}"
	>
		<button class="btn">
			<Trash size={16} />
			Cancel Voucher
		</button>
		<button
			class="btn"
			onclick={() => {
				window.print();
			}}
		>
			<Printer size={16} />
			Print Voucher
		</button>
		<BackButton />
	</PageHeader>

	<div class="voucher-container" id="printable">
		<div class="voucher-header">
			<h2>{data.companyName}</h2>
			<span>
				In Books of {data.companyName}, {voucher.voucherType}-#{voucher.voucherNumber} dated
				{voucher.voucherDate.slice(0, 10).split('-').reverse().join('-')}
			</span>
		</div>

		<div class="entries">
			<div class="entry-header">
				<span>#</span>
				<span>Account Name</span>
				<span style="text-align: right;">Amount (Dr)</span>
				<span style="text-align: right;">Amount (Cr)</span>
			</div>
			<div class="rows">
				{#each voucherEntries as entry, i (i)}
					<div class="row">
						<span>{i + 1}</span>
						<span>{entry.account}</span>
						<span style="text-align: right;">
							{#if entry.entryType === 'dr'}
								{entry.amount.toFixed(3)}
							{/if}
						</span>
						<span style="text-align: right;">
							{#if entry.entryType === 'cr'}
								{entry.amount.toFixed(3)}
							{/if}
						</span>
					</div>
				{/each}
				<div class="row">
					<span></span>
					<span>Total</span>
					<span style="text-align: right;">
						{voucher.drEntries.reduce((a, b) => a + b.amount, 0).toFixed(3)}
					</span>
					<span style="text-align: right;">
						{voucher.drEntries.reduce((a, b) => a + b.amount, 0).toFixed(3)}
					</span>
				</div>
			</div>
		</div>
		<div class="footer">
			<span>Signature (Authorized Signatory)</span>
		</div>
	</div>
</div>

<style>
	.voucher-container {
		width: 50vw;
		max-height: 100%;
		margin: 1rem;
		padding: 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		border: 1px solid currentColor;
		border-radius: var(--radius-md);
		overflow: hidden;

		.voucher-header {
			padding: 0.5rem 0;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 0.5rem;
			border-block-end: 1px solid currentColor;
		}

		.entries {
			max-height: 100%;
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			overflow: hidden;

			.entry-header,
			.row {
				padding: 0.5rem;
				display: grid;
				grid-template-columns: 100px repeat(3, 1fr);
			}

			.entry-header {
				border-block-end: 1px solid currentColor;
				padding-block-end: 0.5rem;
				font-weight: var(--fw-dark);
			}
			.rows {
				max-height: 100%;
				display: flex;
				flex-direction: column;
				gap: 0.5rem;
				overflow-y: auto;

				.row {
					border-radius: var(--radius-md);
					transition: all 0.3s ease;
					&:hover {
						cursor: pointer;
						box-shadow: var(--shadow-sm);
					}
					&:last-child {
						border-radius: 0;
						border-block: 1px solid currentColor;
						font-weight: var(--fw-dark);
					}
				}
			}
		}
		.footer {
			height: 120px;
			padding: 1rem;
			display: flex;
			font-weight: var(--fw-bold);
		}
	}
</style>

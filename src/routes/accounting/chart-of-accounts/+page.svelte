<script lang="ts">
	import { goto } from '$app/navigation';
	import BackButton from '$lib/components/BackButton.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SelectBox from '$lib/components/SelectBox.svelte';
	import TooltipButton from '$lib/components/TooltipButton.svelte';
	import { BookOpenText, PlusCircle } from 'lucide-svelte';

	let { data } = $props();

	let searchableAccounts = $state(data.accounts.sort((a, b) => a.number - b.number));
	let nameFilter: string | undefined = $state();
	let numberFilter: string | undefined = $state();
	let rootFilter: string | undefined = $state();
	let typeFilter: string | undefined = $state();

	let groupAccounts = $derived.by(() => {
		let groups: string[] = [];
		searchableAccounts
			.filter((a) => a.groupAccount.rootAccount.name === rootFilter)
			.forEach((a) => {
				if (!groups.includes(a.groupAccount.name)) {
					groups.push(a.groupAccount.name);
				}
			});
		return groups;
	});

	let rootAccounts = $derived.by(() => {
		let roots: string[] = [];
		searchableAccounts.forEach((a) => {
			if (!roots.includes(a.groupAccount.rootAccount.name)) {
				roots.push(a.groupAccount.rootAccount.name);
			}
		});
		return roots;
	});

	function filterAccounts() {
		searchableAccounts = data.accounts.sort((a, b) => a.number - b.number);
		if (rootFilter) {
			searchableAccounts = searchableAccounts.filter(
				(a) => a.groupAccount.rootAccount.name === rootFilter
			);
		}
		if (typeFilter) {
			searchableAccounts = searchableAccounts.filter((a) => a.groupAccount.name === typeFilter);
		}
		if (nameFilter) {
			searchableAccounts = searchableAccounts.filter((a) =>
				a.name.toLowerCase().includes(nameFilter!.toLowerCase())
			);
		}
		if (numberFilter) {
			searchableAccounts = searchableAccounts.filter((a) =>
				a.number.toString().toLowerCase().includes(numberFilter!.toLowerCase())
			);
		}
	}
</script>

<div class="container">
	<PageHeader
		title="Chart of Accounts"
		description="View, Edit and Create {data.companyName}'s Chart of Accounts"
	>
		<button
			class="btn"
			onclick={() => {
				goto('/accounting/chart-of-accounts/add-account');
			}}
		>
			<PlusCircle size={16} />Add New Account
		</button>
		<BackButton />
	</PageHeader>
	<fieldset class="filters">
		<legend>Filter Chart of Accounts</legend>
		<div class="filter">
			<input
				type="text"
				placeholder="Account Name"
				bind:value={nameFilter}
				onkeyup={() => {
					filterAccounts();
				}}
			/>
		</div>
		<div class="filter">
			<input
				type="text"
				placeholder="Account Number"
				bind:value={numberFilter}
				onkeyup={() => {
					filterAccounts();
				}}
			/>
		</div>
		<div class="filter">
			<SelectBox
				options={rootAccounts.map((r) => ({ label: r, value: r }))}
				placeholder="Root Account"
				bind:value={rootFilter}
				onSelect={() => {
					filterAccounts();
				}}
				onClear={() => {
					rootFilter = undefined;
					typeFilter = undefined;
					filterAccounts();
				}}
			/>
		</div>
		<div class="filter">
			<SelectBox
				--options-max-height={'350px'}
				options={groupAccounts.map((r) => ({ label: r, value: r }))}
				placeholder="Account Type"
				bind:value={typeFilter}
				emptyMessage="Select a root account first"
				onSelect={() => {
					filterAccounts();
				}}
				onClear={() => {
					typeFilter = undefined;
					filterAccounts();
				}}
			/>
		</div>
	</fieldset>
	<div class="row-container">
		<div class="header">
			<span>#</span>
			<span>Account Number</span>
			<span>Account Name</span>
			<span>Root Type</span>
			<span>Account Type</span>
			<span style="text-align: right;">Current Balance</span>
			<span>Actions</span>
		</div>
		<div class="rows">
			{#each searchableAccounts as account, i (i)}
				<div class="row">
					<span>{i + 1}</span>
					<span>{account.number}</span>
					<span>{account.name}</span>
					<span>{account.groupAccount.rootAccount.name}</span>
					<span>{account.groupAccount.name}</span>
					<span style="text-align: right;">
						{Math.abs(account.currentBalance).toFixed(3)}
						{account.currentBalance > 0 ? '(dr)' : account.currentBalance < 0 ? '(cr)' : ''}
					</span>
					<div class="actions">
						<TooltipButton
							tooltipContent="View Ledger"
							onclick={() => {
								goto(`/accounting/chart-of-accounts/view-account/${account.id}`);
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
	fieldset {
		width: 65vw;
	}
	.row-container {
		.header,
		.row {
			grid-template-columns: 20px 1fr 2fr 1fr 2fr 1fr 1fr;
		}
	}
</style>

<script lang="ts" generics="T">
	import { tick, untrack } from 'svelte';

	type Option<T> = {
		label: string;
		value: T;
	};

	type Props<T> = {
		options: Option<T>[];
		id?: string;
		name?: string;
		placeholder?: string;
		class?: string;
		value?: T;
		multiselect?: boolean;
		emptyMessage?: string;
		addButton?: boolean;
		disabled?: boolean;
		attrs?: any;
		onSelect?: (o: Option<T>) => void;
		onDeselect?: (o: Option<T>) => void;
		onClear?: (o: Option<T> | undefined) => void;
		addCallback?: () => void;
	};

	let {
		options,
		value = $bindable(),
		class: className,
		id,
		name,
		placeholder,
		emptyMessage,
		disabled,
		attrs,
		onSelect,
		onClear
	}: Props<T> = $props();
	let open = $state(false);
	let inputElement: HTMLInputElement | undefined = $state();
	let comboboxContainer: HTMLElement;
	let selectedOption: Option<T> | undefined = $state();
	let optionIndex = $state(-1);
	let searchableOptions = $state(options);

	function filterOption(searchString: string) {
		searchableOptions = options;
		searchableOptions = searchableOptions.filter((o) =>
			o.label.toLowerCase().includes(searchString.toLowerCase())
		);
	}

	async function scrollToFocused() {
		const focused = comboboxContainer.querySelector('.focused');
		focused?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}

	function keyboardNavigation(node: HTMLInputElement) {
		async function handleArrowKeys(e: KeyboardEvent) {
			switch (e.key) {
				case 'ArrowDown':
					e.preventDefault();
					if (!open) {
						open = true;
					} else {
						optionIndex = (optionIndex + 1) % searchableOptions.length;
						await tick();
						scrollToFocused();
					}
					break;
				case 'ArrowUp':
					e.preventDefault();
					if (!open) {
						open = true;
					} else {
						optionIndex = (optionIndex - 1 + searchableOptions.length) % searchableOptions.length;
						await tick();
						scrollToFocused();
					}
					break;
				case 'Enter':
					e.preventDefault();
					if (open && optionIndex !== -1) {
						selectedOption = searchableOptions[optionIndex];
						value = selectedOption.value;
						inputElement!.value = selectedOption.label;
						if (onSelect) onSelect(selectedOption);
						open = false;
					} else {
						open = true;
					}
					break;
				case 'Escape':
					e.preventDefault();
					open = false;
					break;
			}
		}
		node.addEventListener('keydown', handleArrowKeys, true);
		return {
			destroy() {
				node.removeEventListener('keydown', handleArrowKeys, true);
			}
		};
	}

	$effect(() => {
		if (value) {
			untrack(() => {
				selectedOption = options.find((o) => o.value === value);
				inputElement!.value = selectedOption?.label ?? '';
			});
		} else {
			selectedOption = undefined;
			inputElement!.value = '';
		}
	});
</script>

<div class="combobox wrapper {className}" class:disabled bind:this={comboboxContainer}>
	<div class="searchbox">
		<input
			type="text"
			{id}
			{name}
			{placeholder}
			{disabled}
			{...attrs}
			bind:this={inputElement}
			use:keyboardNavigation
			oninput={(e) => {
				open = true;
				filterOption(e.currentTarget.value);
				optionIndex = 0;
			}}
			onfocus={(e) => {
				e.currentTarget.value = '';
				searchableOptions = options;
				if (!open) open = true;
			}}
			onblur={(e) => {
				if (selectedOption) {
					e.currentTarget.value = selectedOption.label;
				} else {
					e.currentTarget.value = '';
				}
				setTimeout(() => {
					if (open) open = false;
				}, 200);
			}}
		/>
		<div class="actions">
			<button
				type="button"
				tabindex="-1"
				aria-label="clear"
				{disabled}
				onclick={() => {
					if (onClear) onClear(selectedOption);
					selectedOption = undefined;
					inputElement!.value = '';
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"
				>
					<path
						d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"
					>
					</path>
				</svg>
			</button>
			<button
				type="button"
				tabindex="-1"
				class:rotated={open}
				aria-label="toggle-options"
				{disabled}
				onclick={() => {
					if (!open) {
						inputElement!.focus();
					} else {
						open = false;
					}
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"
				>
					<path d="M16.939 7.939 12 12.879l-4.939-4.94-2.122 2.122L12 17.121l7.061-7.06z"></path>
				</svg>
			</button>
		</div>
	</div>
	<ul class="options" class:open tabindex="-1">
		{#if searchableOptions.length >= 1}
			{#each searchableOptions as option, i (i)}
				<li>
					<button
						type="button"
						tabindex="-1"
						class="option"
						class:focused={i === optionIndex}
						onclick={() => {
							inputElement!.value = option.label;
							selectedOption = option;
							value = option.value;
							if (onSelect) onSelect(option);
						}}
					>
						{option.label}
						{#if selectedOption?.label === option.label}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"
							>
								<path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z">
								</path>
							</svg>
						{/if}
					</button>
				</li>
			{/each}
		{:else}
			<li>
				<p style="font-size: 0.8rem; font: inherit;">
					{emptyMessage ? emptyMessage : 'Nothing to show here.'}
				</p>
			</li>
		{/if}
	</ul>
</div>

<style>
	.wrapper {
		width: 100%;
		min-width: fit-content;
		flex-shrink: 0;
		position: relative;

		&.disabled {
			background: var(--disabled-color, lightgray);
			border-radius: var(--border-radius, 4px);
			.actions button {
				background: var(--disabled-color, lightgray);
			}
		}

		& .searchbox {
			padding: 0.125rem 0.25rem;
			display: flex;
			align-items: center;
			gap: 0.5rem;
			border: 1px solid var(--border-color, lightgray);
			border-radius: var(--border-radius, 6px);
			overflow: hidden;

			&:focus-within {
				border: 1px solid currentColor;
			}

			& input {
				padding: 0 0 0 0.125rem;
				height: 100%;
				width: 100%;
				border: none;
				outline: none;
			}

			& .actions {
				flex-shrink: 0;
				display: flex;
				align-items: center;

				& > button {
					display: flex;
					align-items: center;
					justify-content: center;
					transition: all var(--transition-speed, 0.3s) ease;

					&.rotated {
						transform: rotate(-180deg);
					}
				}
			}
		}
		& .options {
			position: absolute;
			top: calc(100% + var(--options-gap, 0.25rem));
			left: 0;
			right: 0;
			padding: 0.25rem 0.5rem;
			max-height: 0;
			display: flex;
			flex-direction: column;
			gap: 0.125rem;
			background: var(--bg-color, white);
			border-width: var(--border-width, 1px);
			border-style: var(--border-style, solid);
			border-color: var(--border-color, currentColor);
			border-radius: var(--border-radius, 4px);
			overflow: hidden;
			pointer-events: none;
			opacity: 0;
			transition: all var(--transition-speed, 0.5s) ease;
			z-index: 100;

			&.open {
				max-height: var(--options-max-height, 148px);
				pointer-events: all;
				overflow-y: scroll;
				opacity: 1;
			}

			& .option {
				width: 100%;
				padding: 0.25rem 0.5rem;
				display: flex;
				align-items: center;
				justify-content: space-between;
				text-align: left;
				border-radius: var(--border-radius, 4px);
				gap: 1rem;
				background: var(--option-background, transparent);

				&:hover,
				&.focused {
					background: var(--active-background, powderblue);
				}
			}
		}
	}

	*,
	*::before,
	*::after {
		margin: 0;
		padding: 0;
	}
	ul {
		list-style: none;
	}
	button {
		padding: 0;
		margin: 0;
		border: none;
		outline: none;
		box-shadow: none;
		background: var(--option-background, white);
		cursor: pointer;

		&.focused {
			background: var(--option-hover-background, gray);
		}
	}
</style>

<script lang="ts">
	import {
		Component,
		ChevronDown,
		ChevronRight,
		Cog,
		CirclePercent,
		NotebookPen,
		ShoppingCart,
		ShoppingBag,
		Boxes,
		UsersRound,
		BookUser,
		BookText
	} from 'lucide-svelte';

	import { page } from '$app/stores';
	import { untrack } from 'svelte';

	const size = 24;

	let sidebarOpen = $state(true);
	let openMenus: string[] = $state([]);

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	function toggleMenu(menuName: string) {
		if (!openMenus.includes(menuName)) {
			openMenus.push(menuName);
		} else {
			openMenus = openMenus.filter((m) => m !== menuName);
		}
	}

	$effect(() => {
		if ($page.route.id) {
			untrack(() => openMenus.push($page.route.id!.split('/')[1]));
		}
	});
</script>

<nav class="sidebar" class:closed={!sidebarOpen}>
	<button class="toggle-button btn" class:rotated={sidebarOpen} onclick={toggleSidebar}>
		<ChevronRight size={16} />
	</button>
	<a href="/" class="logo">
		<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
			<rect x="8" y="8" width="32" height="32" fill="#000000" rx="6" ry="6" />
			<path d="M19 16v16h10v-3H22V16h-3z" fill="#FFFFFF" />
		</svg>
		<span>Lipik</span>
	</a>
	<div class="menu">
		<ul>
			<li class="menu-item" class:active={$page.route.id?.length === 1}>
				<a href="/" class="unstyled">
					<Component {size} />
					<span>Dashboard</span>
				</a>
				<div class="submenu-wrapper">
					<ul class="submenu" style="position: absolute; width: fit-content;">
						<li class="submenu-heading">Dashboard</li>
					</ul>
				</div>
			</li>
			<li
				class="menu-item"
				class:open={openMenus.includes('accounting')}
				class:active={$page.route.id?.includes('/accounting')}
			>
				<button
					onclick={() => {
						toggleMenu('accounting');
					}}
				>
					<NotebookPen {size} />
					<span>Accounting</span>
					<ChevronDown style="margin-left: auto;" />
				</button>
				<div class="submenu-wrapper">
					<ul class="submenu">
						<li class="submenu-heading">Accounting</li>
						<li class="submenu-item" class:active={$page.route.id === '/accounting'}>
							<a href="/accounting">Home</a>
						</li>
						<li
							class="submenu-item"
							class:active={$page.route.id?.includes('/accounting/chart-of-accounts')}
						>
							<a href="/accounting/chart-of-accounts">Chart of Accounts</a>
						</li>
						<li
							class="submenu-item"
							class:active={$page.route.id?.includes('/accounting/vouchers')}
						>
							<a href="/accounting/vouchers">Vouchers</a>
						</li>
						<li
							class="submenu-item"
							class:active={$page.route.id?.includes('/accounting/expenses')}
						>
							<a href="/">Expenses</a>
						</li>
						<li
							class="submenu-item"
							class:active={$page.route.id?.includes('/accounting/reciepts')}
						>
							<a href="/">Reciepts</a>
						</li>
						<li
							class="submenu-item"
							class:active={$page.route.id?.includes('/accounting/payments')}
						>
							<a href="/">Payments</a>
						</li>
					</ul>
				</div>
			</li>
			<li
				class="menu-item"
				class:active={$page.route.id?.includes('/taxes')}
				class:open={openMenus.includes('taxes')}
			>
				<button
					onclick={() => {
						toggleMenu('taxes');
					}}
				>
					<CirclePercent {size} />
					<span>Taxes</span>
					<ChevronDown style="margin-left: auto;" />
				</button>
				<div class="submenu-wrapper">
					<ul class="submenu">
						<li class="submenu-heading">Taxes</li>
						<li class="submenu-item" class:active={$page.route.id === '/taxes'}>
							<a href="/taxes">Home</a>
						</li>
						<li class="submenu-item" class:active={$page.route.id?.includes('/taxes/add-tax')}>
							<a href="/taxes/add-tax">Add New Tax</a>
						</li>
					</ul>
				</div>
			</li>
			<li
				class="menu-item"
				class:active={$page.route.id?.includes('/parties')}
				class:open={openMenus.includes('parties')}
			>
				<button
					onclick={() => {
						toggleMenu('parties');
					}}
				>
					<UsersRound {size} />
					<span>Parties</span>
					<ChevronDown style="margin-left: auto;" />
				</button>
				<div class="submenu-wrapper">
					<ul class="submenu">
						<li class="submenu-heading">Parties</li>
						<li class="submenu-item" class:active={$page.route.id === '/parties'}>
							<a href="/parties">Home</a>
						</li>
						<li class="submenu-item" class:active={$page.route.id?.includes('/parties/customers')}>
							<a href="/parties/customers">Customers</a>
						</li>
						<li class="submenu-item" class:active={$page.route.id?.includes('/parties/vendors')}>
							<a href="/parties/vendors">Vendors</a>
						</li>
					</ul>
				</div>
			</li>

			<li
				class="menu-item"
				class:active={$page.route.id?.includes('/purchase')}
				class:open={openMenus.includes('purchase')}
			>
				<button
					onclick={() => {
						toggleMenu('purchase');
					}}
				>
					<ShoppingCart {size} />
					<span>Purchase</span>
					<ChevronDown style="margin-left: auto;" />
				</button>
				<div class="submenu-wrapper">
					<ul class="submenu">
						<li class="submenu-heading">Purchase</li>
						<li class="submenu-item" class:active={$page.route.id === '/purchase'}>
							<a href="/purchase">Home</a>
						</li>
						<li class="submenu-item" class:active={$page.route.id?.includes('/purchase/orders')}>
							<a href="/purchase/orders">Purchase Orders</a>
						</li>
						<li class="submenu-item" class:active={$page.route.id?.includes('/purchase/invoices')}>
							<a href="/purchase/invoices">Purchase Invoices</a>
						</li>
					</ul>
				</div>
			</li>

			<li
				class="menu-item"
				class:active={$page.route.id?.includes('/sales')}
				class:open={openMenus.includes('sales')}
			>
				<button
					onclick={() => {
						toggleMenu('sales');
					}}
				>
					<ShoppingBag {size} />
					<span>Sales</span>
					<ChevronDown style="margin-left: auto;" />
				</button>
				<div class="submenu-wrapper">
					<ul class="submenu">
						<li class="submenu-heading">Sales</li>
						<li class="submenu-item" class:active={$page.route.id === '/sales'}>
							<a href="/">Home</a>
						</li>
						<li class="submenu-item" class:active={$page.route.id?.includes('/sales/orders')}>
							<a href="/">Sales Orders</a>
						</li>
						<li class="submenu-item" class:active={$page.route.id?.includes('/sales/invoices')}>
							<a href="/">Sales Invoices</a>
						</li>
						<li class="submenu-item" class:active={$page.route.id?.includes('/sales/new-order')}>
							<a href="/">New Sales Order</a>
						</li>
						<li class="submenu-item" class:active={$page.route.id?.includes('/sales/new-invoice')}>
							<a href="/">New Sales Invoice</a>
						</li>
					</ul>
				</div>
			</li>

			<li
				class="menu-item"
				class:active={$page.route.id?.includes('/inventory')}
				class:open={openMenus.includes('inventory')}
			>
				<button
					onclick={() => {
						toggleMenu('inventory');
					}}
				>
					<Boxes {size} />
					<span>Inventory</span>
					<ChevronDown style="margin-left: auto;" />
				</button>
				<div class="submenu-wrapper">
					<ul class="submenu">
						<li class="submenu-heading">Inventory</li>
						<li class="submenu-item" class:active={$page.route.id === '/inventory'}>
							<a href="/inventory">Home</a>
						</li>
						<li
							class="submenu-item"
							class:active={$page.route.id?.includes('/inventory/categories')}
						>
							<a href="/inventory/categories">Product Categories</a>
						</li>
						<li class="submenu-item" class:active={$page.route.id?.includes('/inventory/products')}>
							<a href="/inventory/products">Products</a>
						</li>
						<li class="submenu-item" class:active={$page.route.id?.includes('/inventory/services')}>
							<a href="/inventory/services">Services</a>
						</li>
						<li
							class="submenu-item"
							class:active={$page.route.id?.includes('/inventory/warehouses')}
						>
							<a href="/inventory/warehouses">Warehouses</a>
						</li>
					</ul>
				</div>
			</li>

			<li
				class="menu-item"
				class:active={$page.route.id?.includes('/hr')}
				class:open={openMenus.includes('hr')}
			>
				<button
					onclick={() => {
						toggleMenu('hr');
					}}
				>
					<BookUser {size} />
					<span>Human Resources</span>
					<ChevronDown style="margin-left: auto;" />
				</button>
				<div class="submenu-wrapper">
					<ul class="submenu">
						<li class="submenu-heading">Human Resources</li>
						<li class="submenu-item" class:active={$page.route.id === '/hr'}>
							<a href="/">Home</a>
						</li>
						<li class="submenu-item" class:active={$page.route.id?.includes('/hr/departments')}>
							<a href="/">Departments</a>
						</li>
						<li class="submenu-item" class:active={$page.route.id?.includes('/hr/employees')}>
							<a href="/">Employees</a>
						</li>
						<li class="submenu-item" class:active={$page.route.id?.includes('/hr/payroll')}>
							<a href="/">Payroll</a>
						</li>
						<li class="submenu-item" class:active={$page.route.id?.includes('/hr/attendance')}>
							<a href="/">Attendance</a>
						</li>
					</ul>
				</div>
			</li>
			<li
				class="menu-item"
				class:active={$page.route.id?.includes('/reports')}
				class:open={openMenus.includes('reports')}
			>
				<button
					onclick={() => {
						toggleMenu('reports');
					}}
				>
					<BookText {size} />
					<span>Reports</span>
					<ChevronDown style="margin-left: auto;" />
				</button>
				<div class="submenu-wrapper">
					<ul class="submenu">
						<li class="submenu-heading">Reports</li>
						<li class="submenu-item" class:active={$page.route.id === '/reports'}>
							<a href="/">Home</a>
						</li>
						<li
							class="submenu-item"
							class:active={$page.route.id?.includes('/reports/profit-loss')}
						>
							<a href="/">Profit and Loss</a>
						</li>
						<li class="submenu-item" class:active={$page.route.id?.includes('/reports/cash-flow')}>
							<a href="/">Cash Flow</a>
						</li>
						<li
							class="submenu-item"
							class:active={$page.route.id?.includes('/reports/balance-sheet')}
						>
							<a href="/">Balance Sheet</a>
						</li>
						<li class="submenu-item" class:active={$page.route.id?.includes('/reports/misc')}>
							<a href="/">Miscelleneous</a>
						</li>
					</ul>
				</div>
			</li>
		</ul>
	</div>
	<div class="profile">
		<ul>
			<li class="menu-item" class:active={$page.route.id?.includes('settings')}>
				<a href="/settings">
					<Cog {size} />
					<span>Settings</span>
				</a>
				<div class="submenu-wrapper">
					<ul class="submenu" style="position: absolute; width: fit-content;">
						<li class="submenu-heading">Settings</li>
					</ul>
				</div>
			</li>
		</ul>
	</div>
</nav>

<style>
	nav {
		position: relative;
		height: 100%;
		width: 260px;
		padding: 1.5rem 0.25rem;
		display: flex;
		flex-direction: column;
		box-shadow: var(--shadow-sm);
		transition: all 0.3s ease;
		overflow-y: hidden;
		overflow-x: visible;

		& .toggle-button {
			position: absolute;
			top: 5px;
			right: 1px;
			padding: 0.125rem;

			&.rotated {
				transform: rotate(-180deg);
				transition: all 0.3s ease;
			}
		}

		.logo {
			padding: 0.2rem 0;
			flex-shrink: 0;
			display: flex;
			align-items: center;
			gap: 1rem;
			text-decoration: none;
			color: currentColor;
			border-block-end: 1px solid currentColor;

			& > :global(svg) {
				margin-left: -0.25rem;
				flex-shrink: 0;
			}
			span {
				font-size: 32px;
				font-weight: var(--fw-base);
				transition: all 0.3s ease;
			}
		}

		.menu {
			flex-grow: 1;
		}

		.profile {
			width: 100%;
			flex-shrink: 0;
			flex-grow: 0;
		}

		.menu,
		.profile {
			width: 100%;
			overflow-y: auto;
			padding: 1rem 0rem;

			& > ul {
				display: flex;
				flex-grow: 1;
				flex-direction: column;
				gap: 1rem;
				overflow-y: auto;

				& .menu-item {
					overflow: hidden;

					& :global(svg:last-child) {
						transition: all 0.3s ease;
					}

					&.open {
						.submenu-wrapper {
							position: relative;
							grid-template-rows: 1fr;
						}
						& :global(svg:last-child) {
							transform: rotate(-180deg);
						}
					}

					& > button,
					& > a {
						all: unset;
						max-width: 100%;
						width: 228px;
						padding: 0.25rem 0.5rem;
						font-size: var(--fs-lg);
						display: flex;
						align-items: center;
						gap: 1rem;
						margin-block-end: 0.5rem;
						border-radius: var(--radius-md);
						cursor: pointer;
						transition: all 0.3s ease;

						&:hover {
							color: var(--color-bg);
							background: var(--color-text);
						}

						& span {
							text-wrap: nowrap;
						}
					}

					& .submenu-wrapper {
						display: grid;
						grid-template-rows: 0fr;
						transition: all 0.3s ease;
						z-index: 99;

						& .submenu {
							padding-left: 2.5rem;
							display: flex;
							flex-direction: column;
							gap: 1rem;
							overflow: hidden;

							& .submenu-heading {
								display: none;
							}

							& .submenu-item {
								display: flex;
								padding: 0.125rem 0.5rem;
								border-radius: var(--radius-md);
								transition: all 0.3s ease;

								&:hover {
									color: var(--color-bg);
									background: var(--color-text);
								}
								& > a {
									width: 100%;
									font-size: var(--fw-base);
									text-decoration: none;
									color: currentColor;
									text-wrap: nowrap;
								}
							}
						}
					}
				}
			}
		}

		&.closed {
			overflow: visible;
			width: 50px;

			.toggle-button {
				left: 50%;
				transform: translateX(-50%);
			}

			& .logo {
				width: 100%;
				flex-shrink: 0;
				display: flex;
				align-items: center;
				gap: 1rem;
				text-decoration: none;
				color: currentColor;

				& span {
					font-size: 0;
					transition: all 0.3s ease;
				}

				& > :global(svg) {
					flex-shrink: 0;
				}
			}

			.menu,
			.profile {
				overflow: visible;
				& > ul {
					overflow: visible;
					.menu-item {
						position: relative;

						& > button,
						& > a {
							width: fit-content;
						}

						& span {
							display: none;
						}

						& :global(svg:last-child) {
							display: none;
						}

						.submenu-wrapper {
							transition: 0s;
							position: absolute;
							& > ul {
								& li {
									text-wrap: nowrap;
								}
							}
						}

						&:hover {
							position: relative;
							overflow: visible;
							.submenu {
								overflow: visible;
							}

							.submenu-wrapper {
								position: absolute;
								top: -25%;
								left: 100%;
								grid-template-rows: 1fr;

								& ul {
									width: 100%;
									margin-left: 1rem;
									padding: 0.5rem 1rem;
									background: var(--color-bg);
									border-radius: var(--radius-md);
									box-shadow: var(--shadow-sm);

									.submenu-heading {
										padding-block-end: 0.25rem;
										display: block;
										font-size: var(--fs-lg);
										font-weight: var(--fw-semibold);
										border-block-end: 1px solid;
									}
								}
							}
						}
					}
				}
			}
		}
	}
	.active {
		& span,
		& :global(svg) {
			color: var(--color-orange);
		}
		& > a {
			color: var(--color-orange) !important;
		}
	}
</style>

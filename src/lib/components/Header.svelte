<script lang="ts">
	import { page } from '$app/stores';
	let isMobileMenuOpen = false;

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function closeMobileMenu() {
		isMobileMenuOpen = false;
	}

	const navLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/products', label: 'Products' },
		{ href: '/cart', label: 'Cart' },
		{ href: '/orders', label: 'Orders' }
	];
</script>

<header class="sticky top-0 z-50 border-b border-neutral-200 bg-white shadow-sm-atlassian">
	<nav class="container-main flex items-center justify-between py-4">
		<a href="/" class="flex items-center gap-2">
			<img src="/ec88bf56-7a12-4512-a335-733d7c515b41.jpg" alt="Dzungli Logo" class="h-10 w-10 rounded-lg object-cover" />
			<span class="hidden text-xl font-bold text-neutral-900 sm:inline">Dzungli</span>
		</a>

		<!-- Desktop Navigation -->
		<div class="hidden items-center gap-8 md:flex">
			{#each navLinks as link}
				<a
					href={link.href}
					class="text-sm font-medium transition-colors {$page.url.pathname === link.href
						? 'text-primary-600'
						: 'text-neutral-600 hover:text-neutral-900'}"
				>
					{link.label}
				</a>
			{/each}
		</div>

		<div class="flex items-center gap-4">
			<a href="/account" class="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900">
				Account
			</a>
			<button
				class="md:hidden p-2 text-neutral-600 hover:text-neutral-900"
				aria-label="Toggle menu"
				on:click={toggleMobileMenu}
			>
				<svg
					class="h-6 w-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
					/>
				</svg>
			</button>
		</div>
	</nav>

	{#if isMobileMenuOpen}
		<div class="border-t border-neutral-200 bg-white md:hidden">
			<div class="container-main space-y-1 py-4">
				{#each navLinks as link}
					<a
						href={link.href}
						class="block rounded-lg px-4 py-2 text-sm font-medium transition-colors {$page.url.pathname === link.href
							? 'bg-primary-50 text-primary-600'
							: 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'}"
						on:click={closeMobileMenu}
					>
						{link.label}
					</a>
				{/each}
			</div>
		</div>
	{/if}
</header>

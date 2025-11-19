<script lang="ts">
	import type { PageData } from './$types';

	interface Product {
		id: string;
		name: string;
		price: number;
		image: string;
		rating: number;
		reviews: number;
		badge?: string;
	}

	export let data: PageData;
	
	let featuredProducts: Product[] = data.featuredProducts || [];
	let categories = [
		{ icon: '🛍️', name: 'Electronics', href: '/products?category=electronics' },
		{ icon: '👔', name: 'Fashion', href: '/products?category=fashion' },
		{ icon: '🏠', name: 'Home & Garden', href: '/products?category=home' },
		{ icon: '⚽', name: 'Sports', href: '/products?category=sports' }
	];

	async function addToCart(product: Product) {
		try {
			const response = await fetch('/api/cart', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ product_id: Number(product.id), quantity: 1 })
			});

			if (response.ok) {
				alert(`Added "${product.name}" to cart!`);
			} else {
				const error = await response.json();
				alert(error.error || 'Failed to add to cart. Please login first.');
			}
		} catch (error) {
			console.error('Error adding to cart:', error);
			alert('Failed to add to cart');
		}
	}
</script>

<svelte:head>
	<title>Dzungli - Modern E-commerce Store</title>
	<meta name="description" content="Shop premium products with Dzungli, your modern e-commerce destination." />
</svelte:head>

<!-- Hero Section -->
<section class="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20 sm:py-32">
	<div class="absolute inset-0 overflow-hidden">
		<div class="absolute right-0 top-0 h-96 w-96 rounded-full bg-primary-200 opacity-20 blur-3xl"></div>
		<div class="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-accent-200 opacity-20 blur-3xl"></div>
	</div>

	<div class="container-main relative">
		<div class="grid gap-12 lg:grid-cols-2 lg:gap-8 lg:items-center">
			<!-- Left Content -->
			<div class="flex flex-col justify-center">
				<div class="inline-flex w-fit rounded-full bg-primary-100 px-4 py-2 mb-6">
					<span class="text-sm font-semibold text-primary-700">Welcome to Dzungli!</span>
				</div>
				<h1 class="section-title mb-6">
					<span class="text-gradient">Shop Smart.</span> Save Smarter.
				</h1>
				<p class="section-subtitle mb-8 text-base sm:text-lg max-w-2xl">
					Discover an extensive collection of premium products delivered straight to your door. Fast shipping, secure checkout, and exceptional customer service.
				</p>
				<div class="flex flex-col gap-4 sm:flex-row">
					<a href="/products" class="btn-primary">
						<span>Browse Products</span>
						<svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
						</svg>
					</a>
					<button class="btn-secondary">
						<span>Learn More</span>
					</button>
				</div>

				<!-- Stats -->
				<div class="mt-12 grid gap-8 grid-cols-3">
					<div>
						<p class="text-2xl font-bold text-primary-600">10K+</p>
						<p class="text-sm text-neutral-600">Products</p>
					</div>
					<div>
						<p class="text-2xl font-bold text-primary-600">50K+</p>
						<p class="text-sm text-neutral-600">Happy Customers</p>
					</div>
					<div>
						<p class="text-2xl font-bold text-primary-600">24h</p>
						<p class="text-sm text-neutral-600">Support</p>
					</div>
				</div>
			</div>

			<!-- Right Visual -->
			<div class="relative h-96 sm:h-[500px]">
				<div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-400 opacity-10"></div>
				<div class="absolute inset-4 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
					<div class="text-center">
						<svg class="mx-auto h-32 w-32 text-primary-400 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
						</svg>
						<p class="mt-4 text-lg font-semibold text-primary-600">Ready to Shop</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Categories Section -->
<section class="py-16 sm:py-20">
	<div class="container-main">
		<h2 class="section-title mb-12 text-center">Shop by Category</h2>
		<div class="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
			{#each categories as category}
				<a
					href={category.href}
					class="card-hover group flex flex-col items-center justify-center py-8 text-center"
				>
					<span class="mb-4 text-5xl group-hover:scale-110 transition-transform duration-300">
						{category.icon}
					</span>
					<h3 class="text-lg font-semibold text-neutral-900">{category.name}</h3>
					<p class="mt-2 text-sm text-neutral-600">Shop now</p>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- Featured Products Section -->
<section class="py-16 sm:py-20 bg-neutral-50">
	<div class="container-main">
		<div class="mb-12 flex items-end justify-between">
			<div>
				<h2 class="section-title mb-4">Featured Products</h2>
				<p class="section-subtitle">Handpicked items just for you</p>
			</div>
			<a href="/products" class="hidden text-sm font-semibold text-primary-600 hover:text-primary-700 sm:block">
				View all →
			</a>
		</div>

		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each featuredProducts as product (product.id)}
				<div class="card-hover flex flex-col overflow-hidden">
					<!-- Product Image -->
					<div class="relative h-48 w-full overflow-hidden bg-neutral-200 sm:h-56">
						<img
							src={product.image}
							alt={product.name}
							class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
						/>
					</div>

					<!-- Product Info -->
					<div class="flex flex-1 flex-col p-4">
						<h3 class="mb-2 text-base font-semibold text-neutral-900 line-clamp-2">
							{product.name}
						</h3>

						<!-- Rating -->
						<div class="mb-4 flex items-center gap-2 min-h-[24px]">
							{#if product.reviews > 0}
								<div class="flex">
									{#each Array(5) as _, i}
										<svg
											class={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-neutral-300'}`}
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
									{/each}
								</div>
								<span class="text-xs text-neutral-600">
									{product.rating}
									<span class="text-neutral-500">({product.reviews} {product.reviews === 1 ? 'review' : 'reviews'})</span>
								</span>
							{:else}
								<span class="text-xs text-neutral-500 italic">No reviews yet</span>
							{/if}
						</div>

						<!-- Price and Button -->
						<div class="mt-auto flex items-end justify-between gap-4">
							<p class="text-2xl font-bold text-primary-600">${product.price.toFixed(2)}</p>
							<button
								on:click={() => addToCart(product)}
								class="btn-primary btn-sm"
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
								</svg>
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- View All Button (Mobile) -->
		<div class="mt-8 flex justify-center sm:hidden">
			<a href="/products" class="btn-secondary">
				View All Products
			</a>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="py-16 sm:py-20">
	<div class="container-main">
		<div class="rounded-2xl bg-gradient-to-r from-primary-600 to-accent-600 px-6 py-12 text-center sm:px-12 sm:py-16">
			<h2 class="mb-4 text-3xl font-bold text-white sm:text-4xl">
				Ready to Start Shopping?
			</h2>
			<p class="mb-8 text-base text-primary-100 sm:text-lg">
				Join thousands of happy customers and discover amazing deals today.
			</p>
			<a href="/products" class="inline-flex items-center rounded-lg bg-white px-8 py-3 text-base font-semibold text-primary-600 transition-all hover:bg-primary-50 active:bg-primary-100">
				<span>Shop Now</span>
				<svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
				</svg>
			</a>
		</div>
	</div>
</section>

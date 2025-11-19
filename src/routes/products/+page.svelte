<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';

	interface Product {
		id: string;
		name: string;
		price: number;
		image: string;
		rating: number;
		reviews: number;
		category: string;
		inStock: boolean;
	}

	export let data: PageData;
	
	// Make products reactive to data changes
	$: products = data.products || [];
	let selectedCategory = $page.url.searchParams.get('category') || 'all';
	let sortBy = $page.url.searchParams.get('sort') || 'featured';
	let searchQuery = $page.url.searchParams.get('search') || '';
	
	$: filteredProducts = products;

	const categories = [
		{ value: 'all', label: 'All Products' },
		{ value: 'electronics', label: 'Electronics' },
		{ value: 'fashion', label: 'Fashion' },
		{ value: 'home', label: 'Home & Garden' },
		{ value: 'sports', label: 'Sports' }
	];

	const sortOptions = [
		{ value: 'featured', label: 'Featured' },
		{ value: 'newest', label: 'Newest' },
		{ value: 'price-low', label: 'Price: Low to High' },
		{ value: 'price-high', label: 'Price: High to Low' },
		{ value: 'rating', label: 'Highest Rated' }
	];

	function updateFilters() {
		if (!browser) return; // Only run on client side
		
		const params = new URLSearchParams();
		if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
		if (sortBy && sortBy !== 'featured') params.set('sort', sortBy);
		if (searchQuery) params.set('search', searchQuery);
		
		goto(`?${params.toString()}`, { keepFocus: true, noScroll: true });
	}

	$: if (browser) {
		// Track all filter changes for reactive updates
		selectedCategory, sortBy, searchQuery;
		updateFilters();
	}

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
	<title>Products - Dzungli</title>
	<meta name="description" content="Browse our complete catalog of products." />
</svelte:head>

<!-- Page Header -->
<section class="bg-gradient-to-br from-primary-50 to-accent-50 py-8 sm:py-12">
	<div class="container-main">
		<h1 class="section-title mb-2">Products</h1>
		<p class="section-subtitle max-w-2xl">
			Explore our collection of {filteredProducts.length} products
		</p>
	</div>
</section>

<!-- Products Section -->
<section class="py-12 sm:py-16">
	<div class="container-main">
		<div class="grid gap-8 lg:grid-cols-4 lg:gap-6">
			<!-- Sidebar Filters -->
			<div class="lg:col-span-1">
				<div class="sticky top-20 space-y-6">
					<!-- Search -->
					<div>
						<label for="search" class="mb-2 block text-sm font-semibold text-neutral-900">
							Search
						</label>
						<input
							id="search"
							type="text"
							placeholder="Search products..."
							bind:value={searchQuery}
							class="input-field"
						/>
					</div>

					<!-- Category Filter -->
					<div>
						<h3 class="mb-4 text-sm font-semibold text-neutral-900">Category</h3>
						<div class="space-y-2">
							{#each categories as category}
								<label class="flex items-center gap-3 cursor-pointer">
									<input
										type="radio"
										name="category"
										value={category.value}
										bind:group={selectedCategory}
										class="h-4 w-4 text-primary-600 cursor-pointer"
									/>
									<span class="text-sm text-neutral-700">{category.label}</span>
								</label>
							{/each}
						</div>
					</div>

					<!-- Sort Options -->
					<div>
						<label for="sort" class="mb-2 block text-sm font-semibold text-neutral-900">
							Sort By
						</label>
						<select bind:value={sortBy} class="input-field">
							{#each sortOptions as option}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
					</div>

					<!-- Clear Filters -->
					{#if selectedCategory !== 'all' || searchQuery}
						<button
							on:click={() => {
								selectedCategory = 'all';
								searchQuery = '';
								sortBy = 'featured';
								goto('/products');
							}}
							class="btn-outline btn-sm w-full"
						>
							Clear Filters
						</button>
					{/if}
				</div>
			</div>

			<!-- Products Grid -->
			<div class="lg:col-span-3">
				{#if filteredProducts.length === 0}
					<div class="flex h-96 flex-col items-center justify-center">
						<svg class="mb-4 h-16 w-16 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<p class="text-lg font-semibold text-neutral-900">No products found</p>
						<p class="text-sm text-neutral-600">Try adjusting your filters</p>
					</div>
				{:else}
					<div class="grid gap-6 md:grid-cols-2">
						{#each filteredProducts as product (product.id)}
							<div class="card-hover flex flex-col overflow-hidden">
								<!-- Product Image -->
								<div class="relative h-48 w-full overflow-hidden bg-neutral-200 sm:h-56">
									<img
										src={product.image}
										alt={product.name}
										class="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
									/>
									{#if !product.inStock}
										<div class="absolute inset-0 flex items-center justify-center bg-black/50">
											<span class="text-white font-semibold">Out of Stock</span>
										</div>
									{/if}
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
									    aria-label="Add {product.name} to cart"
									    disabled={!product.inStock}
											class="btn-primary btn-sm disabled:opacity-50"
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
				{/if}
			</div>
		</div>
	</div>
</section>

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
	<title>Collection - Dzungli Curated Goods</title>
	<meta name="description" content="Explore our hand-curated collection of timeless pieces, each selected for quality and story." />
</svelte:head>

<!-- Page Header -->
<section class="relative bg-gradient-to-br from-slate-50 via-white to-stone-50 py-12 sm:py-16">
	<div class="absolute inset-0 overflow-hidden">
		<div class="absolute top-0 right-0 w-64 h-64 bg-slate-100 rounded-full opacity-30 blur-2xl"></div>
		<div class="absolute bottom-0 left-0 w-48 h-48 bg-stone-100 rounded-full opacity-30 blur-2xl"></div>
	</div>
	<div class="container-main relative">
		<div class="max-w-3xl">
			<h1 class="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
				Our <span class="bg-gradient-to-r from-slate-900 to-stone-700 bg-clip-text text-transparent">Curated</span> Collection
			</h1>
			<p class="text-lg text-slate-600 leading-relaxed">
				Each piece in our collection tells a story of craftsmanship, quality, and timeless design.
				Explore {filteredProducts.length} hand-selected items waiting to become part of your story.
			</p>
		</div>
	</div>
</section>

<!-- Products Section -->
<section class="py-12 sm:py-16">
	<div class="container-main">
		<div class="grid gap-8 lg:grid-cols-4 lg:gap-6">
			<!-- Curated Filters -->
			<div class="lg:col-span-1">
				<div class="sticky top-20 space-y-6">
					<!-- Search -->
					<div>
						<label for="search" class="mb-3 block text-sm font-medium text-slate-700">
							🔍 Find Your Piece
						</label>
						<input
							id="search"
							type="text"
							placeholder="Search by name or description..."
							bind:value={searchQuery}
							class="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
						/>
					</div>

					<!-- Category Filter -->
					<div>
						<h3 class="mb-3 text-sm font-medium text-slate-700">🎨 By Collection</h3>
						<div class="space-y-2">
							{#each categories as category}
								<label class="flex items-center gap-3 cursor-pointer group">
									<div class="h-4 w-4 rounded border-2 border-slate-300 group-hover:border-slate-400 group-checked:border-slate-600 group-checked:bg-slate-600 transition-all duration-200">
										{#if selectedCategory === category.value}
											<div class="h-full w-full bg-slate-600 rounded"></div>
										{/if}
									</div>
									<span class="text-sm text-slate-600 group-hover:text-slate-700 font-medium transition-colors">{category.label}</span>
								</label>
							{/each}
						</div>
					</div>

					<!-- Sort Options -->
					<div>
						<label for="sort" class="mb-3 block text-sm font-medium text-slate-700">
							✨ Sort By
						</label>
						<select bind:value={sortBy} class="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all">
							{#each sortOptions as option}
								<option value={option.value} class="text-slate-700">{option.label}</option>
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
							class="w-full py-3 px-4 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:border-slate-300 hover:text-slate-700 transition-all"
						>
							🧹 Clear Selection
						</button>
					{/if}
				</div>
			</div>

			<!-- Curated Collection Grid -->
			<div class="lg:col-span-3">
				{#if filteredProducts.length === 0}
					<div class="flex h-96 flex-col items-center justify-center text-center">
						<div class="mb-4 bg-slate-100 rounded-2xl p-4">
							<svg class="h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<h3 class="text-2xl font-bold text-slate-900 mb-2">No Pieces Found</h3>
						<p class="text-slate-600 mb-4">The perfect piece is out there. Try adjusting your search.</p>
						<button
							on:click={() => {
								selectedCategory = 'all';
								searchQuery = '';
								sortBy = 'featured';
								goto('/products');
							}}
							class="px-6 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:border-slate-300 hover:text-slate-700 transition-all"
						>
							✨ Start Fresh
						</button>
					</div>
				{:else}
					<div class="grid gap-8 md:grid-cols-2">
						{#each filteredProducts as product (product.id)}
							<div class="group cursor-pointer">
								<!-- Product Image -->
								<div class="relative overflow-hidden rounded-2xl bg-slate-50 mb-4 aspect-square border border-slate-100">
									<img
										src={product.image}
										alt={product.name}
										class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
									/>
									{#if !product.inStock}
										<div class="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
											<span class="text-white font-semibold text-sm">⏳ Temporarily Unavailable</span>
										</div>
									{/if}
									<div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
									<div class="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
										<button class="w-full py-2 bg-white/95 backdrop-blur-sm text-slate-700 font-medium rounded-lg text-sm border border-slate-200 shadow-lg">
											View Details
										</button>
									</div>
								</div>

								<!-- Product Info -->
								<div class="space-y-3">
									<div class="flex items-start justify-between">
										<div class="flex-1">
											<h3 class="text-base font-semibold text-slate-900 line-clamp-2 leading-tight mb-1">
												{product.name}
											</h3>
											{#if product.inStock}
												<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
													Available
												</span>
											{:else}
												<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
													Low Stock
												</span>
											{/if}
										</div>
									</div>

									<!-- Rating -->
									{#if product.reviews > 0}
										<div class="flex items-center gap-2">
											<div class="flex">
												{#each Array(5) as _, i}
													<svg
														class={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-slate-300'}`}
														fill="currentColor"
														viewBox="0 0 20 20"
													>
														<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
													</svg>
												{/each}
											</div>
											<span class="text-sm text-slate-600 font-medium">
												{product.rating} ({product.reviews} {product.reviews === 1 ? 'review' : 'reviews'})
											</span>
										</div>
									{:else}
										<div class="text-sm text-slate-500 italic">No reviews yet</div>
									{/if}

									<!-- Price and Button -->
									<div class="flex items-center justify-between">
										<p class="text-xl font-bold text-slate-900">${product.price.toFixed(2)}</p>
										<button
											on:click={() => addToCart(product)}
											aria-label="Add {product.name} to cart"
											disabled={!product.inStock}
											class="p-2 text-slate-600 hover:text-slate-900 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
										>
											<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

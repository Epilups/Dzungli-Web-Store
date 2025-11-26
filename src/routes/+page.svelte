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
		{ icon: '📱', name: 'Electronics', href: '/products?category=electronics' },
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
	<title>Dzungli - Curated Goods & Timeless Style</title>
	<meta name="description" content="Discover thoughtfully selected pieces that blend quality craftsmanship with modern design. Handcrafted collections for the discerning shopper." />
</svelte:head>

<!-- Hero Section -->
<section class="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-stone-50 py-20 sm:py-32">
	<div class="absolute inset-0 overflow-hidden">
		<div class="absolute right-0 top-0 h-96 w-96 rounded-full bg-slate-200 opacity-15 blur-3xl animate-pulse"></div>
		<div class="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-stone-200 opacity-15 blur-3xl animate-pulse delay-1000"></div>
		<!-- Geometric pattern background -->
		<div class="absolute inset-0 opacity-5">
			<div class="absolute top-20 left-10 w-20 h-20 border-2 border-slate-300 rounded-lg transform rotate-12"></div>
			<div class="absolute top-40 right-10 w-16 h-16 border-2 border-stone-300 rounded-lg transform -rotate-6"></div>
			<div class="absolute bottom-20 left-1/3 w-24 h-24 border-2 border-slate-300 rounded-lg transform rotate-3"></div>
		</div>
	</div>

	<div class="container-main relative">
		<div class="grid gap-12 lg:grid-cols-2 lg:gap-8 lg:items-center">
			<!-- Left Content -->
			<div class="flex flex-col justify-center">
				<div class="inline-flex w-fit rounded-full bg-gradient-to-r from-slate-100 to-stone-100 px-4 py-2 mb-6 border border-slate-200">
					<span class="text-sm font-medium text-slate-700">Handcrafted Collections</span>
				</div>
				<h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
					<span class="bg-gradient-to-r from-slate-900 to-stone-700 bg-clip-text text-transparent">Curated Goods.</span>
					<br><span class="text-stone-600">Timeless Style.</span>
				</h1>
				<p class="text-base sm:text-lg text-slate-600 max-w-2xl mb-8 leading-relaxed">
					Discover thoughtfully selected pieces that blend quality craftsmanship with modern design.
					Each item tells a story of passion, precision, and purpose.
				</p>
				<div class="flex flex-col gap-4 sm:flex-row">
					<a href="/products" class="inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-lg font-medium transition-all hover:bg-slate-800 active:bg-slate-700 transform hover:translate-y-[-2px] hover:shadow-lg">
						<span>Explore Collection</span>
						<svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
						</svg>
					</a>
					<button class="inline-flex items-center px-6 py-3 text-slate-600 font-medium border-2 border-slate-200 rounded-lg transition-all hover:border-slate-300 hover:text-slate-700 transform hover:translate-y-[-2px]">
						<span>Our Story</span>
					</button>
				</div>

				<!-- Stats -->
				<div class="mt-12 grid gap-8 grid-cols-3">
					<div>
						<p class="text-2xl font-bold text-slate-900">1K+</p>
						<p class="text-sm text-slate-500 font-medium">Curated Pieces</p>
					</div>
					<div>
						<p class="text-2xl font-bold text-slate-900">8K+</p>
						<p class="text-sm text-slate-500 font-medium">Loyal Collectors</p>
					</div>
					<div>
						<p class="text-2xl font-bold text-slate-900">4.9★</p>
						<p class="text-sm text-slate-500 font-medium">Average Rating</p>
					</div>
				</div>
			</div>

			<!-- Right Visual -->
			<div class="relative h-96 sm:h-[500px]">
				<div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-100 to-stone-100 opacity-50"></div>
				<div class="absolute inset-4 rounded-xl bg-white flex items-center justify-center border border-slate-100 shadow-lg">
					<div class="text-center">
						<div class="mx-auto h-32 w-32 bg-gradient-to-br from-slate-100 to-stone-100 rounded-2xl flex items-center justify-center mb-4 border-2 border-slate-200">
							<svg class="h-16 w-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
							</svg>
						</div>
						<p class="text-lg font-semibold text-slate-700">Carefully Curated</p>
						<p class="text-sm text-slate-500 mt-1">Every piece has a purpose</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Collections Section -->
<section class="py-16 sm:py-20">
	<div class="container-main">
		<div class="text-center mb-12">
			<h2 class="text-3xl font-bold text-slate-900 mb-4">Explore Our Collections</h2>
			<p class="text-lg text-slate-600">Discover the perfect pieces for every moment and mood</p>
		</div>
		<div class="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
			{#each categories as category}
				<a
					href={category.href}
					class="group block p-6 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-2"
				>
					<div class="text-center">
						<div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-50 to-stone-50 rounded-2xl mb-4 group-hover:from-slate-100 group-hover:to-stone-100 transition-colors">
							<span class="text-3xl group-hover:scale-110 transition-transform duration-300">
								{category.icon}
							</span>
						</div>
						<h3 class="text-lg font-semibold text-slate-900 mb-2 group-hover:text-slate-800 transition-colors">{category.name}</h3>
						<p class="text-sm text-slate-600 font-medium">Explore collection</p>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- Curated Collection Section -->
<section class="py-16 sm:py-20">
	<div class="container-main">
		<div class="mb-12 text-center">
			<h2 class="text-3xl font-bold text-slate-900 mb-4">Our Curated Collection</h2>
			<p class="text-lg text-slate-600 max-w-2xl mx-auto">Each piece is carefully selected for its story, quality, and timeless appeal</p>
		</div>

		<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each featuredProducts as product (product.id)}
				<div class="group cursor-pointer">
					<!-- Product Image -->
					<div class="relative overflow-hidden rounded-2xl bg-slate-50 mb-4 aspect-square border border-slate-100">
						<img
							src={product.image}
							alt={product.name}
							class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
						<div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
						<div class="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
							<button class="w-full py-2 bg-white/95 backdrop-blur-sm text-slate-700 font-medium rounded-lg text-sm border border-slate-200 shadow-lg">
								View Details
							</button>
						</div>
					</div>

					<!-- Product Info -->
					<div class="space-y-3">
						<h3 class="text-base font-semibold text-slate-900 line-clamp-2 leading-tight">
							{product.name}
						</h3>

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
								class="p-2 text-slate-600 hover:text-slate-900 transition-colors"
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

		<!-- View All Button -->
		<div class="mt-12 flex justify-center">
			<a href="/products" class="inline-flex items-center px-8 py-3 text-slate-600 font-medium border-2 border-slate-200 rounded-lg transition-all hover:border-slate-300 hover:text-slate-700 transform hover:translate-y-[-2px]">
				<span>Explore Full Collection</span>
				<svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
				</svg>
			</a>
		</div>
	</div>
</section>

<!-- Craftsmanship CTA Section -->
<section class="py-16 sm:py-20 bg-gradient-to-br from-slate-50 via-white to-stone-50">
	<div class="container-main">
		<div class="relative rounded-3xl overflow-hidden">
			<!-- Background pattern -->
			<div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(148,163,184,0.1),transparent),radial-gradient(circle_at_70%_80%,rgba(187,197,207,0.1),transparent)]"></div>
			<div class="relative p-8 sm:p-12 md:p-16 text-center">
				<div class="max-w-3xl mx-auto">
					<h2 class="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
						Discover the Art of <span class="italic">Thoughtful</span> Shopping
					</h2>
					<p class="text-lg text-slate-600 mb-8 leading-relaxed">
						We believe in quality over quantity, craftsmanship over mass production,
						and stories over statistics. Join a community that values the journey as much as the destination.
					</p>
					<div class="flex flex-col sm:flex-row gap-4 justify-center">
						<a href="/products" class="inline-flex items-center px-8 py-4 bg-slate-900 text-white font-medium rounded-xl transition-all hover:bg-slate-800 transform hover:translate-y-[-3px] hover:shadow-2xl shadow-xl">
							<span>Begin Your Journey</span>
							<svg class="ml-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
							</svg>
						</a>
						<a href="/about" class="inline-flex items-center px-8 py-4 text-slate-600 font-medium border-2 border-slate-200 rounded-xl transition-all hover:border-slate-300 hover:text-slate-700 transform hover:translate-y-[-3px]">
							<span>Learn Our Philosophy</span>
						</a>
					</div>
					<div class="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500">
						
				
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

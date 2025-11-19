<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;

	let cartItems = data.cartItems || [];
	let total = data.total || 0;
	let isProcessing = false;
	let shippingAddress = '';
	let paymentMethod = 'credit_card';

	async function updateQuantity(itemId: number, newQuantity: number) {
		if (newQuantity < 1) return;
		
		try {
			const response = await fetch(`/api/cart/${itemId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ quantity: newQuantity })
			});

			if (response.ok) {
				// Reload page to get updated cart
				window.location.reload();
			} else {
				alert('Failed to update quantity');
			}
		} catch (error) {
			console.error('Error updating quantity:', error);
			alert('Failed to update quantity');
		}
	}

	async function removeItem(itemId: number) {
		if (!confirm('Remove this item from cart?')) return;
		
		try {
			const response = await fetch(`/api/cart/${itemId}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				window.location.reload();
			} else {
				alert('Failed to remove item');
			}
		} catch (error) {
			console.error('Error removing item:', error);
			alert('Failed to remove item');
		}
	}

	async function checkout() {
		if (!shippingAddress.trim()) {
			alert('Please enter a shipping address');
			return;
		}

		isProcessing = true;
		
		try {
			const response = await fetch('/api/orders', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					shipping_address: shippingAddress,
					payment_method: paymentMethod
				})
			});

			if (response.ok) {
				alert('Order placed successfully!');
				goto('/orders');
			} else {
				const error = await response.json();
				alert(error.error || 'Failed to place order');
			}
		} catch (error) {
			console.error('Error placing order:', error);
			alert('Failed to place order');
		} finally {
			isProcessing = false;
		}
	}
</script>

<svelte:head>
	<title>Your Collection - Dzungli Curated Goods</title>
	<meta name="description" content="Review and complete your purchase of hand-curated pieces selected with care." />
</svelte:head>

<section class="py-12 sm:py-16">
	<div class="container-main">
		<div class="text-center mb-12">
			<h1 class="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
				Your <span class="bg-gradient-to-r from-slate-900 to-stone-700 bg-clip-text text-transparent">Curated</span> Collection
			</h1>
			<p class="text-lg text-slate-600">Review your selected pieces and complete your journey</p>
		</div>

		{#if data.needsLogin}
			<div class="text-center py-16">
				<div class="bg-slate-50 rounded-3xl p-12 max-w-md mx-auto">
					<div class="mb-6 bg-slate-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
						<svg class="h-10 w-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
						</svg>
					</div>
					<h2 class="text-2xl font-bold text-slate-900 mb-4">Welcome Back</h2>
					<p class="text-slate-600 mb-6">Log in to view your curated collection and continue your journey with us</p>
					<a href="/account" class="inline-flex items-center px-8 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-all transform hover:translate-y-[-2px]">
						Sign In to Continue
					</a>
				</div>
			</div>
		{:else if cartItems.length === 0}
			<div class="text-center py-16">
				<div class="bg-gradient-to-br from-slate-50 to-stone-50 rounded-3xl p-12 max-w-md mx-auto border border-slate-100">
					<div class="mb-6 bg-slate-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
						<svg class="h-10 w-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
						</svg>
					</div>
					<h2 class="text-2xl font-bold text-slate-900 mb-4">Your Collection Awaits</h2>
					<p class="text-slate-600 mb-6">Your curated collection is empty. Let's find the perfect pieces for your story.</p>
					<a href="/products" class="inline-flex items-center px-8 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-all transform hover:translate-y-[-2px]">
						<span>Discover Collections</span>
						<svg class="ml-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
						</svg>
					</a>
				</div>
			</div>
		{:else}
			<div class="grid gap-8 lg:grid-cols-3">
				<!-- Curated Items -->
				<div class="lg:col-span-2 space-y-6">
					<div class="text-sm text-slate-600 mb-4">
						{data.itemCount} piece{data.itemCount === 1 ? '' : 's'} selected for your journey
					</div>
					{#each cartItems as item (item.id)}
						<div class="group cursor-pointer">
							<div class="relative bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
								<div class="flex gap-6">
									<div class="relative flex-shrink-0">
										<img
											src={item.image}
											alt={item.name}
											class="h-24 w-24 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
										/>
										{#if item.quantity >= item.stockQuantity}
											<div class="absolute -top-2 -right-2 bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
												Low Stock
											</div>
										{/if}
									</div>
									<div class="flex-1 space-y-3">
										<div class="flex items-start justify-between">
											<div class="flex-1">
												<h3 class="text-lg font-semibold text-slate-900 mb-1 group-hover:text-slate-800 transition-colors">{item.name}</h3>
												<p class="text-sm text-slate-600">${item.price.toFixed(2)} per piece</p>
											</div>
											<div class="text-right">
												<p class="text-xl font-bold text-slate-900">
													${(item.price * item.quantity).toFixed(2)}
												</p>
											</div>
										</div>
										
										<!-- Quantity Controls -->
										<div class="flex items-center justify-between">
											<div class="flex items-center gap-4">
												<div class="flex items-center gap-3">
													<button
														on:click={() => updateQuantity(item.id, item.quantity - 1)}
														disabled={item.quantity <= 1}
														class="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
													>
														<svg class="h-4 w-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
														</svg>
													</button>
													<span class="w-8 text-center font-medium text-slate-900">{item.quantity}</span>
													<button
														on:click={() => updateQuantity(item.id, item.quantity + 1)}
														disabled={item.quantity >= item.stockQuantity}
														class="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
													>
														<svg class="h-4 w-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m7-7H5" />
														</svg>
													</button>
												</div>
												<button
													on:click={() => removeItem(item.id)}
													class="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
												>
													Remove
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>

				<!-- Order Summary -->
				<div class="lg:col-span-1">
					<div class="sticky top-24 space-y-6">
						<div class="bg-white border border-slate-100 rounded-2xl p-6">
							<h2 class="text-xl font-bold text-slate-900 mb-4">Collection Summary</h2>
							
							<div class="space-y-3 border-b border-slate-100 pb-4 mb-4">
								<div class="flex justify-between text-slate-600">
									<span>Subtotal ({data.itemCount} piece{data.itemCount === 1 ? '' : 's'})</span>
									<span>${total.toFixed(2)}</span>
								</div>
								<div class="flex justify-between text-slate-600">
									<span>Shipping</span>
									<span class="text-emerald-600 font-medium">Free</span>
								</div>
							</div>

							<div class="flex justify-between text-lg font-bold text-slate-900 mb-6 border-t border-slate-100 pt-4">
								<span>Total Investment</span>
								<span>${total.toFixed(2)}</span>
							</div>

							<form on:submit|preventDefault={checkout} class="space-y-6">
								<div>
									<label for="address" class="block text-sm font-medium text-slate-700 mb-3">
										📍 Shipping Address
									</label>
									<textarea
										id="address"
										bind:value={shippingAddress}
										placeholder="Where shall we send your curated pieces?"
										class="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all resize-none"
										required
									></textarea>
								</div>

								<div>
									<label for="payment" class="block text-sm font-medium text-slate-700 mb-3">
										💳 Payment Method
									</label>
									<select id="payment" bind:value={paymentMethod} class="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all">
										<option value="credit_card">Credit Card</option>
										<option value="debit_card">Debit Card</option>
										<option value="paypal">PayPal</option>
										<option value="bank_transfer">Bank Transfer</option>
									</select>
								</div>

								<button
									on:click={checkout}
									disabled={isProcessing}
									class="w-full py-4 px-6 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:translate-y-[-2px] shadow-lg"
								>
									{isProcessing ? 'Processing...' : '✨ Complete Your Collection'}
								</button>
							</form>

							<div class="mt-4 text-center">
								<a href="/products" class="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-700 transition-colors">
									<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
									</svg>
									Continue Discovering
								</a>
							</div>
						</div>

						<!-- Trust Badges -->
						<div class="bg-gradient-to-r from-slate-50 to-stone-50 rounded-xl p-6 text-center">
							<div class="grid gap-4 text-sm">
								<div class="flex items-center justify-center gap-2 text-slate-600">
									<svg class="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414z" />
									</svg>
									<span>Secure Checkout</span>
								</div>
								<div class="flex items-center justify-center gap-2 text-slate-600">
									<svg class="h-4 w-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M10 3a1 1 0 00-1 1v5.586L6.293 6.88a1 1 0 00-1.414 1.414l3.586 3.586a1 1 0 001.414 0L13.707 9.758a1 1 0 001.414-1.414L10.414 6.586V4a1 1 0 00-1-1zm0 9a1 1 0 00-1 1h1v1a1 1 0 001 1h-1v-1zm0-2a1 1 0 00-1 1h1v-1a1 1 0 00-1 1v1z" />
									</svg>
									<span>Hassle-Free Returns</span>
								</div>
								<div class="flex items-center justify-center gap-2 text-slate-600">
									<svg class="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .555-.448 1-1 1H9c-.552 0-1-.445-1-1s.448-1 1-1 1h6c.552 0 1 .445 1 1zm-1-7a1 1 0 011 0v1a1 1 0 01-1 0V6zM9 8a1 1 0 011 0V7a1 1 0 01-1 0v1zm1 13a1 1 0 011 0v1a1 1 0 01-1 0v-1z" />
									</svg>
									<span>Worldwide Shipping</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</section>

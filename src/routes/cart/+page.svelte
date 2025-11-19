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
	<title>Shopping Cart - StoreHub</title>
	<meta name="description" content="View and manage your shopping cart." />
</svelte:head>

<section class="py-8 sm:py-12">
	<div class="container-main">
		<h1 class="section-title mb-8">Shopping Cart</h1>

		{#if data.needsLogin}
			<div class="card text-center py-12">
				<svg class="mx-auto mb-4 h-16 w-16 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
				</svg>
				<h2 class="text-xl font-semibold text-neutral-900 mb-4">Please log in to view your cart</h2>
				<a href="/account" class="btn-primary inline-block">
					Login / Register
				</a>
			</div>
		{:else if cartItems.length === 0}
			<div class="card text-center py-12">
				<svg class="mx-auto mb-4 h-16 w-16 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
				</svg>
				<h2 class="text-xl font-semibold text-neutral-900 mb-4">Your cart is empty</h2>
				<p class="text-neutral-600 mb-6">Start shopping to add items to your cart</p>
				<a href="/products" class="btn-primary inline-block">
					Browse Products
				</a>
			</div>
		{:else}
			<div class="grid gap-8 lg:grid-cols-3">
				<!-- Cart Items -->
				<div class="lg:col-span-2 space-y-4">
					{#each cartItems as item (item.id)}
						<div class="card flex gap-4">
							<img
								src={item.image}
								alt={item.name}
								class="h-24 w-24 rounded-lg object-cover"
							/>
							<div class="flex-1">
								<h3 class="text-lg font-semibold text-neutral-900">{item.name}</h3>
								<p class="text-sm text-neutral-600 mt-1">${item.price.toFixed(2)} each</p>
								
								<div class="mt-3 flex items-center gap-4">
									<div class="flex items-center gap-2">
										<button
											on:click={() => updateQuantity(item.id, item.quantity - 1)}
											class="btn-outline btn-sm px-3 py-1"
											disabled={item.quantity <= 1}
										>
											-
										</button>
										<span class="w-12 text-center font-semibold">{item.quantity}</span>
										<button
											on:click={() => updateQuantity(item.id, item.quantity + 1)}
											class="btn-outline btn-sm px-3 py-1"
											disabled={item.quantity >= item.stockQuantity}
										>
											+
										</button>
									</div>
									<button
										on:click={() => removeItem(item.id)}
										class="text-sm text-red-600 hover:text-red-700"
									>
										Remove
									</button>
								</div>
							</div>
							<div class="text-right">
								<p class="text-xl font-bold text-primary-600">
									${(item.price * item.quantity).toFixed(2)}
								</p>
								{#if item.quantity >= item.stockQuantity}
									<p class="text-xs text-red-600 mt-1">Max stock reached</p>
								{/if}
							</div>
						</div>
					{/each}
				</div>

				<!-- Order Summary & Checkout -->
				<div class="lg:col-span-1">
					<div class="card sticky top-24">
						<h2 class="text-xl font-semibold text-neutral-900 mb-4">Order Summary</h2>
						
						<div class="space-y-3 border-b border-neutral-200 pb-4 mb-4">
							<div class="flex justify-between text-neutral-600">
								<span>Subtotal ({data.itemCount} items)</span>
								<span>${total.toFixed(2)}</span>
							</div>
							<div class="flex justify-between text-neutral-600">
								<span>Shipping</span>
								<span>Free</span>
							</div>
						</div>

						<div class="flex justify-between text-lg font-bold text-neutral-900 mb-6">
							<span>Total</span>
							<span>${total.toFixed(2)}</span>
						</div>

						<div class="mb-4">
							<label for="address" class="block text-sm font-semibold text-neutral-900 mb-2">
								Shipping Address
							</label>
							<textarea
								id="address"
								bind:value={shippingAddress}
								placeholder="Enter your shipping address..."
								class="input-field min-h-[80px]"
								required
							></textarea>
						</div>

						<div class="mb-6">
							<label for="payment" class="block text-sm font-semibold text-neutral-900 mb-2">
								Payment Method
							</label>
							<select id="payment" bind:value={paymentMethod} class="input-field">
								<option value="credit_card">Credit Card</option>
								<option value="debit_card">Debit Card</option>
								<option value="paypal">PayPal</option>
								<option value="bank_transfer">Bank Transfer</option>
							</select>
						</div>

						<button
							on:click={checkout}
							class="btn-primary w-full"
							disabled={isProcessing}
						>
							{isProcessing ? 'Processing...' : 'Proceed to Checkout'}
						</button>

						<a href="/products" class="btn-outline mt-3 w-full text-center">
							Continue Shopping
						</a>
					</div>
				</div>
			</div>
		{/if}
	</div>
</section>

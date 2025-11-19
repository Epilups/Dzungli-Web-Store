<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const statusColors: Record<string, string> = {
		pending: 'badge-warning',
		confirmed: 'badge-primary',
		payment_pending: 'badge-warning',
		payment_received: 'badge-success',
		delivered: 'badge-success',
		canceled: 'badge-error'
	};

	const statusLabels: Record<string, string> = {
		pending: 'Pending',
		confirmed: 'Confirmed',
		payment_pending: 'Payment Pending',
		payment_received: 'Payment Received',
		delivered: 'Delivered',
		canceled: 'Canceled'
	};

	function formatDate(date: Date): string {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	let reviewFormVisible: { [key: string]: boolean } = {};
	let reviewRating: { [key: string]: number } = {};
	let reviewComment: { [key: string]: string } = {};
	let submitting: { [key: string]: boolean } = {};

	function toggleReviewForm(orderId: number, productId: number) {
		const key = `${orderId}-${productId}`;
		reviewFormVisible[key] = !reviewFormVisible[key];
		if (!reviewRating[key]) {
			reviewRating[key] = 5;
		}
	}

	async function submitReview(orderId: number, productId: number, existingRating?: number, existingComment?: string) {
		const key = `${orderId}-${productId}`;
		
		// Pre-fill form if editing
		if (existingRating && !reviewRating[key]) {
			reviewRating[key] = existingRating;
			reviewComment[key] = existingComment || '';
		}
		
		if (!reviewFormVisible[key]) {
			toggleReviewForm(orderId, productId);
			return;
		}

		submitting[key] = true;

		try {
			const response = await fetch('/api/reviews', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					productId,
					orderId,
					rating: reviewRating[key],
					comment: reviewComment[key] || ''
				})
			});

			if (response.ok) {
				alert('Review submitted successfully!');
				reviewFormVisible[key] = false;
				// Reload page to show updated review
				window.location.reload();
			} else {
				const error = await response.json();
				alert(error.error || 'Failed to submit review');
			}
		} catch (error) {
			console.error('Error submitting review:', error);
			alert('Failed to submit review');
		} finally {
			submitting[key] = false;
		}
	}
</script>

<svelte:head>
	<title>My Orders - StoreHub</title>
	<meta name="description" content="View and track your orders." />
</svelte:head>

<section class="py-8 sm:py-12">
	<div class="container-main">
		<h1 class="section-title mb-8">My Orders</h1>

		{#if data.orders.length === 0}
			<div class="card text-center py-12">
				<svg class="mx-auto mb-4 h-16 w-16 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
				</svg>
				<h2 class="text-xl font-semibold text-neutral-900 mb-4">No orders yet</h2>
				<p class="text-neutral-600 mb-6">Start shopping to place your first order</p>
				<a href="/products" class="btn-primary inline-block">
					Browse Products
				</a>
			</div>
		{:else}
			<div class="space-y-6">
				{#each data.orders as order (order.id)}
					<div class="card">
						<!-- Order Header -->
						<div class="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 pb-4">
							<div>
								<div class="flex items-center gap-3">
									<h2 class="text-2xl font-bold text-neutral-900">
										Order #{order.id}
									</h2>
									<span class="badge {statusColors[order.status]}">
										{statusLabels[order.status]}
									</span>
								</div>
								<p class="text-sm text-neutral-600 mt-1">
									{formatDate(order.createdAt)}
								</p>
							</div>
							<div class="text-right">
								<p class="text-sm text-neutral-600">Total Amount</p>
								<p class="text-2xl font-bold text-primary-600">
									${order.totalAmount.toFixed(2)}
								</p>
							</div>
						</div>

						<!-- Order Items -->
						<div class="mb-6">
							<h3 class="text-lg font-semibold text-neutral-900 mb-4">Order Items</h3>
							<div class="space-y-3">
								{#each order.items as item}
									<div class="rounded-lg border border-neutral-200 p-3">
										<div class="flex items-center gap-4">
											<img
												src={item.productImage}
												alt={item.productName}
												class="h-16 w-16 rounded-lg object-cover"
											/>
											<div class="flex-1">
												<h4 class="font-medium text-neutral-900">
													{item.productName}
												</h4>
												<p class="text-sm text-neutral-600">
													Quantity: {item.quantity} × ${item.priceAtTime.toFixed(2)}
												</p>
											</div>
											<p class="text-lg font-semibold text-neutral-900">
												${(item.quantity * item.priceAtTime).toFixed(2)}
											</p>
										</div>

										<!-- Review Section for Delivered Orders -->
										{#if order.status === 'delivered'}
											<div class="mt-3 border-t border-neutral-200 pt-3">
												{#if item.hasReview}
													<!-- Show existing review -->
													<div class="mb-2">
														<div class="flex items-center gap-2 mb-1">
															<span class="text-sm font-semibold text-neutral-900">Your Review:</span>
															<div class="flex">
																{#each Array(5) as _, i}
																	<svg
																		class={`h-4 w-4 ${i < item.existingRating ? 'text-yellow-400' : 'text-neutral-300'}`}
																		fill="currentColor"
																		viewBox="0 0 20 20"
																	>
																		<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
																	</svg>
																{/each}
															</div>
														</div>
														{#if item.existingComment}
															<p class="text-sm text-neutral-600">{item.existingComment}</p>
														{/if}
													</div>
													<button
														on:click={() => submitReview(order.id, item.productId, item.existingRating, item.existingComment)}
														class="btn-outline btn-sm"
													>
														Edit Review
													</button>
												{:else}
													<!-- Show review button -->
													<button
														on:click={() => submitReview(order.id, item.productId)}
														class="btn-primary btn-sm"
													>
														Write a Review
													</button>
												{/if}

												<!-- Review Form -->
												{#if reviewFormVisible[`${order.id}-${item.productId}`]}
													<div class="mt-3 space-y-3 bg-neutral-50 p-3 rounded-lg">
														<div>
															<label class="block text-sm font-semibold text-neutral-900 mb-2">
																Rating
															</label>
															<div class="flex gap-1">
																{#each Array(5) as _, i}
																	<button
																		type="button"
																		on:click={() => reviewRating[`${order.id}-${item.productId}`] = i + 1}
																		class="focus:outline-none"
																	>
																		<svg
																			class={`h-8 w-8 ${i < (reviewRating[`${order.id}-${item.productId}`] || 0) ? 'text-yellow-400' : 'text-neutral-300'} hover:text-yellow-400`}
																			fill="currentColor"
																			viewBox="0 0 20 20"
																		>
																			<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
																		</svg>
																	</button>
																{/each}
															</div>
														</div>
														<div>
															<label for="comment-{order.id}-{item.productId}" class="block text-sm font-semibold text-neutral-900 mb-2">
																Comment (optional)
															</label>
															<textarea
																id="comment-{order.id}-{item.productId}"
																bind:value={reviewComment[`${order.id}-${item.productId}`]}
																rows="3"
																placeholder="Share your experience with this product..."
																class="input-field"
															></textarea>
														</div>
														<div class="flex gap-2">
															<button
																on:click={() => submitReview(order.id, item.productId)}
																disabled={submitting[`${order.id}-${item.productId}`]}
																class="btn-primary btn-sm disabled:opacity-50"
															>
																{submitting[`${order.id}-${item.productId}`] ? 'Submitting...' : 'Submit Review'}
															</button>
															<button
																on:click={() => toggleReviewForm(order.id, item.productId)}
																class="btn-outline btn-sm"
															>
																Cancel
															</button>
														</div>
													</div>
												{/if}
											</div>
										{/if}
									</div>
								{/each}
							</div>
						</div>

						<!-- Order Details -->
						<div class="grid gap-4 border-t border-neutral-200 pt-4 sm:grid-cols-2">
							<div>
								<p class="text-sm font-semibold text-neutral-900 mb-1">Shipping Address</p>
								<p class="text-sm text-neutral-600 whitespace-pre-line">
									{order.shippingAddress}
								</p>
							</div>
							<div>
								<p class="text-sm font-semibold text-neutral-900 mb-1">Payment Method</p>
								<p class="text-sm text-neutral-600">
									{order.paymentMethod.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
								</p>
							</div>
						</div>

						<!-- Order Actions -->
						{#if order.status === 'pending' || order.status === 'confirmed'}
							<div class="mt-4 flex gap-3 border-t border-neutral-200 pt-4">
								<a href="/account" class="btn-outline btn-sm">
									Contact Support
								</a>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		<!-- Back to Account -->
		<div class="mt-8 text-center">
			<a href="/account" class="text-primary-600 hover:text-primary-700">
				← Back to Account
			</a>
		</div>
	</div>
</section>

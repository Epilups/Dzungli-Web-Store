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
	<title>My Journey - Dzungli Curated Goods</title>
	<meta name="description" content="Track your curated collection journey and share your experience." />
</svelte:head>

<section class="py-12 sm:py-16">
	<div class="container-main">
		<div class="text-center mb-12">
			<h1 class="text-3xl font-bold text-slate-900 mb-4">My Curated Journey</h1>
			<p class="text-lg text-slate-600">Track your collection and share your experience with each piece</p>
		</div>

		{#if data.orders.length === 0}
			<div class="text-center py-16">
				<div class="bg-gradient-to-br from-slate-50 to-stone-50 rounded-3xl p-12 max-w-md mx-auto border border-slate-100">
					<div class="mb-6 bg-slate-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
						<svg class="h-10 w-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
					</div>
					<h2 class="text-2xl font-bold text-slate-900 mb-4">Your Journey Awaits</h2>
					<p class="text-slate-600 mb-6">Start curating your collection with hand-selected pieces</p>
					<a href="/products" class="inline-flex items-center px-8 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-all transform hover:translate-y-[-2px]">
						<span>Begin Curating</span>
						<svg class="ml-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
						</svg>
					</a>
				</div>
			</div>
		{:else}
			<div class="space-y-8">
				{#each data.orders as order (order.id)}
					<div class="bg-white border border-slate-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
						<!-- Order Header -->
						<div class="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6">
							<div>
								<div class="flex items-center gap-4 mb-3">
									<h2 class="text-2xl font-bold text-slate-900">
										📦 Order #{order.id}
									</h2>
									<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
										{order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
										 order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
										 order.status === 'payment_pending' ? 'bg-orange-100 text-orange-700' :
										 order.status === 'payment_received' ? 'bg-emerald-100 text-emerald-700' :
										 order.status === 'delivered' ? 'bg-indigo-100 text-indigo-700' :
										 'bg-red-100 text-red-700'}">
										{statusLabels[order.status]}
									</span>
								</div>
								<p class="text-sm text-slate-600">
									📅 {formatDate(order.createdAt)}
								</p>
							</div>
							<div class="text-right">
								<p class="text-sm text-slate-500">Total Investment</p>
								<p class="text-2xl font-bold text-slate-900">
									${order.totalAmount.toFixed(2)}
								</p>
							</div>
						</div>

						<!-- Order Items -->
						<div class="mb-8">
							<h3 class="text-lg font-semibold text-slate-900 mb-6">📦 Curated Pieces</h3>
							<div class="space-y-6">
								{#each order.items as item}
									<div class="group cursor-pointer">
										<div class="rounded-xl border border-slate-100 p-4 hover:shadow-md transition-all duration-300">
											<div class="flex items-center gap-6">
												<img
													src={item.productImage}
													alt={item.productName}
													class="h-20 w-20 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
												/>
												<div class="flex-1">
													<h4 class="font-semibold text-slate-900 mb-1 group-hover:text-slate-800 transition-colors">
														{item.productName}
													</h4>
													<p class="text-sm text-slate-600">
														🔢 Quantity: {item.quantity} × ${item.priceAtTime.toFixed(2)}
													</p>
												</div>
												<div class="text-right">
													<p class="text-lg font-semibold text-slate-900">
														${(item.quantity * item.priceAtTime).toFixed(2)}
													</p>
												</div>
											</div>

											<!-- Review Section for Delivered Orders -->
											{#if order.status === 'delivered'}
												<div class="mt-4 border-t border-slate-100 pt-4">
													{#if item.hasReview}
														<!-- Show existing review -->
														<div class="mb-3">
															<div class="flex items-center gap-2 mb-2">
																<span class="text-sm font-medium text-slate-700">Your Experience:</span>
																<div class="flex">
																	{#each Array(5) as _, i}
																		<svg
																			class={`h-4 w-4 ${i < item.existingRating ? 'text-amber-400' : 'text-slate-300'}`}
																			fill="currentColor"
																			viewBox="0 0 20 20"
																		>
																			<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
																		</svg>
																	{/each}
																</div>
															</div>
															{#if item.existingComment}
																<p class="text-sm text-slate-600 italic">"{item.existingComment}"</p>
															{/if}
														</div>
														<button
															on:click={() => submitReview(order.id, item.productId, item.existingRating, item.existingComment)}
															class="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:border-slate-300 hover:text-slate-700 transition-all"
														>
															✏️ Edit Experience
														</button>
													{:else}
														<!-- Show review button -->
														<button
															on:click={() => submitReview(order.id, item.productId)}
															class="inline-flex items-center px-4 py-2 text-sm font-medium text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-all"
														>
															🌟 Share Your Experience
														</button>
													{/if}

													<!-- Review Form -->
													{#if reviewFormVisible[`${order.id}-${item.productId}`]}
														<div class="mt-4 space-y-4 bg-slate-50 rounded-xl p-4">
															<div>
																<label for="rating-{order.id}-{item.productId}" class="block text-sm font-medium text-slate-700 mb-3">
																	Rate Your Experience
																</label>
																<div class="flex gap-2">
																	{#each Array(5) as _, i}
																		<button
																			id="rating-{order.id}-{item.productId}"
																			type="button"
																			aria-label="Rate {item.productName} {i + 1} stars"
																			on:click={() => reviewRating[`${order.id}-${item.productId}`] = i + 1}
																			class="focus:outline-none"
																		>
																			<svg
																				class={`h-6 w-6 ${i < (reviewRating[`${order.id}-${item.productId}`] || 0) ? 'text-amber-400' : 'text-slate-300'} hover:text-amber-400`}
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
																<label for="comment-{order.id}-{item.productId}" class="block text-sm font-medium text-slate-700 mb-3">
																	Share Your Thoughts (optional)
																</label>
																<textarea
																	id="comment-{order.id}-{item.productId}"
																	bind:value={reviewComment[`${order.id}-${item.productId}`]}
																	rows="3"
																	placeholder="How did this piece enhance your life?..."
																	class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all resize-none"
																></textarea>
															</div>
															<div class="flex gap-3">
																<button
																	on:click={() => submitReview(order.id, item.productId)}
																	disabled={submitting[`${order.id}-${item.productId}`]}
																	class="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
																>
																	{submitting[`${order.id}-${item.productId}`] ? 'Submitting...' : '✨ Share Experience'}
																</button>
																<button
																	on:click={() => toggleReviewForm(order.id, item.productId)}
																	class="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:border-slate-300 hover:text-slate-700 transition-all"
																>
																	🚫 Cancel
																</button>
															</div>
														</div>
													{/if}
												</div>
											{/if}
										</div>
									</div>
								{/each}
							</div>
						</div>

						<!-- Order Details -->
						<div class="grid gap-6 border-t border-slate-100 pt-6">
							<div class="space-y-2">
								<p class="text-sm font-medium text-slate-700">📍 Shipping Address</p>
								<p class="text-sm text-slate-600 whitespace-pre-line">
									{order.shippingAddress}
								</p>
							</div>
							<div class="space-y-2">
								<p class="text-sm font-medium text-slate-700">💳 Payment Method</p>
								<p class="text-sm text-slate-600">
									{order.paymentMethod.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
								</p>
							</div>
						</div>

						<!-- Order Actions -->
						{#if order.status === 'pending' || order.status === 'confirmed'}
							<div class="mt-6 flex justify-end">
								<a href="/account" class="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:border-slate-300 hover:text-slate-700 transition-all">
									🤝 Contact Support
								</a>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		<!-- Back to Account -->
		<div class="mt-12 text-center">
			<a href="/account" class="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-700 transition-colors">
				← Back to Your Account
			</a>
		</div>
	</div>
</section>

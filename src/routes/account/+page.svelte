<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;

	let showLoginForm = true;
	let email = '';
	let password = '';
	let firstName = '';
	let lastName = '';
	let isProcessing = false;

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

	async function handleLogin() {
		if (!email || !password) {
			alert('Please enter email and password');
			return;
		}

		isProcessing = true;

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});

			if (response.ok) {
				window.location.reload();
			} else {
				const error = await response.json();
				alert(error.error || 'Login failed');
			}
		} catch (error) {
			console.error('Login error:', error);
			alert('Login failed');
		} finally {
			isProcessing = false;
		}
	}

	async function handleRegister() {
		if (!email || !password) {
			alert('Please enter email and password');
			return;
		}

		isProcessing = true;

		try {
			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password, firstName, lastName })
			});

			if (response.ok) {
				window.location.reload();
			} else {
				const error = await response.json();
				alert(error.error || 'Registration failed');
			}
		} catch (error) {
			console.error('Registration error:', error);
			alert('Registration failed');
		} finally {
			isProcessing = false;
		}
	}

	async function handleLogout() {
		try {
			await fetch('/api/auth/logout', { method: 'POST' });
			window.location.reload();
		} catch (error) {
			console.error('Logout error:', error);
		}
	}

	function formatDate(date: Date): string {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>My Account - Dzungli</title>
	<meta name="description" content="Manage your account settings and view orders." />
</svelte:head>

<section class="py-8 sm:py-12">
	<div class="container-main">
		{#if !data.user}
			<div class="mx-auto max-w-md">
				<h1 class="section-title mb-8 text-center">
					{showLoginForm ? 'Login' : 'Create Account'}
				</h1>

				<div class="card">
					{#if showLoginForm}
						<!-- Login Form -->
						<form on:submit|preventDefault={handleLogin} class="space-y-4">
							<div>
								<label for="email" class="block text-sm font-semibold text-neutral-900 mb-2">
									Email
								</label>
								<input
									id="email"
									type="email"
									bind:value={email}
									placeholder="your@email.com"
									class="input-field"
									required
								/>
							</div>

							<div>
								<label for="password" class="block text-sm font-semibold text-neutral-900 mb-2">
									Password
								</label>
								<input
									id="password"
									type="password"
									bind:value={password}
									placeholder="••••••••"
									class="input-field"
									required
								/>
							</div>

							<button type="submit" class="btn-primary w-full" disabled={isProcessing}>
								{isProcessing ? 'Logging in...' : 'Login'}
							</button>
						</form>

						<div class="mt-4 text-center">
							<button
								on:click={() => (showLoginForm = false)}
								class="text-sm text-primary-600 hover:text-primary-700"
							>
								Don't have an account? Register
							</button>
						</div>
					{:else}
						<!-- Register Form -->
						<form on:submit|preventDefault={handleRegister} class="space-y-4">
							<div class="grid gap-4 sm:grid-cols-2">
								<div>
									<label for="firstName" class="block text-sm font-semibold text-neutral-900 mb-2">
										First Name
									</label>
									<input
										id="firstName"
										type="text"
										bind:value={firstName}
										placeholder="John"
										class="input-field"
									/>
								</div>

								<div>
									<label for="lastName" class="block text-sm font-semibold text-neutral-900 mb-2">
										Last Name
									</label>
									<input
										id="lastName"
										type="text"
										bind:value={lastName}
										placeholder="Doe"
										class="input-field"
									/>
								</div>
							</div>

							<div>
								<label for="regEmail" class="block text-sm font-semibold text-neutral-900 mb-2">
									Email
								</label>
								<input
									id="regEmail"
									type="email"
									bind:value={email}
									placeholder="your@email.com"
									class="input-field"
									required
								/>
							</div>

							<div>
								<label for="regPassword" class="block text-sm font-semibold text-neutral-900 mb-2">
									Password
								</label>
								<input
									id="regPassword"
									type="password"
									bind:value={password}
									placeholder="••••••••"
									class="input-field"
									required
									minlength="6"
								/>
							</div>

							<button type="submit" class="btn-primary w-full" disabled={isProcessing}>
								{isProcessing ? 'Creating account...' : 'Create Account'}
							</button>
						</form>

						<div class="mt-4 text-center">
							<button
								on:click={() => (showLoginForm = true)}
								class="text-sm text-primary-600 hover:text-primary-700"
							>
								Already have an account? Login
							</button>
						</div>
					{/if}
				</div>
			</div>
		{:else}
			<!-- Account Dashboard -->
			<div class="mb-8 flex items-center justify-between">
				<div>
					<h1 class="section-title">My Account</h1>
					<p class="mt-2 text-neutral-600">
						Welcome back, {data.user.firstName || data.user.email}!
					</p>
				</div>
				<button on:click={handleLogout} class="btn-outline">
					Logout
				</button>
			</div>

			<div class="grid gap-8 lg:grid-cols-3">
				<!-- Account Info -->
				<div class="lg:col-span-1">
					<div class="card">
						<h2 class="text-xl font-semibold text-neutral-900 mb-4">Account Information</h2>
						<div class="space-y-3">
							<div>
								<p class="text-sm text-neutral-600">Email</p>
								<p class="font-medium text-neutral-900">{data.user.email}</p>
							</div>
							{#if data.user.firstName || data.user.lastName}
								<div>
									<p class="text-sm text-neutral-600">Name</p>
									<p class="font-medium text-neutral-900">
										{data.user.firstName || ''} {data.user.lastName || ''}
									</p>
								</div>
							{/if}
							{#if data.user.isAdmin}
								<div class="pt-3 border-t border-neutral-200">
									<span class="badge-primary">Admin Account</span>
									<a href="/admin" class="mt-3 block text-sm text-primary-600 hover:text-primary-700">
										Go to Admin Dashboard →
									</a>
								</div>
							{/if}
						</div>
					</div>
				</div>

				<!-- Orders -->
				<div class="lg:col-span-2">
					<h2 class="text-xl font-semibold text-neutral-900 mb-4">Order History</h2>
					
					{#if data.orders.length === 0}
						<div class="card text-center py-12">
							<svg class="mx-auto mb-4 h-16 w-16 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
							<p class="text-neutral-600">No orders yet</p>
							<a href="/products" class="btn-primary mt-4 inline-block">
								Start Shopping
							</a>
						</div>
					{:else}
						<div class="space-y-4">
							{#each data.orders as order (order.id)}
								<div class="card">
									<div class="mb-4 flex items-start justify-between">
										<div>
											<p class="text-sm text-neutral-600">Order #{order.id}</p>
											<p class="text-lg font-semibold text-neutral-900 mt-1">
												${order.totalAmount.toFixed(2)}
											</p>
										</div>
										<div class="text-right">
											<span class="badge {statusColors[order.status]}">
												{statusLabels[order.status]}
											</span>
											<p class="text-sm text-neutral-600 mt-1">
												{formatDate(order.createdAt)}
											</p>
										</div>
									</div>

									<div class="border-t border-neutral-200 pt-4">
										<p class="text-sm font-semibold text-neutral-900 mb-2">Items:</p>
										<div class="space-y-2">
											{#each order.items as item}
												<div class="flex items-center gap-3">
													<img
														src={item.productImage}
														alt={item.productName}
														class="h-12 w-12 rounded object-cover"
													/>
													<div class="flex-1">
														<p class="text-sm font-medium text-neutral-900">
															{item.productName}
														</p>
														<p class="text-xs text-neutral-600">
															Qty: {item.quantity} × ${item.priceAtTime.toFixed(2)}
														</p>
													</div>
													<p class="text-sm font-semibold text-neutral-900">
														${(item.quantity * item.priceAtTime).toFixed(2)}
													</p>
												</div>
											{/each}
										</div>
									</div>

									<div class="mt-4 pt-4 border-t border-neutral-200">
										<p class="text-sm text-neutral-600">
											<span class="font-semibold">Shipping:</span> {order.shippingAddress}
										</p>
										<p class="text-sm text-neutral-600 mt-1">
											<span class="font-semibold">Payment:</span> {order.paymentMethod.replace('_', ' ')}
										</p>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</section>

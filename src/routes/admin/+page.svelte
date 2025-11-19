<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	let activeTab: 'products' | 'orders' = 'products';
	let showProductForm = false;
	let editingProduct: any = null;

	// Product form fields
	let productName = '';
	let productDescription = '';
	let productPrice = 0;
	let productImage = '';
	let productCategory = 'electronics';
	let productStock = 0;

	const categories = ['electronics', 'fashion', 'home', 'sports'];

	const statusColors: Record<string, string> = {
		pending: 'badge-warning',
		confirmed: 'badge-primary',
		payment_pending: 'badge-warning',
		payment_received: 'badge-success',
		delivered: 'badge-success',
		canceled: 'badge-error'
	};

	function openProductForm(product?: any) {
		if (product) {
			editingProduct = product;
			productName = product.name;
			productDescription = product.description;
			productPrice = product.price;
			productImage = product.imageUrl;
			productCategory = product.category;
			productStock = product.stockQuantity;
		} else {
			editingProduct = null;
			productName = '';
			productDescription = '';
			productPrice = 0;
			productImage = '';
			productCategory = 'electronics';
			productStock = 0;
		}
		showProductForm = true;
	}

	async function saveProduct() {
		const productData = {
			name: productName,
			description: productDescription,
			price: productPrice,
			image_url: productImage,
			category: productCategory,
			stock_quantity: productStock
		};

		try {
			const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
			const method = editingProduct ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(productData)
			});

			if (response.ok) {
				alert(editingProduct ? 'Product updated!' : 'Product created!');
				window.location.reload();
			} else {
				alert('Failed to save product');
			}
		} catch (error) {
			console.error('Error saving product:', error);
			alert('Failed to save product');
		}
	}

	async function toggleProductStatus(productId: number, currentStatus: boolean) {
		try {
			const response = await fetch(`/api/products/${productId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ is_active: !currentStatus })
			});

			if (response.ok) {
				window.location.reload();
			} else {
				alert('Failed to update product status');
			}
		} catch (error) {
			console.error('Error updating status:', error);
		}
	}

	async function deleteProduct(productId: number) {
		if (!confirm('Are you sure you want to delete this product?')) return;

		try {
			const response = await fetch(`/api/products/${productId}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				window.location.reload();
			} else {
				alert('Failed to delete product');
			}
		} catch (error) {
			console.error('Error deleting product:', error);
		}
	}

	async function updateOrderStatus(orderId: number, newStatus: string) {
		try {
			const response = await fetch(`/api/orders/${orderId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: newStatus })
			});

			if (response.ok) {
				window.location.reload();
			} else {
				alert('Failed to update order status');
			}
		} catch (error) {
			console.error('Error updating order:', error);
		}
	}
</script>

<svelte:head>
	<title>Collections Hub - Dzungli Curated Goods</title>
	<meta name="description" content="Curate and manage your hand-selected collection of timeless pieces." />
</svelte:head>

<section class="py-12 sm:py-16 bg-gradient-to-br from-slate-50 via-white to-stone-50 min-h-screen">
	<div class="container-main">
		<div class="mb-12 flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold text-slate-900 mb-2">Collections Hub</h1>
				<p class="text-slate-600">Curate your hand-selected pieces and manage orders</p>
			</div>
			<a href="/account" class="inline-flex items-center px-6 py-3 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:border-slate-300 hover:text-slate-700 transition-all">
				← Back to Account
			</a>
		</div>

		<!-- Navigation Tabs -->
		<div class="mb-8 flex gap-1 bg-slate-100 rounded-xl p-1">
			<button
				on:click={() => (activeTab = 'products')}
				class="flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all {activeTab === 'products'
					? 'bg-white text-slate-900 shadow-sm'
					: 'text-slate-600 hover:text-slate-700'}"
			>
				🎨 Collections ({data.products.length})
			</button>
			<button
				on:click={() => (activeTab = 'orders')}
				class="flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all {activeTab === 'orders'
					? 'bg-white text-slate-900 shadow-sm'
					: 'text-slate-600 hover:text-slate-700'}"
			>
			📦 Orders ({data.orders.length})
			</button>
		</div>

		{#if activeTab === 'products'}
			<!-- Collections Management -->
			<div class="mb-8 text-right">
				<button on:click={() => openProductForm()} class="inline-flex items-center px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-all transform hover:translate-y-[-2px]">
					<span class="mr-2">+</span> Add New Piece
				</button>
			</div>

			{#if showProductForm}
				<div class="bg-white border border-slate-100 rounded-2xl p-8 mb-8 shadow-lg">
					<h2 class="text-2xl font-bold text-slate-900 mb-6">
						{editingProduct ? '✨ Edit Curated Piece' : '➕ Add New Curated Piece'}
					</h2>
					<form on:submit|preventDefault={saveProduct} class="grid gap-6">
						<div class="grid gap-6 sm:grid-cols-2">
							<div class="sm:col-span-2">
								<label for="productName" class="block text-sm font-medium text-slate-700 mb-2">🎨 Piece Name</label>
								<input id="productName" type="text" bind:value={productName} class="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all" required />
							</div>
							<div class="sm:col-span-2">
								<label for="productDescription" class="block text-sm font-medium text-slate-700 mb-2">📝 Story & Description</label>
								<textarea id="productDescription" bind:value={productDescription} class="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all min-h-[120px] resize-none" placeholder="Tell the story of this piece..."></textarea>
							</div>
							<div>
								<label for="productPrice" class="block text-sm font-medium text-slate-700 mb-2">💰 Investment Value ($)</label>
								<input id="productPrice" type="number" bind:value={productPrice} step="0.01" class="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all" required />
							</div>
							<div>
								<label for="productStock" class="block text-sm font-medium text-slate-700 mb-2">📦 Available Quantity</label>
								<input id="productStock" type="number" bind:value={productStock} class="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all" required />
							</div>
							<div>
								<label for="productCategory" class="block text-sm font-medium text-slate-700 mb-2">🎨 Collection Type</label>
								<select id="productCategory" bind:value={productCategory} class="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all">
									{#each categories as cat}
										<option value={cat}>{cat}</option>
									{/each}
								</select>
							</div>
							<div>
								<label for="productImage" class="block text-sm font-medium text-slate-700 mb-2">🖼️ Visual Representation</label>
								<input id="productImage" type="url" bind:value={productImage} class="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all" placeholder="https://..." />
							</div>
						</div>
						<div class="flex gap-4 pt-6">
							<button on:click={saveProduct} class="px-8 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-all transform hover:translate-y-[-2px]">
								{editingProduct ? '💾 Update Piece' : '✨ Create Piece'}
							</button>
							<button on:click={() => (showProductForm = false)} class="px-8 py-3 text-slate-600 font-medium border border-slate-200 rounded-lg hover:border-slate-300 hover:text-slate-700 transition-all">
								🚫 Cancel
							</button>
						</div>
					</form>
				</div>
			{/if}

			<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
				{#each data.products as product (product.id)}
					<div class="group cursor-pointer">
						<div class="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
							<div class="relative">
								{#if !product.isActive}
									<div class="absolute top-4 right-4 z-10">
										<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
											Inactive
										</span>
									</div>
								{/if}
								<img
									src={product.imageUrl}
									alt={product.name}
									class="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
								/>
								<div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							</div>
							<div class="p-6">
								<h3 class="text-lg font-semibold text-slate-900 mb-2 group-hover:text-slate-800 transition-colors">{product.name}</h3>
								<p class="text-sm text-slate-600 mb-4 line-clamp-2">{product.description}</p>
								<div class="mb-6 flex items-center justify-between">
									<div>
										<span class="text-2xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
										<div class="text-xs text-slate-500">per piece</div>
									</div>
									<div class="text-right">
										<div class="text-sm text-slate-600">Available</div>
										<div class="text-lg font-semibold text-slate-900">{product.stockQuantity}</div>
									</div>
								</div>
								<div class="flex gap-3">
									<button on:click={() => openProductForm(product)} class="flex-1 py-2 px-4 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:border-slate-300 hover:text-slate-700 transition-all">
										✏️ Edit
									</button>
									<button
										on:click={() => toggleProductStatus(product.id, product.isActive)}
										class="flex-1 py-2 px-4 text-sm font-medium border border-slate-200 rounded-lg transition-all {product.isActive
											? 'text-red-600 hover:border-red-300 hover:text-red-700'
											: 'text-emerald-600 hover:border-emerald-300 hover:text-emerald-700'}"
									>
										{product.isActive ? '🚫 Deactivate' : '✅ Activate'}
									</button>
									<button
										on:click={() => deleteProduct(product.id)}
										class="flex-1 py-2 px-4 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-all"
									>
										🗑️ Delete
									</button>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<!-- Orders Management -->
			<div class="space-y-6">
				{#each data.orders as order (order.id)}
					<div class="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
						<div class="mb-6 flex items-start justify-between">
							<div>
								<div class="flex items-center gap-4 mb-3">
									<h3 class="text-xl font-bold text-slate-900">
										📦 Order #{order.id}
									</h3>
									<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
										{order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
										 order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
										 order.status === 'payment_pending' ? 'bg-orange-100 text-orange-700' :
										 order.status === 'payment_received' ? 'bg-emerald-100 text-emerald-700' :
										 order.status === 'delivered' ? 'bg-indigo-100 text-indigo-700' :
										 'bg-red-100 text-red-700'}">
										{order.status.replace('_', ' ')}
									</span>
								</div>
								<div class="space-y-1">
									<p class="text-sm text-slate-600">
										👤 Customer: {order.userEmail}
									</p>
									<p class="text-sm text-slate-600">
										📅 {new Date(order.createdAt).toLocaleString()}
									</p>
									<p class="text-sm text-slate-600">
										💰 Total Investment: ${order.totalAmount.toFixed(2)}
									</p>
								</div>
							</div>
							<div class="text-right">
								<p class="text-2xl font-bold text-slate-900 mb-2">
									${order.totalAmount.toFixed(2)}
								</p>
								<p class="text-xs text-slate-500">Order Value</p>
							</div>
						</div>
						
						<div class="border-t border-slate-100 pt-6">
							<div class="flex items-center justify-between mb-4">
								<label class="block text-sm font-medium text-slate-700">🔄 Update Order Journey:</label>
								<div class="text-sm text-slate-500">
									Current: <span class="font-medium">{order.status.replace('_', ' ')}</span>
								</div>
							</div>
							<div class="flex gap-3 flex-wrap">
								<button
									on:click={() => updateOrderStatus(order.id, 'confirmed')}
									disabled={order.status === 'confirmed'}
									class="px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg transition-all
										{order.status === 'confirmed'
											? 'bg-slate-100 text-slate-400 cursor-not-allowed'
											: 'text-slate-600 hover:border-slate-300 hover:text-slate-700'}"
								>
									✅ Confirm Order
								</button>
								<button
									on:click={() => updateOrderStatus(order.id, 'payment_received')}
									disabled={order.status === 'payment_received'}
									class="px-4 py-2 text-sm font-medium border border-emerald-200 rounded-lg transition-all
										{order.status === 'payment_received'
											? 'bg-emerald-100 text-emerald-400 cursor-not-allowed'
											: 'text-emerald-600 hover:border-emerald-300 hover:text-emerald-700'}"
								>
									💳 Payment Received
								</button>
								<button
									on:click={() => updateOrderStatus(order.id, 'delivered')}
									disabled={order.status === 'delivered'}
									class="px-4 py-2 text-sm font-medium border border-indigo-200 rounded-lg transition-all
										{order.status === 'delivered'
											? 'bg-indigo-100 text-indigo-400 cursor-not-allowed'
											: 'text-indigo-600 hover:border-indigo-300 hover:text-indigo-700'}"
								>
									🚚 Delivered
								</button>
								<button
									on:click={() => updateOrderStatus(order.id, 'canceled')}
									disabled={order.status === 'canceled'}
									class="px-4 py-2 text-sm font-medium border border-red-200 rounded-lg transition-all
										{order.status === 'canceled'
											? 'bg-red-100 text-red-400 cursor-not-allowed'
											: 'text-red-600 hover:border-red-300 hover:text-red-700'}"
								>
									🚫 Cancel Order
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>

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
	<title>Admin Dashboard - StoreHub</title>
	<meta name="description" content="Manage products, orders, and customers." />
</svelte:head>

<section class="py-8 sm:py-12">
	<div class="container-main">
		<div class="mb-8 flex items-center justify-between">
			<h1 class="section-title">Admin Dashboard</h1>
			<a href="/account" class="btn-outline">
				Back to Account
			</a>
		</div>

		<!-- Tabs -->
		<div class="mb-8 flex gap-4 border-b border-neutral-200">
			<button
				on:click={() => (activeTab = 'products')}
				class="border-b-2 px-4 py-2 font-semibold transition-colors {activeTab === 'products'
					? 'border-primary-600 text-primary-600'
					: 'border-transparent text-neutral-600 hover:text-neutral-900'}"
			>
				Products ({data.products.length})
			</button>
			<button
				on:click={() => (activeTab = 'orders')}
				class="border-b-2 px-4 py-2 font-semibold transition-colors {activeTab === 'orders'
					? 'border-primary-600 text-primary-600'
					: 'border-transparent text-neutral-600 hover:text-neutral-900'}"
			>
				Orders ({data.orders.length})
			</button>
		</div>

		{#if activeTab === 'products'}
			<!-- Products Management -->
			<div class="mb-6 flex justify-end">
				<button on:click={() => openProductForm()} class="btn-primary">
					+ Add New Product
				</button>
			</div>

			{#if showProductForm}
				<div class="card mb-8">
					<h2 class="text-xl font-semibold text-neutral-900 mb-4">
						{editingProduct ? 'Edit Product' : 'Add New Product'}
					</h2>
					<div class="grid gap-4 sm:grid-cols-2">
					  <div class="sm:col-span-2">
					    <label for="productName" class="block text-sm font-semibold text-neutral-900 mb-2">Product Name</label>
					    <input id="productName" type="text" bind:value={productName} class="input-field" required />
					  </div>
					  <div class="sm:col-span-2">
					    <label for="productDescription" class="block text-sm font-semibold text-neutral-900 mb-2">Description</label>
					    <textarea id="productDescription" bind:value={productDescription} class="input-field min-h-[100px]"></textarea>
					  </div>
					  <div>
					    <label for="productPrice" class="block text-sm font-semibold text-neutral-900 mb-2">Price ($)</label>
					    <input id="productPrice" type="number" bind:value={productPrice} step="0.01" class="input-field" required />
					  </div>
					  <div>
					    <label for="productStock" class="block text-sm font-semibold text-neutral-900 mb-2">Stock Quantity</label>
					    <input id="productStock" type="number" bind:value={productStock} class="input-field" required />
					  </div>
					  <div>
					    <label for="productCategory" class="block text-sm font-semibold text-neutral-900 mb-2">Category</label>
					    <select id="productCategory" bind:value={productCategory} class="input-field">
					      {#each categories as cat}
									<option value={cat}>{cat}</option>
								{/each}
							</select>
						</div>
						<div>
						  <label for="productImage" class="block text-sm font-semibold text-neutral-900 mb-2">Image URL</label>
						  <input id="productImage" type="url" bind:value={productImage} class="input-field" placeholder="https://..." />
						</div>
					</div>
					<div class="mt-6 flex gap-3">
						<button on:click={saveProduct} class="btn-primary">
							{editingProduct ? 'Update Product' : 'Create Product'}
						</button>
						<button on:click={() => (showProductForm = false)} class="btn-outline">
							Cancel
						</button>
					</div>
				</div>
			{/if}

			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each data.products as product (product.id)}
					<div class="card relative">
						{#if !product.isActive}
							<div class="absolute top-4 right-4">
								<span class="badge-error">Inactive</span>
							</div>
						{/if}
						<img
							src={product.imageUrl}
							alt={product.name}
							class="h-48 w-full rounded-lg object-cover mb-4"
						/>
						<h3 class="text-lg font-semibold text-neutral-900 mb-2">{product.name}</h3>
						<p class="text-sm text-neutral-600 mb-4 line-clamp-2">{product.description}</p>
						<div class="mb-4 flex items-center justify-between">
							<span class="text-2xl font-bold text-primary-600">${product.price.toFixed(2)}</span>
							<span class="text-sm text-neutral-600">Stock: {product.stockQuantity}</span>
						</div>
						<div class="flex gap-2">
							<button on:click={() => openProductForm(product)} class="btn-outline btn-sm flex-1">
								Edit
							</button>
							<button
								on:click={() => toggleProductStatus(product.id, product.isActive)}
								class="btn-outline btn-sm flex-1"
							>
								{product.isActive ? 'Deactivate' : 'Activate'}
							</button>
							<button
								on:click={() => deleteProduct(product.id)}
								class="btn-outline btn-sm text-red-600 hover:bg-red-50"
							>
								Delete
							</button>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<!-- Orders Management -->
			<div class="space-y-4">
				{#each data.orders as order (order.id)}
					<div class="card">
						<div class="mb-4 flex items-start justify-between">
							<div>
								<div class="flex items-center gap-3 mb-2">
									<h3 class="text-lg font-semibold text-neutral-900">
										Order #{order.id}
									</h3>
									<span class="badge {statusColors[order.status]}">
										{order.status}
									</span>
								</div>
								<p class="text-sm text-neutral-600">
									Customer: {order.userEmail}
								</p>
								<p class="text-sm text-neutral-600">
									{new Date(order.createdAt).toLocaleString()}
								</p>
							</div>
							<p class="text-xl font-bold text-primary-600">
								${order.totalAmount.toFixed(2)}
							</p>
						</div>
						<div class="border-t border-neutral-200 pt-4">
							<label class="block text-sm font-semibold text-neutral-900 mb-2">Update Status:</label>
							<div class="flex gap-2 flex-wrap">
								<button
									on:click={() => updateOrderStatus(order.id, 'confirmed')}
									class="btn-outline btn-sm"
									disabled={order.status === 'confirmed'}
								>
									Confirm
								</button>
								<button
									on:click={() => updateOrderStatus(order.id, 'payment_received')}
									class="btn-outline btn-sm"
									disabled={order.status === 'payment_received'}
								>
									Payment Received
								</button>
								<button
									on:click={() => updateOrderStatus(order.id, 'delivered')}
									class="btn-outline btn-sm"
									disabled={order.status === 'delivered'}
								>
									Delivered
								</button>
								<button
									on:click={() => updateOrderStatus(order.id, 'canceled')}
									class="btn-outline btn-sm text-red-600"
									disabled={order.status === 'canceled'}
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>

<script lang="ts">
	interface Product {
		id: string;
		name: string;
		description?: string;
		price: number;
		image: string;
		rating: number;
		reviews: number;
	}

	export let product: Product | null = null;
	export let onClose: () => void;

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if product}
	<!-- Modal Backdrop -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
		onclick={handleBackdropClick}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
	>
		<!-- Modal Content -->
		<div
			class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-scale-in"
		>
			<!-- Close Button -->
			<button
				onclick={onClose}
				class="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
				aria-label="Close modal"
			>
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			<!-- Product Image -->
			<div class="relative aspect-video w-full overflow-hidden bg-slate-50 rounded-t-2xl">
				<img src={product.image} alt={product.name} class="h-full w-full object-cover" />
				<div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
			</div>

			<!-- Product Details -->
			<div class="p-6 sm:p-8 space-y-4">
				<!-- Title and Price -->
				<div class="flex items-start justify-between gap-4">
					<h2 id="modal-title" class="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
						{product.name}
					</h2>
					<p class="text-2xl sm:text-3xl font-bold text-slate-900 whitespace-nowrap">
						${product.price.toFixed(2)}
					</p>
				</div>

				<!-- Rating -->
				{#if product.reviews > 0}
					<div class="flex items-center gap-2">
						<div class="flex">
							{#each Array(5) as _, i}
								<svg
									class={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-slate-300'}`}
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
								</svg>
							{/each}
						</div>
						<span class="text-sm text-slate-600 font-medium">
							{product.rating} ({product.reviews}
							{product.reviews === 1 ? 'review' : 'reviews'})
						</span>
					</div>
				{:else}
					<div class="text-sm text-slate-500 italic">No reviews yet</div>
				{/if}

				<!-- Divider -->
				<div class="border-t border-slate-200"></div>

				<!-- Description -->
				<div>
					<h3 class="text-lg font-semibold text-slate-900 mb-3">Product Description</h3>
					{#if product.description}
						<p class="text-slate-600 leading-relaxed whitespace-pre-line">
							{product.description}
						</p>
					{:else}
						<p class="text-slate-500 italic">No description available for this product.</p>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes scale-in {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.animate-fade-in {
		animation: fade-in 0.2s ease-out;
	}

	.animate-scale-in {
		animation: scale-in 0.2s ease-out;
	}
</style>
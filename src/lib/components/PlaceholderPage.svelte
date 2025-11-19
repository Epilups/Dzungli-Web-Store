<script lang="ts">
	export let title = 'Page';
	export let description = 'This page is under construction';
	export let icon = '🚀';
</script>

<section class="py-16 sm:py-20">
	<div class="container-main flex items-center justify-center">
		<div class="text-center">
			<div class="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-primary-100">
				<span class="text-5xl">{icon}</span>
			</div>
			<h1 class="section-title mb-4">{title}</h1>
			<p class="section-subtitle max-w-md mb-8">
				{description}
			</p>
			<p class="text-neutral-600 mb-8">
				No details added yet. 
			</p>
			<a href="/" class="btn-primary inline-flex">
				<span>Back to Home</span>
				<svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
				</svg>
			</a>
		</div>
	</div>
</section>

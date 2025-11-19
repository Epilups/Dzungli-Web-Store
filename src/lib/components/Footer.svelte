<script lang="ts">
	const currentYear = new Date().getFullYear();
</script>

<footer class="border-t border-neutral-200 bg-neutral-50">
	<div class="container-main py-12">
		<div class="grid gap-8 md:grid-cols-4">
			<!-- Brand Section -->
			<div>
				<div class="mb-4 flex items-center gap-2">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-accent-600">
						<span class="text-sm font-bold text-white">Dz</span>
					</div>
					<span class="font-bold text-neutral-900">Dzungli</span>
				</div>
				<p class="text-sm text-neutral-600">
					A modern e-commerce platform built for nothing.
				</p>
			</div>

			<!-- Company Links -->
			<div>
				<h3 class="mb-4 text-sm font-semibold text-neutral-900">Company</h3>
				<ul class="space-y-2">
					<li>
						<a href="/about" class="text-sm text-neutral-600 hover:text-neutral-900">
							About Us
						</a>
					</li>
					<li>
						<a href="/blog" class="text-sm text-neutral-600 hover:text-neutral-900">
							Blog
						</a>
					</li>
					<li>
						<a href="/careers" class="text-sm text-neutral-600 hover:text-neutral-900">
							Careers
						</a>
					</li>
				</ul>
			</div>

			<!-- Support Links -->
			<div>
				<h3 class="mb-4 text-sm font-semibold text-neutral-900">Support</h3>
				<ul class="space-y-2">
					<li>
						<a href="/help" class="text-sm text-neutral-600 hover:text-neutral-900">
							Help Center
						</a>
					</li>
					<li>
						<a href="/contact" class="text-sm text-neutral-600 hover:text-neutral-900">
							Contact Us
						</a>
					</li>
					<li>
						<a href="/faq" class="text-sm text-neutral-600 hover:text-neutral-900">
							FAQ
						</a>
					</li>
				</ul>
			</div>

			<!-- Legal Links -->
			<div>
				<h3 class="mb-4 text-sm font-semibold text-neutral-900">Legal</h3>
				<ul class="space-y-2">
					<li>
						<a href="/privacy" class="text-sm text-neutral-600 hover:text-neutral-900">
							Privacy Policy
						</a>
					</li>
					<li>
						<a href="/terms" class="text-sm text-neutral-600 hover:text-neutral-900">
							Terms of Service
						</a>
					</li>
					<li>
						<a href="/cookies" class="text-sm text-neutral-600 hover:text-neutral-900">
							Cookie Policy
						</a>
					</li>
				</ul>
			</div>
		</div>

		<!-- Divider -->
		<div class="my-8 border-t border-neutral-200"></div>

		<!-- Bottom Section -->
		<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
			<p class="text-sm text-neutral-600">
				© {currentYear} Dzungli. All rights reserved.
			</p>
			<div class="flex gap-6">
				<a href="#" class="text-neutral-600 hover:text-neutral-900">
					<span class="sr-only">Twitter</span>
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
						<path d="M8.29 20c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-7.238 3.746 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 01.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 18.407a11.616 11.616 0 006.29 1.84" />
					</svg>
				</a>
				<a href="#" class="text-neutral-600 hover:text-neutral-900">
					<span class="sr-only">Facebook</span>
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M20 10a10 10 0 11-20 0 10 10 0 0120 0zm-4.5-2.5a.5.5 0 01.5.5v5a.5.5 0 01-1 0v-3.207l-3.146 3.146a.5.5 0 11-.708-.708l3.147-3.146H11a.5.5 0 010-1h4a.5.5 0 01.5.5z" clip-rule="evenodd" />
					</svg>
				</a>
				<a href="#" class="text-neutral-600 hover:text-neutral-900">
					<span class="sr-only">LinkedIn</span>
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
						<path d="M18.2 1H1.8C.9 1 0 1.9 0 2.8v14.4C0 18.1.9 19 1.8 19h16.4c.9 0 1.8-.9 1.8-1.8V2.8C20 1.9 19.1 1 18.2 1zM6.1 16.5H3.4V7.6h2.7v8.9zm-1.3-10.1c-.9 0-1.6-.7-1.6-1.6s.7-1.6 1.6-1.6 1.6.7 1.6 1.6-.7 1.6-1.6 1.6zm11.3 10.1h-2.7v-4.3c0-1 0-2.4-1.5-2.4-1.5 0-1.7 1.2-1.7 2.4v4.3h-2.7V7.6h2.6v1.2h.1c.4-.7 1.3-1.5 2.7-1.5 2.9 0 3.4 1.9 3.4 4.4v5.8z" />
					</svg>
				</a>
			</div>
		</div>
	</div>
</footer>

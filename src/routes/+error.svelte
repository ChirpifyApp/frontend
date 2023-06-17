<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.status}</title>
</svelte:head>

<main class="flex h-full min-h-screen flex-col items-center justify-center gap-4 bg-zinc-900 text-zinc-100">
	<h1 class="border-b border-zinc-700 pb-4 font-semibold text-6xl">{$page.status}</h1>
	<p class="mb-8">{$page.error?.message}</p>

	{#if $page.data.session}
		<a
			href="/home"
			class="w-full max-w-sm rounded-lg border border-zinc-700 border-opacity-50 py-3 text-center text-zinc-100 hover:bg-zinc-800"
		>
			Back to home
		</a>
	{:else}
		<a
			href="/login"
			class="w-full max-w-sm rounded-lg border border-zinc-700 border-opacity-50 py-3 text-center text-zinc-100 hover:bg-zinc-800"
		>
			Back to login
		</a>
	{/if}
</main>

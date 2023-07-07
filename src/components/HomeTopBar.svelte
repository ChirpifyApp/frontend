<script lang="ts">
	import md5 from 'md5';
	import { fade } from 'svelte/transition';
	import { myId } from '../stores';

	export let email: string;
	export let name: string | null;

	const emailHash = md5(email.toLocaleLowerCase().trim());
	const gravatarUrl = `https://www.gravatar.com/avatar/${emailHash}?s=48&d=retro&r=g`;

	let dropdownRef: HTMLDivElement | undefined;
	let showDropdown = false;

	function toggleDropdownMenu(event: MouseEvent) {
		event.stopPropagation();
		showDropdown = !showDropdown;
	}

	function hideDropdownMenu(event: MouseEvent) {
		if (!dropdownRef) return;
		if (event.target === dropdownRef || dropdownRef.contains(event.target as Node)) return;
		console.log('hiding dropdown menu');
		showDropdown = false;
	}

</script>

<svelte:body on:click={hideDropdownMenu} />

<header class="flex w-full items-center justify-center bg-zinc-900 pb-12 pt-4">
	<div class="flex w-full max-w-xl items-center justify-between">
		<h1 class="font-bold text-zinc-100 text-2xl">Chirpify</h1>
		<div class="relative">
			<button on:click={toggleDropdownMenu}>
					<img alt="Profile avatar" class="h-12 w-12 rounded-full" src={gravatarUrl} />
				</button>
			{#if showDropdown}
				<div class='relative' bind:this={dropdownRef}>
					<div
						class='absolute right-0 mt-2 shadow-lg'
						transition:fade={{ duration: 50 }}
					>
						<div class='flex flex-col'>
							<div class='clip-bottom mr-4 h-2 w-4 self-end bg-zinc-800'></div>
							<div
								class='rounded-t-lg border-b border-zinc-600 border-opacity-50 bg-zinc-800 px-6 py-4'
							>
								<h3 class='font-medium'>{name === null ? 'Name not set' : name}</h3>
								<h4 class='text-zinc-400'>{email}</h4>
							</div>
							<div
								class='flex flex-col rounded-b-lg border-zinc-600 border-opacity-50 bg-zinc-800 px-6 py-4'
							>
								<a class='mb-2 hover:text-neutral-400' href='/user/{$myId}'>Profile</a>
								<a href='/signout' class='hover:text-neutral-400'>Sign out →</a>
							</div>
						</div>
					</div>
				</div>
			{/if}
			<!--<button on:click|preventDefault={toggleProfileMenu}>
				<img alt='Profile avatar' class='h-12 w-12 rounded-full' src={gravatarUrl}
					 bind:this={profileMenuButton} />
			</button>
			{#if showProfileMenu}
				&lt;!&ndash; Content container > this has to be shown/hidden &ndash;&gt;
				<div class='absolute right-0 mt-2' bind:this={profileMenu} transition:fade={{ duration: 50 }}>
					&lt;!&ndash; Inside content slot &ndash;&gt;
					<div class='flex flex-col'>
						<div class='clip-bottom mr-4 h-2 w-4 self-end bg-zinc-800'></div>
						<div
							class='rounded-t-lg border-b border-zinc-600 border-opacity-50 bg-zinc-800 px-6 py-4'
						>
							<h3 class='font-medium'>{name === null ? 'Name not set' : name}</h3>
							<h4 class='text-zinc-400'>{email}</h4>
						</div>
						<div
							class='flex flex-col rounded-b-lg border-zinc-600 border-opacity-50 bg-zinc-800 px-6 py-4'
						>
							<a class='mb-2 hover:text-neutral-400' href='/user/{myId}'>Profile</a>
							<a href='/signout' class='hover:text-neutral-400'>Sign out →</a>
						</div>
					</div>
				</div>
			{/if}-->
		</div>
	</div>
</header>

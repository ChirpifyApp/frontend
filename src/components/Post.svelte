<script lang="ts">
	import md5 from 'md5';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { loadedPosts, myId, weeklyPost } from '../stores';
	import { fetchWeeklyPost } from '../routes/home/+page.svelte';
	import { fade } from 'svelte/transition';

	export let name: string | null;
	export let email: string;
	export let content: string;
	export let imageUrl: string | null;
	export let likeCount: number;
	export let dislikeCount: number;
	export let id: number;
	export let liked: -1 | 0 | 1;
	export let date: string;
	export let authorId: number;

	function formatDate(isoDateString: string) {
		const date = new Date(isoDateString);

		const formatter = new Intl.DateTimeFormat('en-US', {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		});

		const parts = formatter.formatToParts(date);
		return `${parts[2].value} ${parts[0].value} ${parts[4].value}`;
	}

	let loadingReaction = false;

	async function refreshWeeklyPost() {
		if ($weeklyPost === null) return;
		if (
			id === $weeklyPost?.id ||
			likeCount - dislikeCount > $weeklyPost!.likedBy.length - $weeklyPost!.dislikedBy.length
		) {
			console.debug('Refreshing weekly post...');
			await fetchWeeklyPost();
		}
	}

	async function likePost() {
		if (liked === 1) return;
		loadingReaction = true;
		try {
			const response = await fetch(`${PUBLIC_API_URL}/posts/like/${id}`, {
				method: 'POST',
				credentials: 'include'
			});
			const body = await response.json();
			likeCount = body.likedBy.length;
			dislikeCount = body.dislikedBy.length;
			liked = 1;
		} catch (e) {
			console.error(e);
		} finally {
			loadingReaction = false;
			await refreshWeeklyPost();
		}
	}

	async function dislikePost() {
		if (liked === -1) return;
		loadingReaction = true;
		try {
			const response = await fetch(`${PUBLIC_API_URL}/posts/dislike/${id}`, {
				method: 'POST',
				credentials: 'include'
			});
			const body = await response.json();
			likeCount = body.likedBy.length;
			dislikeCount = body.dislikedBy.length;
			liked = -1;
		} catch (e) {
			console.error(e);
		} finally {
			loadingReaction = false;
			await refreshWeeklyPost();
		}
	}

	async function deletePost() {
		const response = await fetch(`${PUBLIC_API_URL}/posts/${id}`, {
			method: 'DELETE',
			credentials: 'include',
		});
		console.log(response.status);
		if (response.ok) {
			loadedPosts.update((posts) => posts.filter((post) => post.id !== id));
			await refreshWeeklyPost();
		}
	}

	$: gravatarUrl = `https://www.gravatar.com/avatar/${md5(
		email.toLocaleLowerCase().trim()
	)}?s=48&d=retro&r=g`;

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

<div
	class="mb-4 flex w-full max-w-lg rounded-lg border border-zinc-700 border-opacity-50 p-4"
	data-post-id={id}
>
	<img alt="Post author" class="mr-4 h-10 w-10 rounded-full" src={gravatarUrl} />
	<div class="w-full">
		<!-- Author -->
		<div class="mb-0.5 flex justify-between">
			<div class="flex items-center gap-2">
				{#if name !== null}
					<h3 class="font-medium">{name}</h3>
				{/if}
				<h4 class="text-zinc-400">@{email.split('@')[0]}</h4>
			</div>
			<div class="flex items-center">
				<h4 class="mr-2 text-zinc-400">{formatDate(date)}</h4>
				<!-- Context menu button -->
				{#if authorId === $myId}
					<button on:click={toggleDropdownMenu}>
						<svg
							class='stroke-zinc-400'
							height='20px'
							stroke-width='1.5'
							viewBox='0 0 24 24'
							width='20px'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M20 12.5a.5.5 0 100-1 .5.5 0 000 1zM12 12.5a.5.5 0 100-1 .5.5 0 000 1zM4 12.5a.5.5 0 100-1 .5.5 0 000 1z'
								stroke-linecap='round'
								stroke-linejoin='round'
								stroke-width='1.5'
							/>
						</svg>
					</button>
					{#if showDropdown}
						<div
							bind:this={dropdownRef}
							class='relative'>
							<div
								class='absolute right-0 mt-4 shadow-lg'
								transition:fade={{ duration: 50 }}

							>
								<div class='flex flex-col'>
									<div
										class='flex flex-col rounded-lg border-zinc-600 border-opacity-50 bg-zinc-800 px-6 py-2'
									>
										<button class='hover:text-neutral-400'
												on:click|preventDefault={() => {showDropdown = false; deletePost();
									}}>Delete
										</button>
									</div>
								</div>
							</div>
						</div>
					{/if}
				{/if}
			</div>
		</div>
		<!-- Content & Image -->
		<div class="mb-2">
			<p class="mb-2">{content}</p>
			{#if imageUrl !== null}
				<img
					src={imageUrl}
					alt="Post"
					class="w-full rounded-lg border border-zinc-700 border-opacity-50"
				/>
			{/if}
		</div>
		<!-- Like & Dislike -->
		<div class="flex w-full items-center justify-end gap-2">
			<button on:click|preventDefault={dislikePost} disabled={loadingReaction}>
				<svg
					class="{liked === -1 ? 'stroke-blue-500' : 'stroke-zinc-400'} transition-all"
					height="20px"
					stroke-width="1.5"
					viewBox="0 0 24 24"
					width="20px"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M12 3v18m0 0l8.5-8.5M12 21l-8.5-8.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
					/>
				</svg>
			</button>
			{#if loadingReaction}
				<div role="status" class="text-center">
					<svg
						aria-hidden="true"
						class="inline h-5 w-5 animate-spin fill-neutral-100 text-neutral-400"
						viewBox="0 0 100 101"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
							fill="currentColor"
						/>
						<path
							d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
							fill="currentFill"
						/>
					</svg>
					<span class="sr-only">Loading...</span>
				</div>
			{:else}
				<p>{likeCount - dislikeCount}</p>
			{/if}
			<button on:click|preventDefault={likePost} disabled={loadingReaction}>
				<svg
					class="{liked === 1 ? 'stroke-blue-500' : 'stroke-zinc-400'} transition-all"
					height="20px"
					stroke-width="1.5"
					viewBox="0 0 24 24"
					width="20px"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M12 21V3m0 0l8.5 8.5M12 3l-8.5 8.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
					/>
				</svg>
			</button>
		</div>
	</div>
</div>

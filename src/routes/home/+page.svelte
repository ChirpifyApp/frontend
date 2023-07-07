<script context="module">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { weeklyPost } from '../../stores';

	export async function fetchWeeklyPost() {
		const response = await fetch(`${PUBLIC_API_URL}/posts/top/weekly`, {
			credentials: 'include'
		});
		if (response.status === 204) {
			weeklyPost.set(null);
			return;
		}
		weeklyPost.set(await response.json());
	}
</script>

<script lang="ts">
	import md5 from 'md5';
	import HomeTopBar from '../../components/HomeTopBar.svelte';
	import PostContainer from '../../components/PostContainer.svelte';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import Post from '../../components/Post.svelte';
	import LoadingPost from '../../components/LoadingPost.svelte';
	import { myId } from '../../stores';

	export let data: PageData;

	const emailHash = md5(data.me.email.toLocaleLowerCase().trim());
	const gravatarUrl = `https://www.gravatar.com/avatar/${emailHash}?s=48&d=retro&r=g`;

	let imageInput: HTMLInputElement;
	let previewImageElement: HTMLImageElement;
	let showImage = false;
	let textAreaElement: HTMLTextAreaElement;
	let inputLength = 0;
	const maxInputLength = 128;

	$myId = data.me.id;

	function onImageInputChange() {
		if (imageInput.files === null) {
			showImage = false;
			return;
		}

		const file = imageInput.files[0];
		if (file) {
			showImage = true;
			const reader = new FileReader();

			reader.onload = () => {
				previewImageElement.setAttribute('src', reader.result as string);
			};
			reader.readAsDataURL(file);
			return;
		}
		showImage = false;
	}

	function removeImageInput() {
		imageInput.files = null;
		showImage = false;
	}

	function onContentChange() {
		if (textAreaElement.value === '') {
			textAreaElement.style.height = 'auto';
			inputLength = 0;
			return;
		}
		const scrollHeight = textAreaElement.scrollHeight;
		textAreaElement.style.height = scrollHeight + 'px';

		const textLength = textAreaElement.value.length;
		if (textLength <= maxInputLength) {
			inputLength = textLength;
		} else {
			inputLength = maxInputLength;
			textAreaElement.value = textAreaElement.value.slice(0, maxInputLength);
		}
	}

	onMount(async () => {
		await fetchWeeklyPost();
	});
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<main class="flex min-h-screen flex-col items-center bg-zinc-900 px-4">
	<HomeTopBar email={data.me.email} name={data.me.name} />
	<section
		class="min-w-screen flex w-full max-w-lg flex-col items-center justify-center bg-zinc-900"
	>
		<form
			class="flex h-auto w-full max-w-lg basis-0 gap-4 rounded-lg border border-zinc-700 border-opacity-50 p-4"
		>
			<img alt="Your avatar" class="mr-4 h-10 w-10 rounded-full" src={gravatarUrl} />
			<div class="flex-grow">
				<div class="mb-4 flex w-full justify-between">
					<textarea
						bind:this={textAreaElement}
						class="max-h-48 w-full resize-none overflow-hidden bg-zinc-900 text-zinc-100 placeholder-zinc-400 outline-none"
						id="content"
						name="content"
						on:input={onContentChange}
						placeholder="Type something..."></textarea>
					<p
						class="cursor-default {inputLength === maxInputLength
							? 'text-red-400'
							: 'text-zinc-400'} ml-4"
					>
						{inputLength}/{maxInputLength}
					</p>
				</div>
				{#if showImage}
					<div class="mb-4">
						<img
							src=""
							alt="Post"
							class="w-full rounded-lg border border-zinc-700 border-opacity-50"
							bind:this={previewImageElement}
						/>
					</div>
				{/if}
				<div class="flex w-full justify-between">
					<input
						accept="image/png, image/jpeg, image/webp"
						bind:this={imageInput}
						class="hidden"
						id="image"
						name="image"
						on:change={onImageInputChange}
						type="file"
					/>
					<div class="flex items-center gap-2">
						<label
							class="cursor-pointer stroke-zinc-400 hover:stroke-zinc-100"
							for="image"
						>
							<svg
								fill="none"
								height="20px"
								stroke-width="1.5"
								viewBox="0 0 24 24"
								width="20px"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M13 21H3.6a.6.6 0 01-.6-.6V3.6a.6.6 0 01.6-.6h16.8a.6.6 0 01.6.6V13"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
								/>
								<path
									d="M3 16l7-3 5.5 2.5M16 10a2 2 0 110-4 2 2 0 010 4zM16 19h3m3 0h-3m0 0v-3m0 3v3"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
								/>
							</svg>
						</label>
						{#if showImage}
							<button
								class="stroke-zinc-400 hover:stroke-zinc-100"
								on:click|preventDefault={removeImageInput}
							>
								<svg
									width="20px"
									height="20px"
									stroke-width="1.5"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M3 16l7-3 4 1.818M16 10a2 2 0 110-4 2 2 0 010 4zM16.879 21.121L19 19m2.121-2.121L19 19m0 0l-2.121-2.121M19 19l2.121 2.121"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M13 21H3.6a.6.6 0 01-.6-.6V3.6a.6.6 0 01.6-.6h16.8a.6.6 0 01.6.6V13"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</button>
						{/if}
					</div>
					<button class="stroke-blue-500 hover:stroke-blue-300">
						<svg
							fill="none"
							height="20px"
							stroke-width="1.5"
							viewBox="0 0 24 24"
							width="20px"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M22 12L3 20l3.563-8L3 4l19 8zM6.5 12H22"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
							/>
						</svg>
					</button>
				</div>
			</div>
		</form>
		<h2 class="self-start py-8 font-bold text-2xl">Weekly favourite</h2>
		{#if $weeklyPost !== undefined}
			{#if $weeklyPost === null}
				<p class="text-zinc-700">No weekly post yet :)</p>
			{:else}
				<Post
					name={$weeklyPost.author.name}
					email={$weeklyPost.author.email}
					content={$weeklyPost.content}
					imageUrl={$weeklyPost.imageUrl}
					likeCount={$weeklyPost.likedBy.length}
					dislikeCount={$weeklyPost.dislikedBy.length}
					liked={$weeklyPost.likedBy.find(user => user.id === data.me.id)
						? 1
						: $weeklyPost.dislikedBy.find(user => user.id === data.me.id)
						? -1
						: 0}
					date={$weeklyPost.createdAt}
					id={$weeklyPost.id}
					myId={data.me.id}
					authorId={$weeklyPost.authorId}
				/>
			{/if}
		{:else}
			<LoadingPost />
		{/if}
		<h2 class="self-start py-8 font-bold text-2xl">Most recent</h2>
		<PostContainer endpoint="/posts/recent" userId={data.me.id} />
	</section>
</main>

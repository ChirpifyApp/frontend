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
	import type { ActionData, PageData } from './$types';
	import { onMount } from 'svelte';
	import Post from '../../components/Post.svelte';
	import LoadingPost from '../../components/LoadingPost.svelte';
	import { loadedPosts, myId } from '../../stores';
	import { enhance } from '$app/forms';

	export let data: PageData;
	export let form: ActionData;

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

	let postingLoading = false;
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<main class="flex min-h-screen flex-col items-center bg-zinc-900 px-4">
	<HomeTopBar email={data.me.email} name={data.me.name} />
	<section
		class="min-w-screen flex w-full max-w-lg flex-col items-center justify-center bg-zinc-900"
	>
		{#if form?.success === false}
			<div class='max-w-lg w-full rounded-lg border border-red-600 p-4 mb-4'>
				<p class="flex gap-2 fill-red-500 text-red-500">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="h-5 w-5">
						<path
							fill-rule="evenodd"
							d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
							clip-rule="evenodd"
						/>
					</svg>

					{form?.error}: {form?.message}
				</p>
			</div>
		{/if}
		<form
			class="flex h-auto w-full max-w-lg basis-0 gap-4 rounded-lg border border-zinc-700 border-opacity-50 p-4"
			enctype='multipart/form-data'
			method='POST'
			use:enhance={({ formElement }) => {
				postingLoading = true;

				return async({ result, update }) => {
					console.log(result);
					// @ts-ignore
					if (result['data']['success'] !== true) {
						await update({ reset: false });
						postingLoading = false;
						return;
					}

					// @ts-ignore
					const post = result['data']['post'];
					$loadedPosts = [post, ...$loadedPosts];

					await update();
					await fetchWeeklyPost();
					postingLoading = false;

					removeImageInput();
					formElement.reset();
					onContentChange();
				}
			}}
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
						placeholder="Type something..."
						disabled={postingLoading}></textarea>
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
						disabled={postingLoading}
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
								disabled={postingLoading}
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
					{#if postingLoading}
						<div role='status' class='text-center'>
							<svg
								aria-hidden='true'
								class='inline h-5 w-5 animate-spin fill-neutral-100 text-neutral-400'
								viewBox='0 0 100 101'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
									fill='currentColor'
								/>
								<path
									d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
									fill='currentFill'
								/>
							</svg>
							<span class='sr-only'>Loading...</span>
						</div>
					{:else}
						<button class='stroke-blue-500 hover:stroke-blue-300' type='submit'
								disabled={postingLoading}>
							<svg
								fill='none'
								height='20px'
								stroke-width='1.5'
								viewBox='0 0 24 24'
								width='20px'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M22 12L3 20l3.563-8L3 4l19 8zM6.5 12H22'
									stroke-linecap='round'
									stroke-linejoin='round'
									stroke-width='1.5'
								/>
							</svg>
						</button>
					{/if}
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
					authorId={$weeklyPost.authorId}
				/>
			{/if}
		{:else}
			<LoadingPost />
		{/if}
		<h2 class="self-start py-8 font-bold text-2xl">Most recent</h2>
		<PostContainer endpoint='/posts/recent' />
	</section>
</main>

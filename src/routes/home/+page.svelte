<script lang="ts">
	import md5 from 'md5';
	import HomeTopBar from '../../components/HomeTopBar.svelte';
	import PostContainer from '../../components/PostContainer.svelte';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	export let data: PageData;
	const emailHash = md5(data.me.email.toLocaleLowerCase().trim());
	const gravatarUrl = `https://www.gravatar.com/avatar/${emailHash}?s=48&d=retro&r=g`;

	let imageInput: HTMLInputElement;
	let previewImageElement: HTMLImageElement;
	let showImage = false;
	let textAreaElement: HTMLTextAreaElement;
	let inputLength: number = 0;
	const maxInputLength = 128;

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

	function onContentChange(event: InputEvent) {
		const scrollHeight = textAreaElement.scrollHeight;
		textAreaElement.style.height = scrollHeight + 'px';

		const textLength = textAreaElement.value.length;
		if (textLength <= maxInputLength) {
			inputLength = textLength;
		} else {
			textAreaElement.value = textAreaElement.value.slice(0, maxInputLength);
		}
	}
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<main class="min-h-screen bg-zinc-900 px-4">
	<HomeTopBar email="methalicity@gmail.com" name={data.me.name} />
	<section class="min-w-screen flex flex-col items-center justify-center gap-4 bg-zinc-900">
		<form class="flex h-auto w-full max-w-lg gap-4 rounded-lg border border-zinc-700 border-opacity-50 p-4">
			<img src={gravatarUrl} alt="Post image" class="mr-4 h-10 w-10 rounded-full" />
			<div class="flex-grow">
				<div class="mb-4 flex w-full justify-between">
					<textarea
						placeholder="Type something..."
						id="content"
						name="content"
						class="max-h-48 w-full resize-none overflow-hidden bg-zinc-900 text-zinc-100 placeholder-zinc-400 outline-none"
						bind:this={textAreaElement}
						on:input={onContentChange}
					/>
					<p class="cursor-default {inputLength === maxInputLength ? 'text-red-400' : 'text-zinc-400'} ml-4">
						{inputLength}/{maxInputLength}
					</p>
				</div>
				{#if showImage}
					<div class="mb-4">
						<img
							src=""
							alt="Post image"
							class="w-full rounded-lg border border-zinc-700 border-opacity-50"
							bind:this={previewImageElement}
						/>
					</div>
				{/if}
				<div class="flex w-full justify-between">
					<input
						type="file"
						name="image"
						id="image"
						class="hidden"
						accept="image/png, image/jpeg, image/webp"
						bind:this={imageInput}
						on:change={onImageInputChange}
					/>
					<div class="flex items-center gap-2">
						<label for="image" class="cursor-pointer stroke-zinc-400 hover:stroke-zinc-100">
							<svg
								width="20px"
								height="20px"
								stroke-width="1.5"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								><path
									d="M13 21H3.6a.6.6 0 01-.6-.6V3.6a.6.6 0 01.6-.6h16.8a.6.6 0 01.6.6V13"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/><path
									d="M3 16l7-3 5.5 2.5M16 10a2 2 0 110-4 2 2 0 010 4zM16 19h3m3 0h-3m0 0v-3m0 3v3"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/></svg
							>
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
									><path
										d="M3 16l7-3 4 1.818M16 10a2 2 0 110-4 2 2 0 010 4zM16.879 21.121L19 19m2.121-2.121L19 19m0 0l-2.121-2.121M19 19l2.121 2.121"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/><path
										d="M13 21H3.6a.6.6 0 01-.6-.6V3.6a.6.6 0 01.6-.6h16.8a.6.6 0 01.6.6V13"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/></svg
								>
							</button>
						{/if}
					</div>
					<button class="stroke-blue-500 hover:stroke-blue-300">
						<svg
							width="20px"
							height="20px"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							><path
								d="M22 12L3 20l3.563-8L3 4l19 8zM6.5 12H22"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/></svg
						>
					</button>
				</div>
			</div>
		</form>
		<PostContainer userId={data.me.id} endpoint="/posts/recent" />
		<!-- <Post
			name="John Doe"
			email="methalicity@gmail.com"
			content="Tak dobre som sa dnes vysral v aule magne 😏"
			imageUrl="https://uploads-ssl.webflow.com/5eb98fe916cf6d58ddb2511b/5ebc2624992f58676244e412_aula-euba-galeria2.jpg"
			likeCount={14}
			dislikeCount={2}
			liked={1}
			date="12 Feb"
			id="123"
		/> -->
	</section>
</main>

<script lang="ts">
	import md5 from 'md5';

	export let name: string | null;
	export let email: string;
	export let content: string;
	export let imageUrl: string | null;
	export let likeCount: number;
	export let dislikeCount: number;
	export let id: number;
	export let liked: -1 | 0 | 1;
	export let date: string;

	function formatDate(isoDateString: string) {
		const date = new Date(isoDateString);

		const formatter = new Intl.DateTimeFormat('en-US', {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		});

		const parts = formatter.formatToParts(date);
		const formattedDate = `${parts[2].value} ${parts[0].value} ${parts[4].value}`;

		return formattedDate;
	}

	async function likePost() {
		if (liked === 1) return;
	}

	async function dislikePost() {
		if (liked === -1) return;
	}

	const emailHash = md5(email.toLocaleLowerCase().trim());
	const gravatarUrl = `https://www.gravatar.com/avatar/${emailHash}?s=48&d=retro&r=g`;
</script>

<div class="mb-4 flex w-full max-w-lg rounded-lg border border-zinc-700 border-opacity-50 p-4" data-post-id={id}>
	<img src={gravatarUrl} alt="Post image" class="mr-4 h-10 w-10 rounded-full" />
	<div class="w-full">
		<!-- Author -->
		<div class="mb-0.5 flex justify-between">
			<div class="flex items-center gap-2">
				{#if name !== null}
					<h3 class="font-medium">{name}</h3>
				{/if}
				<h4 class="text-zinc-400">@{email.split('@')[0]}</h4>
			</div>
			<div class="flex items-center gap-2">
				<h4 class="text-zinc-400">{formatDate(date)}</h4>
				<button>
					<svg
						width="20px"
						height="20px"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						xmlns="http://www.w3.org/2000/svg"
						class="stroke-zinc-400"
						><path
							d="M20 12.5a.5.5 0 100-1 .5.5 0 000 1zM12 12.5a.5.5 0 100-1 .5.5 0 000 1zM4 12.5a.5.5 0 100-1 .5.5 0 000 1z"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/></svg
					>
				</button>
			</div>
		</div>
		<!-- Content & Image -->
		<div class="mb-2">
			<p class="mb-2">{content}</p>
			{#if imageUrl !== null}
				<img
					src={imageUrl}
					alt="Post image"
					class="w-full rounded-lg border border-zinc-700 border-opacity-50"
				/>
			{/if}
		</div>
		<!-- Like & Dislike -->
		<div class="flex w-full items-center justify-end gap-2">
			<button>
				<svg
					width="20px"
					height="20px"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					xmlns="http://www.w3.org/2000/svg"
					class={liked === -1 ? 'stroke-blue-500' : 'stroke-zinc-400'}
					><path
						d="M12 3v18m0 0l8.5-8.5M12 21l-8.5-8.5"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/></svg
				>
			</button>
			<p>{likeCount - dislikeCount}</p>
			<button>
				<svg
					width="20px"
					height="20px"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					xmlns="http://www.w3.org/2000/svg"
					class={liked === 1 ? 'stroke-blue-500' : 'stroke-zinc-400'}
					><path
						d="M12 21V3m0 0l8.5 8.5M12 3l-8.5 8.5"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/></svg
				>
			</button>
		</div>
	</div>
</div>

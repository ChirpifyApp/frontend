<script lang="ts">
	import { goto } from '$app/navigation'
	import { afterUpdate } from 'svelte'
	import Pincode from 'svelte-pincode/src/unstyled/Pincode.svelte'
	import PincodeInput from 'svelte-pincode/src/unstyled/PincodeInput.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	let pincode
	let code = data.code?.split('')
	let value = ''
	let complete = false
	let loading = false
	let error: boolean
	$: error = data.status !== undefined && data.status !== 200

	afterUpdate(() => {
		if (data.success) {
			setTimeout(() => {
				goto('/home')
			}, 5000)
		}
	})
</script>

<main class="flex h-screen min-h-screen flex-col items-center justify-center bg-zinc-900">
	{#if data.success}
		<svg
			width="32"
			height="32"
			viewBox="0 0 32 32"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			class="mb-4"
		>
			<path
				d="M9.00496 30.9924C8.82996 30.9874 8.65246 30.9724 8.47996 30.9424C7.39746 30.7499 6.50746 29.9824 6.15496 28.9424L1.15496 13.9424C0.629956 12.3674 1.47996 10.6674 3.05496 10.1424C4.62996 9.61742 6.32996 10.4674 6.85496 12.0424L10.105 21.7924L25.655 2.14242C26.6825 0.837417 28.575 0.614918 29.88 1.64242C31.185 2.66992 31.4075 4.56242 30.38 5.86742L11.38 29.8674C10.795 30.5774 9.92496 30.9899 9.00496 30.9924Z"
				fill="#546D7A"
			/>
			<path
				opacity="0.35"
				d="M18.7925 14.7274C19.165 14.4174 26.285 5.92239 26.285 5.92239C26.285 5.92239 26.88 5.28989 26.375 4.73489C25.9 4.22739 25.28 4.55989 24.9825 4.88989C24.685 5.21989 18.26 12.7949 17.995 13.1699C17.735 13.5924 17.7275 14.1224 17.9725 14.5524C18.2075 14.9324 18.535 14.9524 18.7925 14.7274Z"
				fill="white"
			/>
			<path
				opacity="0.35"
				d="M27.1126 4.03257C27.5682 4.03257 27.9376 3.6632 27.9376 3.20757C27.9376 2.75193 27.5682 2.38257 27.1126 2.38257C26.657 2.38257 26.2876 2.75193 26.2876 3.20757C26.2876 3.6632 26.657 4.03257 27.1126 4.03257Z"
				fill="white"
			/>
			<path
				opacity="0.35"
				d="M3.1824 16.3725C3.3499 16.37 3.3149 15.4325 3.7524 14.535C4.0599 13.9 4.4574 13.58 4.4549 13.225C4.4524 12.87 3.9749 11.14 3.6174 11.255C3.1199 11.4125 2.4849 12.0525 2.3424 13.05C2.1199 14.62 2.8749 16.3775 3.1824 16.3725Z"
				fill="white"
			/>
		</svg>
		<h1 class="mb-4 font-semibold text-zinc-100 text-2xl">You are verified!</h1>
		<p class="mb-8 max-w-sm text-center text-zinc-400">
			Thank you for verifying your email address, you may now fully start using Chirpify!
		</p>
		<div
			class="flex w-full max-w-sm items-center justify-center gap-2 rounded-lg border border-zinc-700 border-opacity-50 py-3 text-center font-medium text-zinc-100 hover:bg-zinc-800"
		>
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
			Redirecting to home...
		</div>
	{:else}
		<h1 class="mb-4 font-semibold text-zinc-100 text-2xl">Check your email!</h1>
		<p class="mb-8 max-w-sm text-center text-zinc-400">
			In order to start using Chirpify, you need to verify your account. We sent you a
			verification code to the email address you used.
		</p>

		<Pincode
			bind:this={pincode}
			bind:code
			bind:value
			bind:complete
			class="mb-4 flex w-full max-w-sm justify-between border-0"
			on:complete={async () => {
				loading = true
				await goto(`/verify/${data.uuid}?code=${value}`, { invalidateAll: true })
				loading = false
			}}
		>
			<PincodeInput class={error ? 'code-input-error' : 'code-input'} />
			<PincodeInput class={error ? 'code-input-error' : 'code-input'} />
			<PincodeInput class={error ? 'code-input-error' : 'code-input'} />
			<PincodeInput class={error ? 'code-input-error' : 'code-input'} />
			<PincodeInput class={error ? 'code-input-error' : 'code-input'} />
			<PincodeInput class={error ? 'code-input-error' : 'code-input'} />
		</Pincode>

		{#if error}
			<div class="mb-4 flex items-center gap-2 stroke-red-500 text-red-500">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-6 w-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
					/>
				</svg>
				Wrong code
			</div>
		{/if}

		<button
			class="w-full max-w-sm rounded-lg border border-zinc-700 border-opacity-50 py-3 font-medium text-zinc-100 hover:bg-zinc-800"
			disabled={loading || !complete}
			on:click|preventDefault={async () => {
				loading = true
				await goto(`/verify/${data.uuid}?code=${value}`, { invalidateAll: true })
				loading = false
			}}
		>
			{#if loading}
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
				Verify account
			{/if}
		</button>
	{/if}
</main>

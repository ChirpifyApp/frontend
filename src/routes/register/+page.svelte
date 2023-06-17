<script lang="ts">
	import { enhance } from '$app/forms'
	import { PUBLIC_API_URL } from '$env/static/public'
	import type { ActionData } from './$types'
	import { fade } from 'svelte/transition'

	export let form: ActionData

	let loading = false
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<main class="grid min-h-screen grid-rows-2 bg-zinc-900 xl:grid-cols-2 xl:grid-rows-none">
	<div class="flex items-center justify-center p-4 xl:p-32">
		<div>
			<h1 class="mb-6 font-bold text-5xl">Chirpify</h1>
			<p class="mb-2 max-w-prose text-zinc-400">
				Lorem ipsum dolor sit amet consectetur. Vulputate massa semper orci cursus habitasse
				pellentesque amet cras sit. Urna lacinia sit egestas amet vitae.
			</p>
			<a
				class="font-medium text-zinc-400 hover:underline"
				href="https://github.com/ChirpifyApp"
				target="_blank"
			>
				Github Repository →
			</a>
		</div>
	</div>
	<div class="flex items-center justify-center p-4 xl:p-32" transition:fade={{ duration: 150 }}>
		<div class="w-full max-w-prose xl:max-w-sm">
			<h1 class="mb-6 font-semibold text-2xl">Create an account</h1>
			<form
				action="?/register"
				enctype="multipart/form-data"
				method="POST"
				use:enhance={() => {
					loading = true

					return async ({ update }) => {
						await update()
						loading = false
					}
				}}
			>
				<div class="mb-4">
					<label class="mb-2 block font-medium" for="email">Email address</label>
					<input
						id="email"
						name="email"
						placeholder="Enter your email address"
						class="w-full rounded-lg border border-zinc-600 border-opacity-50 bg-zinc-800 px-4 py-3 placeholder-zinc-400
					focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-600"
						type="email"
						required
					/>
				</div>
				<div class="mb-4">
					<label class="mb-2 block font-medium" for="email">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						class="w-full rounded-lg border border-zinc-600 border-opacity-50 bg-zinc-800 px-4 py-3
					focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-600"
						required
					/>
				</div>
				<div class="mb-4">
					<label class="mb-2 block font-medium" for="email">Repeat password</label>
					<input
						id="repeatPassword"
						name="repeatPassword"
						type="password"
						class="w-full rounded-lg border border-zinc-600 border-opacity-50 bg-zinc-800 px-4 py-3
					focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-600"
						required
					/>
				</div>
				{#if form?.status && form.status !== 201}
					<p class="mb-4 flex items-center gap-2 fill-red-500 text-red-500">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="h-5 w-5">
							<path
								fill-rule="evenodd"
								d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
								clip-rule="evenodd"
							/>
						</svg>

						{form.message}
					</p>
				{/if}
				<button
					class="mb-2 w-full rounded-lg border border-blue-600 border-opacity-50 bg-blue-900 py-3 font-medium hover:bg-blue-600"
					type="submit"
					disabled={loading}
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
						Register
					{/if}
				</button>
				<div class="mb-2 flex flex-row items-center gap-3">
					<hr class="basis-full border-zinc-400" />
					<p class="text-center text-zinc-400">or</p>
					<hr class="basis-full border-zinc-400" />
				</div>
				<a
					class="mb-4 flex w-full items-center justify-center gap-3 rounded-lg border border-blue-600 border-opacity-50 bg-blue-900 py-3 font-medium hover:bg-blue-600"
					href="{PUBLIC_API_URL}/auth/discord/login"
				>
					<svg
						class="fill-zinc-100"
						height="19"
						viewBox="0 0 24 19"
						width="24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M20.3303 1.52238C18.7535 0.800473 17.0889 0.288326 15.3789 -0.000976562C15.1449 0.417312 14.9332 0.847674 14.7447 1.28831C12.9233 1.01385 11.071 1.01385 9.24963 1.28831C9.06097 0.84772 8.84926 0.417362 8.61537 -0.000976562C6.90435 0.290769 5.23861 0.804132 3.6602 1.52616C0.526645 6.16231 -0.322812 10.6833 0.101917 15.1401C1.937 16.496 3.99099 17.5271 6.17459 18.1887C6.66628 17.5274 7.10135 16.8259 7.47521 16.0915C6.76512 15.8263 6.07977 15.4991 5.42707 15.1137C5.59885 14.9891 5.76685 14.8608 5.92919 14.7362C7.82839 15.6293 9.90126 16.0924 12 16.0924C14.0987 16.0924 16.1716 15.6293 18.0708 14.7362C18.235 14.8702 18.403 14.9986 18.5729 15.1137C17.9189 15.4997 17.2323 15.8276 16.521 16.0934C16.8944 16.8274 17.3295 17.5284 17.8216 18.1887C20.0071 17.5298 22.0626 16.4991 23.898 15.142C24.3964 9.97354 23.0467 5.49407 20.3303 1.52238ZM8.0132 12.3992C6.82962 12.3992 5.8518 11.3251 5.8518 10.0037C5.8518 8.68236 6.79564 7.59883 8.00942 7.59883C9.2232 7.59883 10.1935 8.68236 10.1727 10.0037C10.1519 11.3251 9.21943 12.3992 8.0132 12.3992ZM15.9868 12.3992C14.8013 12.3992 13.8273 11.3251 13.8273 10.0037C13.8273 8.68236 14.7711 7.59883 15.9868 7.59883C17.2024 7.59883 18.1652 8.68236 18.1444 10.0037C18.1236 11.3251 17.193 12.3992 15.9868 12.3992Z"
							fill="white"
						/>
					</svg>
					Register using Discord
				</a>
			</form>
			<div class="flex flex-col items-center justify-between xsm:flex-row">
				<a class="text-zinc-400 hover:underline" href="/login"
					>I already have an account ↗</a
				>
			</div>
		</div>
	</div>
</main>

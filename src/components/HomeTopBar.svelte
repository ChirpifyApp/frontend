<style>
	.clip-bottom {
		clip-path: polygon(100% 50%, 0 100%, 100% 100%, 50% 0, 0 100%);
	}
</style>

<script lang="ts">
	import md5 from 'md5'

	export let email: string
	export let name: string | null

	const emailHash = md5(email.toLocaleLowerCase().trim())
	const gravatarUrl = `https://www.gravatar.com/avatar/${emailHash}?s=48&d=retro&r=g`
</script>

<header class="flex items-center justify-center bg-zinc-900 pb-12 pt-4">
	<div class="flex w-full max-w-xl items-center justify-between">
		<h1 class="font-bold text-zinc-100 text-2xl">Chirpify</h1>
		<div class="relative">
			<button>
				<img alt="Profile picture" class="h-12 w-12 rounded-full" src={gravatarUrl} />
			</button>
			<div class="absolute right-0 mt-2 hidden">
				<div class="flex flex-col">
					<div class="clip-bottom mr-4 h-2 w-4 self-end bg-zinc-800" />
					<div
						class="rounded-t-lg border-b border-zinc-600 border-opacity-50 bg-zinc-800 px-6 py-4"
					>
						<h3 class="font-medium">{name === null ? 'Name not set' : { name }}</h3>
						<h4 class="text-zinc-400">{email}</h4>
					</div>
					<div
						class="flex flex-col rounded-b-lg border-zinc-600 border-opacity-50 bg-zinc-800 px-6 py-4"
					>
						<a class="mb-2" href="#">Profile</a>
						<a href="#">Sign out →</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</header>

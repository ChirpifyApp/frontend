// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	// eslint-disable-next-line no-unused-vars
	namespace App {
		// interface Error {}
		// eslint-disable-next-line no-unused-vars
		interface Locals {
			session: string | undefined;
		}

		// interface PageData {}
		// interface Platform {}
	}
}

export {};

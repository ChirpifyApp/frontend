import type { Handle } from '@sveltejs/kit'

export const handle = (async ({ event, resolve }) => {
	event.locals.session = event.cookies.get('session')

	const response = await resolve(event)
	return response
}) satisfies Handle

import type { PageServerLoad } from './$types'
import { PUBLIC_API_URL } from '$env/static/public'
import { redirect } from '@sveltejs/kit'

export const load = (async ({ fetch, locals }) => {
	const session = locals.session
	if (!session) return

	const response = await fetch(`${PUBLIC_API_URL}/users/me`, {
		credentials: 'same-origin'
	})
	const status = response.status
	const body = await response.json()

	if (status !== 200) {
		// Invalid session
		throw redirect(307, '/login?error=invalid_session')
	} else {
		// Valid session
		if (!body.active) {
			// Not active user
			throw redirect(307, '/login?error=not_active')
		}
	}
	return {
		success: true,
		me: body
	}
}) satisfies PageServerLoad

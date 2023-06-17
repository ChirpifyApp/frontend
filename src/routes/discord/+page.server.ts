import type { PageServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'

export const load = (async ({ url, cookies }) => {
	const params = url.searchParams
	if (!params.has('jwt')) {
		throw redirect(307, '/login')
	} else {
		cookies.set('session', params.get('jwt')!, {
			maxAge: 86400,
			secure: true,
			sameSite: 'none'
		})
		throw redirect(307, '/home')
	}
}) satisfies PageServerLoad

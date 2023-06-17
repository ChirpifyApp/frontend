import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

const allowedPathNames = ['/login', '/register', '/resetpassword', '/verify']

export const load = (({ locals, url }) => {
	if (url.pathname === '/' && !locals.session) {
		throw redirect(307, '/login')
	} else if (url.pathname === '/' && locals.session) {
		throw redirect(307, '/home')
	} else if (
		allowedPathNames.filter(x => url.pathname.startsWith(x)).length == 0 &&
		!locals.session
	) {
		throw redirect(307, '/login?error=invalid_session')
	}
	return {
		session: locals.session
	}
}) satisfies LayoutServerLoad

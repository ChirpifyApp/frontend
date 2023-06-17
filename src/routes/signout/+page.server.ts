import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ cookies }) => {
	cookies.delete('session', { path: '/' });
	throw redirect(307, '/login')
}) satisfies PageServerLoad;

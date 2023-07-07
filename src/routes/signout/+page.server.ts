import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { myId } from '../../stores';

export const load = (async ({ cookies }) => {
	myId.set(undefined);
	cookies.delete('session', { path: '/' });
	throw redirect(307, '/login');
}) satisfies PageServerLoad;

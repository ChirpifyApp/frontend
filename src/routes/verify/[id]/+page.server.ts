import { PUBLIC_API_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ url, cookies }) => {
	const uuid = url.pathname.substring(url.pathname.lastIndexOf('/') + 1);
	const params = url.searchParams;
	const code = params.get('code');

	const response = await fetch(
		`${PUBLIC_API_URL}/users/verify/${uuid}${code ? `?code=${code}` : ''}`,
		{}
	);

	// not existing code: 404
	// already used: 401
	// invalid combo: 500

	if (response.status === 200) {
		const body = await response.json();
		cookies.set('session', body.jwt, { maxAge: 86400, secure: true, path: '/' });
		return {
			status: 200,
			success: true,
			code: code,
			uuid: uuid
		};
	} else if (response.status === 401) {
		throw error(401, 'This verification link has already been used. Please try again.');
	} else if (response.status === 404) {
		throw error(404, 'This verification link is invalid. Please try again.');
	} else if (response.status === 400 && code != null) {
		return {
			status: 500,
			success: false,
			code: code,
			uuid: uuid
		};
	} else {
		return {
			success: false,
			code: code,
			uuid: uuid
		};
	}
}) satisfies PageServerLoad;

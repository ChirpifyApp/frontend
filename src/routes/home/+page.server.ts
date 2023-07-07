import type { Actions, PageServerLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';
import { loadedPosts } from '../../stores';
import { get } from 'svelte/store';

export const load = (async ({ fetch, locals }) => {
	const session = locals.session;
	if (!session) return;

	const response = await fetch(`${PUBLIC_API_URL}/users/me`, {
		credentials: 'same-origin'
	});
	const status = response.status;
	const body = await response.json();

	if (status !== 200) {
		// Invalid session
		throw redirect(307, '/login?error=invalid_session');
	} else {
		// Valid session
		if (!body.active) {
			// Not active user
			throw redirect(307, '/login?error=not_active');
		}
	}
	return {
		success: true,
		me: body
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();

		const response = await fetch(`${PUBLIC_API_URL}/posts/create`, {
			method: 'POST',
			body: data,
			headers: {
				'Cookie': `session=${locals.session}`
			}
		});

		const status = response.status;
		const body = await response.json();

		console.log(status, body);

		if (status === 201) {
			// Success
			return {
				success: true,
				post: body,
				status: status
			}
		} else {
			// Error
			return {
				success: false,
				message: body.message,
				error: body.error,
				status: status
			}
		}
	},
} satisfies Actions;
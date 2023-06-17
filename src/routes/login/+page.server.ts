import type { Actions } from './$types'
import { PUBLIC_API_URL } from '$env/static/public'
import { redirect } from '@sveltejs/kit'

export const actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData()

		const response = await fetch(`${PUBLIC_API_URL}/users/login`, {
			method: 'POST',
			body: JSON.stringify(Object.fromEntries(data)),
			headers: {
				'Content-Type': 'application/json'
			}
		})

		const status = response.status
		const body = await response.json()

		if (status === 401) {
			// Wrong credentials
			return {
				status,
				message: 'Incorrect credentials.'
			}
		} else if (status === 403) {
			return {
				status,
				message: 'Account is not verified.'
			}
		} else if (status !== 201) {
			return {
				status,
				message: 'Something went wrong.'
			}
		} else {
			cookies.set('session', body.jwt, { maxAge: 86400, secure: true })
			throw redirect(307, '/home')
		}
	}
} satisfies Actions

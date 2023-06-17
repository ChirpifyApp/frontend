import type { Actions } from './$types'
import { PUBLIC_API_URL } from '$env/static/public'
import { redirect } from '@sveltejs/kit'

export const actions = {
	register: async ({ request }) => {
		const data = await request.formData()
		if (data.get('password') !== data.get('repeatPassword')) {
			return {
				status: 400,
				message: 'Passwords do not match.'
			}
		}

		data.delete('repeatPassword')

		const response = await fetch(`${PUBLIC_API_URL}/users/register`, {
			method: 'POST',
			body: JSON.stringify(Object.fromEntries(data)),
			headers: {
				'Content-Type': 'application/json'
			}
		})

		const status = response.status
		const body = await response.json()

		if (status == 409) {
			// User already exists
			return {
				status,
				message: 'This email is already in use.'
			}
		} else if (status !== 201) {
			return {
				status,
				message: 'Something went wrong.'
			}
		} else {
			throw redirect(307, `/verify/${body.code}`)
		}
	}
} satisfies Actions

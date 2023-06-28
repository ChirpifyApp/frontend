/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,ts,svelte,js}'],
	theme: {
		extend: {
			screens: {
				xsm: '384px'
			},
			maxWidth: {
				xsm: '256px'
			}
		}
	},
	plugins: [require('tailwindcss-font-inter'), require('prettier-plugin-tailwindcss')]
};

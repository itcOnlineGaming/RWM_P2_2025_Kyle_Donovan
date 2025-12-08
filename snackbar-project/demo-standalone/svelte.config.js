import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		
		// Team 4 deployment path - only used for production
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/Team_4' : ''
		}
	}
};
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		
		// Team 4 deployment path
		paths: {
			base: '/Team_4'
		}
	}
};
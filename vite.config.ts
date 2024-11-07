import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import config from './src/routes/config.json'

export default defineConfig({
	plugins: [sveltekit()],
	server: {fs: {allow: [
		config.request_url
	]}}
});

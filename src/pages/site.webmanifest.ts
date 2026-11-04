import type { APIRoute } from 'astro';
import { site, es } from '../data/site';

export const GET: APIRoute = () =>
	new Response(
		JSON.stringify({
			name: `${site.name} — Creadora de contenido UGC`,
			short_name: site.name,
			description: es('seo_desc'),
			lang: 'es-PE',
			start_url: '/',
			display: 'standalone',
			background_color: '#faf6ee',
			theme_color: '#7a1238',
			icons: [
				{ src: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' },
				{ src: '/apple-touch-icon.png', type: 'image/png', sizes: '180x180' },
			],
		}),
		{ headers: { 'Content-Type': 'application/manifest+json' } },
	);

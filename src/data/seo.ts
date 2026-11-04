// Datos de SEO: palabras clave del nicho, ubicación e imagen para compartir.
// El contenido visible (títulos, descripciones, FAQ) vive en `site.ts`.
import { site } from './site';

export const seo = {
	/** Búsquedas de marcas y agencias que contratan creadoras UGC en Perú. */
	keywords: [
		'creadora de contenido UGC',
		'creadora UGC Perú',
		'creadora de contenido Arequipa',
		'influencer Arequipa',
		'influencer Perú',
		'UGC creator Peru',
		'contenido UGC para marcas',
		'videos UGC',
		'TikTok para marcas',
		'Reels para marcas',
		'marketing de influencers Perú',
		'microinfluencer Perú',
		'influencer de moda Perú',
		'influencer de belleza Perú',
		'influencer lifestyle',
		'Flavia López',
	],
	knowsAbout: [
		'Contenido UGC',
		'Marketing de influencers',
		'TikTok',
		'Instagram Reels',
		'Moda',
		'Belleza',
		'Gastronomía',
		'Viajes',
		'Música y conciertos',
		'Lifestyle',
	],
	/** Centro de Arequipa (Plaza de Armas). */
	geo: { lat: -16.3988, lng: -71.5369 },
	/** Fecha del último build, para `dateModified` y el sitemap. */
	buildDate: new Date().toISOString().slice(0, 10),
};

/** Nombre de cada tarifa para los datos estructurados y llms.txt. */
export const serviceNames: Record<string, string> = {
	historia: 'Historia de Instagram',
	reel: 'Reel de Instagram',
	post: 'Post de Instagram',
	tiktok: 'Video de TikTok con temática específica',
	replica: 'Pack TikTok + Reel',
	'uso-imagen': 'Uso de imagen para eventos y lanzamientos',
};

export const ogImage = { url: `${site.url}/og-image.jpg`, path: '/og-image.jpg', w: 1200, h: 630 };

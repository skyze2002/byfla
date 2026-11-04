import type { APIRoute } from 'astro';
import { site, heroPhoto, aboutPhotos, es } from '../data/site';
import { seo, ogImage } from '../data/seo';
import { publicAsset } from '../data/assets';

// Sitio de una sola página: la URL principal con sus imágenes (Google Imágenes).
export const GET: APIRoute = () => {
	const images = [
		{ src: heroPhoto.src, title: es('alt_hero') },
		...aboutPhotos.filter((p) => publicAsset(p.src)).map((p) => ({ src: p.src, title: es(p.altKey) })),
		{ src: ogImage.path, title: es('seo_og_alt') },
	];
	const esc = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;');
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${site.url}/</loc>
    <lastmod>${seo.buildDate}</lastmod>
${images.map((i) => `    <image:image><image:loc>${site.url}${i.src}</image:loc><image:title>${esc(i.title)}</image:title></image:image>`).join('\n')}
  </url>
</urlset>
`;
	return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};

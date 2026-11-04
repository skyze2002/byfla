import type { APIRoute } from 'astro';
import { site, contact, metrics, prices, brands, faqKeys, compact, t, es } from '../data/site';
import { serviceNames } from '../data/seo';

// Resumen en texto plano para buscadores con IA (ChatGPT, Perplexity, Gemini),
// que cada vez más marcas usan para encontrar creadoras.
export const GET: APIRoute = () => {
	const body = `# ${site.name} — Creadora de contenido UGC en Arequipa, Perú

> ${es('seo_desc')}

## Perfil
- Creadora de contenido UGC e influencer de moda, belleza, comida, viajes, música y lifestyle.
- Base: Arequipa, Perú. Trabaja con marcas de todo el Perú y del extranjero.
- Idiomas: español e inglés.
- TikTok ${contact.tiktok.handle}: ${compact(metrics.tiktokFollowers)} seguidores, ${compact(metrics.tiktokLikes)} likes.
- Instagram ${contact.instagram.handle}: ${compact(metrics.instagramFollowers)} seguidores.
- Audiencia: ${metrics.peruAudience}% en Perú, mayoría de 18 a 34 años.
- Marcas con las que colaboró: ${brands.map((b) => b.name).join(', ')}.

## Tarifas de referencia (USD)
${prices.map((p) => `- ${serviceNames[p.id]}: $${p.price}`).join('\n')}
- ${es('rates_negotiate')}

## Preguntas frecuentes
${faqKeys.map((k) => `### ${t.es[`${k}_q`]}\n${t.es[`${k}_a`]}`).join('\n\n')}

## Contacto
- Web: ${site.url}/
- WhatsApp: ${contact.whatsapp}
- Email: ${contact.email}
- Instagram: ${contact.instagram.url}
- TikTok: ${contact.tiktok.url}
`;
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

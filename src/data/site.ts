// Fuente única de contenido y datos del sitio.
// Los componentes solo leen de aquí: ningún texto ni número va hardcodeado en ellos.

export type Lang = 'es' | 'en';
export type Tone = 'cherry' | 'pink' | 'butter' | 'ink' | 'sky' | 'tomato' | 'leaf' | 'paper';

/* ---------- Formatos numéricos ---------- */

/** 93400 → "93.4K", 3600000 → "3.6M" */
export function compact(n: number): string {
	const fmt = (v: number) => (v % 1 === 0 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, ''));
	if (n >= 1e6) return fmt(Math.floor(n / 1e5) / 10) + 'M';
	if (n >= 1e3) return fmt(Math.floor(n / 1e2) / 10) + 'K';
	return String(Math.round(n));
}
/** 93400 → "93K" */
export const roundK = (n: number) => Math.floor(n / 1e3) + 'K';
/** 93400 → "93,000" */
const floorThousands = (n: number) => (Math.floor(n / 1e3) * 1e3).toLocaleString('en-US');

/* ---------- Sitio, contacto y SEO ---------- */

export const site = {
	url: 'https://byfla.com',
	name: 'Flavia López',
	firstName: 'FLAVIA',
	introWord: 'FLA',
	city: 'Arequipa',
	country: 'Perú',
	year: 2026,
};

export const contact = {
	email: 'flopezagostinelli@gmail.com',
	phone: '+51944143647',
	phoneDisplay: '+51 944 143 647',
	whatsapp: 'https://wa.me/51944143647',
	instagram: { handle: '@lopezagostinelli', url: 'https://www.instagram.com/lopezagostinelli' },
	tiktok: { handle: '@flachita', url: 'https://www.tiktok.com/@flachita' },
};

/* ---------- Métricas (una sola fuente para todo el sitio) ---------- */

export const metrics = {
	tiktokFollowers: 93400,
	instagramFollowers: 11600,
	tiktokLikes: 3600000,
	peruAudience: 88,
	yearsCreating: 3,
};

export const audience = {
	ageTiktok: [
		{ range: '18-24', pct: 47.5 },
		{ range: '25-34', pct: 34.9 },
		{ range: '35+', pct: 17.6 },
	],
	ageInstagram: [
		{ range: '25-34', pct: 51 },
		{ range: '18-24', pct: 29.2 },
		{ range: '35+', pct: 19.8 },
	],
	geo: [
		{ flag: '🇵🇪', key: 'geo_pe', pct: 88.4 },
		{ flag: '🇺🇸', key: 'geo_us', pct: 2 },
		{ flag: '🇪🇸', key: 'geo_es', pct: 1.3 },
	],
};

/** Stickers de métricas del hero y tiles de la sección de números. */
export const metricCards = [
	{ key: 'tiktok', value: metrics.tiktokFollowers, suffix: '+', format: 'compact', labelKey: 'm_tiktok', sub: contact.tiktok.handle, tone: 'pink' as Tone },
	{ key: 'instagram', value: metrics.instagramFollowers, suffix: '+', format: 'compact', labelKey: 'm_instagram', sub: contact.instagram.handle, tone: 'sky' as Tone },
	{ key: 'likes', value: metrics.tiktokLikes, suffix: '+', format: 'compact', labelKey: 'm_likes', sub: 'TikTok', tone: 'butter' as Tone },
	{ key: 'peru', value: metrics.peruAudience, suffix: '%', format: 'int', labelKey: 'm_peru', sub: '🇵🇪', tone: 'tomato' as Tone },
];

/* ---------- Portafolio ---------- */

export type Category = 'todo' | 'moda' | 'belleza' | 'viajes' | 'comida' | 'ugc' | 'eventos';
export type Platform = 'instagram' | 'tiktok';

export const categories: { id: Exclude<Category, 'todo'>; key: string }[] = [
	{ id: 'moda', key: 'filter_fashion' },
	{ id: 'belleza', key: 'filter_beauty' },
	{ id: 'viajes', key: 'filter_travel' },
	{ id: 'comida', key: 'filter_food' },
	{ id: 'ugc', key: 'filter_ugc' },
	{ id: 'eventos', key: 'filter_events' },
];

export const platforms: Record<Platform, { name: string; symbol: string; tone: Tone }> = {
	instagram: { name: 'Instagram', symbol: '◎', tone: 'pink' },
	tiktok: { name: 'TikTok', symbol: '♪', tone: 'sky' },
};

/** `category: 'todo'` = solo aparece en el filtro "Todo" (igual que en la versión anterior). */
export const portfolio: {
	id: string;
	platform: Platform;
	category: Category;
	titleKey: string;
	embed: string;
	tone: Tone;
}[] = [
	{ id: '01', platform: 'instagram', category: 'moda', titleKey: 'w_01', embed: 'https://www.instagram.com/reel/DbHb8L9gO3J/embed/', tone: 'butter' },
	{ id: '02', platform: 'instagram', category: 'moda', titleKey: 'w_02', embed: 'https://www.instagram.com/p/DYAQUUngDAg/embed/', tone: 'pink' },
	{ id: '03', platform: 'instagram', category: 'moda', titleKey: 'w_03', embed: 'https://www.instagram.com/p/DXaAdCUgAWy/embed/', tone: 'sky' },
	{ id: '04', platform: 'tiktok', category: 'todo', titleKey: 'w_04', embed: 'https://www.tiktok.com/embed/v2/7610254529031851271', tone: 'tomato' },
	{ id: '05', platform: 'tiktok', category: 'moda', titleKey: 'w_05', embed: 'https://www.tiktok.com/embed/v2/7580126377324662034', tone: 'leaf' },
	{ id: '06', platform: 'tiktok', category: 'ugc', titleKey: 'w_06', embed: 'https://www.tiktok.com/embed/v2/7580827398623563015', tone: 'cherry' },
	{ id: '07', platform: 'instagram', category: 'moda', titleKey: 'w_07', embed: 'https://www.instagram.com/reel/DU2D9M8gDKQ/embed/', tone: 'butter' },
	{ id: '08', platform: 'tiktok', category: 'belleza', titleKey: 'w_08', embed: 'https://www.tiktok.com/embed/v2/7601254878060481810', tone: 'pink' },
	{ id: '09', platform: 'instagram', category: 'moda', titleKey: 'w_09', embed: 'https://www.instagram.com/reel/DO9ySKEAHhx/embed/', tone: 'sky' },
];

/* ---------- Marcas ---------- */

export const brands = [
	{ name: 'Crepier', src: '/images/logos/marca1.png', w: 476, h: 140 },
	{ name: 'Coca-Cola', src: '/images/logos/marca2.png', w: 640, h: 241 },
	{ name: 'Eucerin', src: '/images/logos/marca3.png', w: 640, h: 292 },
	{ name: 'Bath & Body Works', src: '/images/logos/marca4.png', w: 183, h: 157 },
	{ name: 'Johnnie Walker', src: '/images/logos/marca5.jpg', w: 540, h: 340 },
	{ name: 'Carolina Herrera', src: '/images/logos/marca6.png', w: 546, h: 582 },
	{ name: 'Milano Bags', src: '/images/logos/marca7.png', w: 175, h: 79 },
	{ name: 'Vélez', src: '/images/logos/marca8.png', w: 640, h: 162 },
	{ name: 'Tous', src: '/images/logos/marca9.png', w: 640, h: 235 },
];

export const brandStats = [
	{ value: '100%', key: 'brands_delivery' },
	{ value: 'Nac. & Int.', valueKey: 'brands_reach', key: 'brands_collab' },
	{ value: '24h', key: 'brands_response' },
];

/* ---------- Tarifas ---------- */

export const prices = [
	{ id: 'historia', select: 'historia', price: 100, tone: 'sky', platform: 'Instagram', nameKey: 'rate_story_name', descKey: 'rate_story_desc', noteKey: 'rate_story_value', r: -1.5 },
	{ id: 'reel', select: 'reel', price: 350, tone: 'butter', platform: 'Instagram', nameKey: 'rate_reel_name', descKey: 'rate_reel_desc', noteKey: 'rate_reel_value', r: 1.2 },
	{ id: 'post', select: 'post', price: 350, tone: 'pink', platform: 'Instagram', nameKey: 'rate_post_name', descKey: 'rate_post_desc', noteKey: 'rate_post_value', r: -1 },
	{ id: 'tiktok', select: 'tiktok', price: 400, tone: 'cherry', platform: 'TikTok', nameKey: 'rate_tiktok_short', subKey: 'rate_tiktok_name', descKey: 'rate_tiktok_desc', noteKey: 'rate_tiktok_value', r: 1.6 },
	{ id: 'replica', select: 'replica', price: 450, tone: 'tomato', platformKey: 'rate_pack_platform', nameKey: 'rate_replica_name', descKey: 'rate_replica_desc', noteKey: 'rate_replica_value', r: -0.8, featured: true },
	{ id: 'uso-imagen', select: 'uso-imagen', price: 200, tone: 'leaf', platformKey: 'rate_events_platform', nameKey: 'rate_image_name', descKey: 'rate_image_desc', noteKey: 'rate_image_value', r: 1 },
] as const;

const priceOf = (id: string) => prices.find((p) => p.id === id)!.price;
export const packSaving = priceOf('tiktok') + priceOf('reel') - priceOf('replica');

/* ---------- Formulario (Web3Forms) ---------- */

export const form = {
	endpoint: 'https://api.web3forms.com/submit',
	accessKey: 'f461b3b7-ca5b-4d54-81ea-cf6c5e85445d',
	subject: 'Nueva propuesta de colaboración — byfla.com',
	typeValues: ['', 'reel', 'tiktok', 'historia', 'post', 'replica', 'uso-imagen', 'paquete', 'otro'],
	budgetValues: ['', '100-300', '300-500', '500-1000', '1000+', 'por-definir'],
};

/* ---------- Varios ---------- */

export const niches = [
	{ key: 'niche_fashion', tone: 'pink', r: -4 },
	{ key: 'niche_travel', tone: 'sky', r: 3 },
	{ key: 'niche_food', tone: 'butter', r: -2 },
	{ key: 'niche_music', tone: 'tomato', r: 5 },
	{ key: 'niche_concerts', tone: 'cherry', r: -3 },
	{ key: 'niche_lifestyle', tone: 'leaf', r: 2 },
] as const;

export const gear = [
	{ name: 'DJI Osmo Pocket 3', descKey: 'gear_dji_desc', icon: '◉' },
	{ name: 'iPhone 17 Pro', descKey: 'gear_iphone_desc', icon: '▣' },
];

export const aboutPhotos = [
	{ src: '/images/foto2.jpg', w: 1200, h: 1600, altKey: 'alt_about', captionKey: 'cap_about', tone: 'pink', r: -3, parallax: 0.06 },
	{ src: '/images/foto3.jpg', w: 900, h: 1200, altKey: 'alt_about_2', captionKey: 'cap_bts', tone: 'sky', r: 6, parallax: 0.16 },
	{ src: '/images/foto4.jpg', w: 900, h: 1200, altKey: 'alt_about_3', captionKey: 'cap_set', tone: 'butter', r: -7, parallax: 0.1 },
] as const;

export const heroPhoto = { src: '/images/foto1.jpg', w: 960, h: 1280 };

export const nav = [
	{ href: '#sobre-mi', key: 'nav_about' },
	{ href: '#portafolio', key: 'nav_portfolio' },
	{ href: '#tarifas', key: 'nav_rates' },
	{ href: '#contacto', key: 'nav_contact' },
];

export const marquees = {
	heroA: ['m_ugc', 'niche_fashion', 'niche_travel', 'niche_food', 'niche_concerts', 'niche_lifestyle'],
	heroB: ['mq_real', 'mq_made', 'mq_connect', 'mq_sell'],
	work: ['cta_primary', 'mq_reply', 'brands_delivery', 'mq_reach'],
};

export const typewriter = {
	es: ['moda', 'viajes', 'comida', 'conciertos', 'lifestyle'],
	en: ['fashion', 'travel', 'food', 'concerts', 'lifestyle'],
};

/** Preguntas frecuentes: cada clave tiene su `_q` y su `_a` en `t`. */
export const faqKeys = ['faq_1', 'faq_2', 'faq_3', 'faq_4', 'faq_5', 'faq_6'] as const;

/* ---------- Textos ES / EN ---------- */

const tt = metrics.tiktokFollowers;
const likes = compact(metrics.tiktokLikes);
const peru = metrics.peruAudience;
const minPrice = Math.min(...prices.map((p) => p.price));
const maxPrice = Math.max(...prices.map((p) => p.price));
const ig = compact(metrics.instagramFollowers);
const brandList = brands.map((b) => b.name);
const brandsShort = `${brandList.slice(1, 4).join(', ')}`;

export const t = {
	es: {
		// SEO
		seo_title: 'Creadora de contenido UGC en Arequipa, Perú | Flavia López',
		seo_desc: `Creadora de contenido UGC e influencer en Arequipa con ${roundK(tt)} seguidores en TikTok. Videos para marcas de moda, belleza y lifestyle. Tarifas desde $${minPrice}.`,
		seo_og_alt: 'Flavia López, creadora de contenido UGC en Arequipa, Perú',
		skip: 'Saltar al contenido',
		// Navegación
		nav_about: 'Sobre mí',
		nav_portfolio: 'Portafolio',
		nav_rates: 'Tarifas',
		nav_contact: 'Contacto',
		nav_home: 'Flavia López - Inicio',
		cta_primary: 'Trabajemos juntos',
		cta_portfolio: 'Ver portafolio',
		lang_switch: 'Cambiar idioma a inglés',
		menu_open: 'Abrir menú',
		menu_close: 'Cerrar menú',
		// Intro
		intro_hi: 'hola!',
		intro_scroll: 'desliza para entrar',
		// Hero
		hero_eyebrow: 'Creadora de contenido · Arequipa, Perú',
		hero_hi: 'hola, soy',
		hero_h1_sr: 'López, creadora de contenido UGC en Arequipa, Perú',
		hero_subtitle: 'Creadora de Contenido & UGC Specialist',
		hero_type: 'contenido real de',
		hero_type_sr: typewriter.es.join(', '),
		hero_desc: 'Transformando experiencias reales en contenido que conecta marcas con personas. Moda · Viajes · Comida · Lifestyle',
		hero_caption: 'esta soy yo ♡',
		hero_seal: 'contenido real ✶ arequipa ✶ ugc ✶ ',
		hero_scroll: 'baja ↓',
		alt_hero: 'Flavia López, creadora de contenido UGC en Arequipa, Perú',
		drag_hint: 'arrástrame',
		m_tiktok: 'seguidores TikTok',
		m_instagram: 'seguidores Instagram',
		m_likes: 'likes totales',
		m_peru: 'audiencia peruana',
		m_ugc: 'UGC',
		// Cintas
		mq_real: 'contenido real',
		mq_made: 'hecho en Arequipa',
		mq_connect: 'marcas que conectan',
		mq_sell: 'historias que venden',
		mq_reply: 'respuesta en 24h',
		mq_reach: 'nacional & internacional',
		// Sobre mí
		about_eyebrow: 'Sobre mí',
		about_title_1: 'Soy Flavia.',
		about_title_2: 'Creo contenido',
		about_title_3: 'real.',
		about_bio: `Soy creadora de contenido basada en Arequipa, Perú. Con más de ${floorThousands(tt)} seguidores en TikTok y ${(metrics.tiktokLikes / 1e6).toLocaleString('es-PE')} millones de likes, construyo contenido que no solo se ve — se siente.`,
		about_p2: 'Mi propuesta es simple: ser real. Nada de guiones forzados ni estética perfecta. Creo videos que conectan porque vienen de experiencias genuinas — un concierto, un restaurante increíble, un outfit que me encantó, un viaje que cambió algo en mí.',
		about_p3: 'Trabajo con marcas que entienden que la autenticidad convierte mejor que la perfección. Mi audiencia joven (18-34 años) en Perú confía en mis recomendaciones porque sabe que son honestas.',
		about_brands: 'He colaborado con marcas peruanas e internacionales en campañas de moda, gastronomía, viajes y lifestyle.',
		about_years: 'años creando',
		about_gear_title: 'Mi equipo de producción',
		about_niches_label: 'Mis nichos',
		gear_dji_desc: 'Vídeo estabilizado, vlogs y contenido en movimiento',
		gear_iphone_desc: 'Reels, fotos lifestyle y contenido nativo de plataforma',
		rec: 'REC',
		niche_fashion: 'Moda',
		niche_travel: 'Viajes',
		niche_food: 'Comida',
		niche_music: 'Música',
		niche_concerts: 'Conciertos',
		niche_lifestyle: 'Lifestyle',
		alt_about: 'Flavia López grabando contenido para marcas en Arequipa',
		alt_about_2: 'Flavia López grabando contenido',
		alt_about_3: 'Flavia López en una sesión',
		cap_about: 'arequipa ♡',
		cap_bts: 'detrás de cámaras',
		cap_set: 'en set ✶',
		// Números
		stats_eyebrow: 'Métricas reales',
		stats_h1: 'Números que',
		stats_h2: 'hablan',
		stats_h3: 'solos',
		stats_demo_tiktok: `Edad · TikTok ${contact.tiktok.handle}`,
		stats_demo_ig: `Edad · Instagram ${contact.instagram.handle}`,
		stats_geo: 'Distribución geográfica',
		stats_note: '¡mi gente! ♡',
		geo_pe: 'Perú',
		geo_us: 'EEUU',
		geo_es: 'España',
		// Portafolio
		portfolio_eyebrow: 'Portafolio',
		portfolio_h1: 'Contenido que',
		portfolio_h2: 'convierte',
		portfolio_desc: 'Videos reales que generan conexión. Cada pieza creada con intención y autenticidad.',
		portfolio_cta_text: '¿Quieres ver más contenido?',
		portfolio_ig: 'Ver Instagram',
		portfolio_tt: 'Ver TikTok completo',
		portfolio_filters: 'Filtrar portafolio',
		filter_all: 'Todo',
		filter_fashion: 'Moda',
		filter_beauty: 'Belleza',
		filter_travel: 'Viajes',
		filter_food: 'Comida',
		filter_ugc: 'UGC',
		filter_events: 'Eventos',
		work_play: 'Ver video',
		cursor_view: '▶ Ver',
		viewer_label: 'Reproductor de contenido',
		viewer_close: 'Cerrar reproductor',
		w_01: 'Reel de Instagram',
		w_02: 'Publicación',
		w_03: 'Publicación',
		w_04: 'Mi Primer Tatuaje',
		w_05: 'Lentes Nuevos',
		w_06: 'Coca-Cola',
		w_07: 'Outfit',
		w_08: 'Coral',
		w_09: 'Bolsos de Milano Bags',
		// Marcas
		brands_eyebrow: 'Colaboraciones',
		brands_h1: 'Marcas que',
		brands_h2: 'confiaron',
		brands_h3: 'en mí',
		brands_delivery: 'Entrega a tiempo',
		brands_reach: 'Nac. & Int.',
		brands_collab: 'Marcas colaboradoras',
		brands_response: 'Tiempo de respuesta',
		// Tarifas
		rates_eyebrow: 'Inversión',
		rates_h1: 'Inversión de referencia.',
		rates_h2: 'Sin sorpresas.',
		rates_desc: 'Precios base para cada formato de contenido. Cada campaña es única — contáctame para una propuesta a medida.',
		rates_want: 'Lo quiero',
		rates_fav: '¡el favorito de las marcas!',
		rates_saving: `Ahorras $${packSaving}`,
		rates_note: 'Los costos de viaje y traslado no están incluidos. Para activaciones fuera de Arequipa se cotiza por separado.',
		rates_note_label: 'Nota:',
		rates_custom_title: '¿Necesitas algo diferente?',
		rates_custom_desc: 'Campañas largas, exclusividad, derechos de uso extendidos o paquetes a medida. Cuéntame tus objetivos y preparamos una propuesta.',
		rates_custom_btn: 'Solicitar propuesta',
		rates_custom_note: 'a tu medida ✂',
		rates_negotiate: 'Los precios varían según brief, duración y derechos de uso.',
		rate_pack_platform: 'Pack Especial',
		rate_events_platform: 'Adicionales',
		rate_story_name: 'Historia',
		rate_reel_name: 'Reel',
		rate_post_name: 'Post',
		rate_tiktok_short: 'TikTok',
		rate_tiktok_name: 'Video temática específica',
		rate_replica_name: 'TikTok + Reel',
		rate_image_name: 'Uso de imagen',
		rate_story_desc: '24h de exposición, sticker de enlace',
		rate_reel_desc: 'Video hasta 90 seg, audio libre',
		rate_post_desc: 'Foto o carrusel, caption incluido',
		rate_tiktok_desc: 'Duración 30-60 seg, sonido viral',
		rate_replica_desc: 'El mismo contenido adaptado a ambas plataformas',
		rate_image_desc: 'Licencia de uso comercial del contenido',
		rate_story_value: 'Ideal para promociones y lanzamientos rápidos',
		rate_reel_value: `Audiencia 25-34 años, ${peru}% peruana. Entrega en 5 días.`,
		rate_post_value: 'Contenido permanente con alto potencial de guardados',
		rate_tiktok_value: `${roundK(tt)} seguidores, ${likes} likes acumulados. Máximo alcance orgánico.`,
		rate_replica_value: 'Presencia simultánea en TikTok e Instagram. Doble alcance.',
		rate_image_value: 'Reutiliza el contenido en tus canales y anuncios',
		// Contacto
		// Preguntas frecuentes
		faq_eyebrow: 'Preguntas frecuentes',
		faq_h1: 'Lo que las marcas',
		faq_h2: 'me preguntan',
		faq_1_q: '¿Qué es el contenido UGC y por qué funciona?',
		faq_1_a: 'UGC (User Generated Content) es contenido grabado por una creadora real, con su voz y su estilo, en lugar de un anuncio tradicional. Se siente como la recomendación de alguien de confianza, por eso genera más interacción y conversiones en TikTok, Reels y anuncios pagados.',
		faq_2_q: '¿Cuánto cuesta un video UGC o una colaboración?',
		faq_2_a: `Mis tarifas de referencia van desde $${minPrice} por una historia de Instagram hasta $${maxPrice} por el pack TikTok + Reel. Un Reel o un post cuestan $${priceOf('reel')} y un TikTok temático $${priceOf('tiktok')}. El precio final depende del brief, la duración y los derechos de uso.`,
		faq_3_q: '¿Con qué tipo de marcas trabajas?',
		faq_3_a: `Con marcas de moda, belleza, gastronomía, viajes, música y lifestyle. He colaborado con marcas peruanas e internacionales como ${brandsShort} y ${brandList[4]}.`,
		faq_4_q: '¿Trabajas solo en Arequipa?',
		faq_4_a: 'Vivo en Arequipa, Perú, y trabajo con marcas de todo el país y del extranjero. El contenido UGC se graba y se entrega a distancia; para activaciones presenciales fuera de Arequipa, los traslados se cotizan aparte.',
		faq_5_q: '¿Cómo es tu audiencia?',
		faq_5_a: `Tengo ${compact(tt)} seguidores en TikTok y ${ig} en Instagram. El ${peru}% de mi audiencia está en Perú y la mayoría tiene entre 18 y 34 años.`,
		faq_6_q: '¿Cómo empezamos una colaboración?',
		faq_6_a: 'Completa el formulario de contacto o escríbeme por WhatsApp con tu marca, el tipo de contenido y tu presupuesto. Te respondo en menos de 24 horas con una propuesta.',
		contact_eyebrow: 'Contacto',
		contact_hi: 'hola!',
		contact_h1: 'Hagamos algo',
		contact_h2: 'increíble',
		contact_h3: 'juntos',
		contact_tagline: 'Respondo en menos de 24 horas. Cuéntame sobre tu marca y lo que quieres lograr.',
		contact_avail: 'Arequipa, Perú — Disponible para proyectos nacionales e internacionales',
		contact_form_label: 'Formulario de contacto',
		contact_submit: 'Enviar por WhatsApp',
		contact_privacy: 'Tu información está segura. No la compartimos con terceros.',
		contact_success_title: '¡Ya casi!',
		contact_success_desc: 'Se abrió WhatsApp con tu propuesta lista. Solo presiona enviar y te responderé en menos de 24 horas.',
		contact_whatsapp: 'Abrir WhatsApp de nuevo',
		contact_error: 'Algo salió mal al enviar. Inténtalo de nuevo o escríbeme por WhatsApp.',
		contact_required: 'Completa los campos obligatorios.',
		form_name: 'Nombre completo',
		form_email: 'Email corporativo',
		form_company: 'Empresa / Marca',
		form_type: 'Tipo de contenido',
		form_budget: 'Presupuesto aproximado (USD)',
		form_message: 'Mensaje / Brief del proyecto',
		ph_name: 'Tu nombre completo',
		ph_email: 'tu@empresa.com',
		ph_company: 'Nombre de tu empresa o marca',
		ph_message: 'Cuéntame sobre tu marca, el producto o servicio que quieres promocionar, y el objetivo de la campaña...',
		content_type: ['Seleccionar tipo', 'Reel de Instagram ($350)', 'Video TikTok ($400)', 'Historia Instagram ($100)', 'Post Instagram ($350)', 'Réplica TikTok + Reel ($450)', 'Uso de imagen ($200)', 'Paquete personalizado', 'Otro / Consulta'],
		budget_range: ['Seleccionar rango', '$100 – $300 USD', '$300 – $500 USD', '$500 – $1,000 USD', 'Más de $1,000 USD', 'Por definir'],
		// Footer
		footer_tagline: 'Creadora de contenido auténtico desde Arequipa, Perú.',
		footer_nav: 'Navegación',
		footer_connect: 'Conectemos',
		footer_rights: 'Todos los derechos reservados.',
		footer_availability: 'Arequipa, Perú · Disponible para colaboraciones nacionales e internacionales',
		footer_top: 'Volver arriba',
	},
	en: {
		seo_title: 'UGC Content Creator in Arequipa, Peru | Flavia López',
		seo_desc: `UGC content creator and influencer in Arequipa, Peru with ${roundK(tt)} TikTok followers. Videos for fashion, beauty, food and lifestyle brands. Rates from $${minPrice}.`,
		seo_og_alt: 'Flavia López, UGC content creator in Arequipa, Peru',
		skip: 'Skip to content',
		nav_about: 'About',
		nav_portfolio: 'Portfolio',
		nav_rates: 'Rates',
		nav_contact: 'Contact',
		nav_home: 'Flavia López - Home',
		cta_primary: "Let's work together",
		cta_portfolio: 'View portfolio',
		lang_switch: 'Switch language to Spanish',
		menu_open: 'Open menu',
		menu_close: 'Close menu',
		intro_hi: 'hi!',
		intro_scroll: 'scroll to enter',
		hero_eyebrow: 'Content creator · Arequipa, Peru',
		hero_hi: "hi, I'm",
		hero_h1_sr: 'López, UGC content creator in Arequipa, Peru',
		hero_subtitle: 'Content Creator & UGC Specialist',
		hero_type: 'real content about',
		hero_type_sr: typewriter.en.join(', '),
		hero_desc: 'Turning real experiences into content that connects brands with people. Fashion · Travel · Food · Lifestyle',
		hero_caption: 'this is me ♡',
		hero_seal: 'real content ✶ arequipa ✶ ugc ✶ ',
		hero_scroll: 'scroll ↓',
		alt_hero: 'Flavia López, UGC content creator in Arequipa, Peru',
		drag_hint: 'drag me',
		m_tiktok: 'TikTok followers',
		m_instagram: 'Instagram followers',
		m_likes: 'total likes',
		m_peru: 'Peruvian audience',
		m_ugc: 'UGC',
		mq_real: 'real content',
		mq_made: 'made in Arequipa',
		mq_connect: 'brands that connect',
		mq_sell: 'stories that sell',
		mq_reply: 'reply within 24h',
		mq_reach: 'national & international',
		about_eyebrow: 'About me',
		about_title_1: "I'm Flavia.",
		about_title_2: 'I create content',
		about_title_3: "that's real.",
		about_bio: `I'm a content creator based in Arequipa, Peru. With over ${floorThousands(tt)} TikTok followers and ${(metrics.tiktokLikes / 1e6).toLocaleString('en-US')} million likes, I create content that doesn't just get seen — it's felt.`,
		about_p2: "My approach is simple: be real. No forced scripts or perfect aesthetics. I make videos that connect because they come from genuine experiences — a concert, an amazing restaurant, an outfit I loved, a trip that changed something in me.",
		about_p3: 'I work with brands that understand authenticity converts better than perfection. My young audience (18-34) in Peru trusts my recommendations because they know they are honest.',
		about_brands: 'I have collaborated with Peruvian and international brands on campaigns in fashion, gastronomy, travel and lifestyle.',
		about_years: 'years creating',
		about_gear_title: 'My production kit',
		about_niches_label: 'My niches',
		gear_dji_desc: 'Stabilized video, vlogs and on-the-go content',
		gear_iphone_desc: 'Reels, lifestyle photos and native platform content',
		rec: 'REC',
		niche_fashion: 'Fashion',
		niche_travel: 'Travel',
		niche_food: 'Food',
		niche_music: 'Music',
		niche_concerts: 'Concerts',
		niche_lifestyle: 'Lifestyle',
		alt_about: 'Flavia López filming brand content in Arequipa',
		alt_about_2: 'Flavia López filming content',
		alt_about_3: 'Flavia López on a shoot',
		cap_about: 'arequipa ♡',
		cap_bts: 'behind the scenes',
		cap_set: 'on set ✶',
		stats_eyebrow: 'Real metrics',
		stats_h1: 'Numbers that',
		stats_h2: 'speak',
		stats_h3: 'for themselves',
		stats_demo_tiktok: `Age · TikTok ${contact.tiktok.handle}`,
		stats_demo_ig: `Age · Instagram ${contact.instagram.handle}`,
		stats_geo: 'Geographic distribution',
		stats_note: 'my people! ♡',
		geo_pe: 'Peru',
		geo_us: 'USA',
		geo_es: 'Spain',
		portfolio_eyebrow: 'Portfolio',
		portfolio_h1: 'Content that',
		portfolio_h2: 'converts',
		portfolio_desc: 'Real videos that generate connection. Each piece created with intention and authenticity.',
		portfolio_cta_text: 'Want to see more content?',
		portfolio_ig: 'View Instagram',
		portfolio_tt: 'View full TikTok',
		portfolio_filters: 'Filter portfolio',
		filter_all: 'All',
		filter_fashion: 'Fashion',
		filter_beauty: 'Beauty',
		filter_travel: 'Travel',
		filter_food: 'Food',
		filter_ugc: 'UGC',
		filter_events: 'Events',
		work_play: 'Watch video',
		cursor_view: '▶ Watch',
		viewer_label: 'Content player',
		viewer_close: 'Close player',
		w_01: 'Instagram Reel',
		w_02: 'Post',
		w_03: 'Post',
		w_04: 'My First Tattoo',
		w_05: 'New Glasses',
		w_06: 'Coca-Cola',
		w_07: 'Outfit',
		w_08: 'Coral',
		w_09: 'Milano Bags handbags',
		brands_eyebrow: 'Collaborations',
		brands_h1: 'Brands that',
		brands_h2: 'trusted',
		brands_h3: 'me',
		brands_delivery: 'On-time delivery',
		brands_reach: 'Nat. & Int.',
		brands_collab: 'Partner brands',
		brands_response: 'Response time',
		rates_eyebrow: 'Investment',
		rates_h1: 'Reference pricing.',
		rates_h2: 'No surprises.',
		rates_desc: 'Base prices for each content format. Every campaign is unique — contact me for a tailored proposal.',
		rates_want: 'I want it',
		rates_fav: "brands' favorite!",
		rates_saving: `You save $${packSaving}`,
		rates_note: 'Travel and transportation expenses are not included. For activations outside Arequipa, quoted separately.',
		rates_note_label: 'Note:',
		rates_custom_title: 'Need something different?',
		rates_custom_desc: "Long campaigns, exclusivity, extended usage rights or custom packages. Tell me your goals and I'll prepare a proposal.",
		rates_custom_btn: 'Request a proposal',
		rates_custom_note: 'made to measure ✂',
		rates_negotiate: 'Prices vary depending on brief, duration and usage rights.',
		rate_pack_platform: 'Special Pack',
		rate_events_platform: 'Additional',
		rate_story_name: 'Story',
		rate_reel_name: 'Reel',
		rate_post_name: 'Post',
		rate_tiktok_short: 'TikTok',
		rate_tiktok_name: 'Topic-specific video',
		rate_replica_name: 'TikTok + Reel',
		rate_image_name: 'Image usage',
		rate_story_desc: '24h exposure, link sticker',
		rate_reel_desc: 'Video up to 90 sec, free audio',
		rate_post_desc: 'Photo or carousel, caption included',
		rate_tiktok_desc: '30-60 sec duration, viral sound',
		rate_replica_desc: 'Same content adapted to both platforms',
		rate_image_desc: 'Commercial use license for the content',
		rate_story_value: 'Ideal for quick promotions and product launches',
		rate_reel_value: `Audience 25-34 years old, ${peru}% Peruvian. Delivered in 5 days.`,
		rate_post_value: 'Permanent content with high save potential',
		rate_tiktok_value: `${roundK(tt)} followers, ${likes} accumulated likes. Maximum organic reach.`,
		rate_replica_value: 'Simultaneous presence on TikTok and Instagram. Double the reach.',
		rate_image_value: 'Reuse the content on your channels and ads',
		faq_eyebrow: 'FAQ',
		faq_h1: 'What brands',
		faq_h2: 'ask me',
		faq_1_q: 'What is UGC content and why does it work?',
		faq_1_a: 'UGC (User Generated Content) is content filmed by a real creator, with her own voice and style, instead of a traditional ad. It feels like a recommendation from someone you trust, which is why it drives more engagement and conversions on TikTok, Reels and paid ads.',
		faq_2_q: 'How much does a UGC video or collaboration cost?',
		faq_2_a: `My reference rates go from $${minPrice} for an Instagram story to $${maxPrice} for the TikTok + Reel pack. A Reel or a post is $${priceOf('reel')} and a topic-specific TikTok is $${priceOf('tiktok')}. The final price depends on the brief, duration and usage rights.`,
		faq_3_q: 'What kind of brands do you work with?',
		faq_3_a: `Fashion, beauty, food, travel, music and lifestyle brands. I have worked with Peruvian and international brands such as ${brandsShort} and ${brandList[4]}.`,
		faq_4_q: 'Do you only work in Arequipa?',
		faq_4_a: 'I live in Arequipa, Peru, and work with brands across the country and abroad. UGC content is filmed and delivered remotely; for in-person activations outside Arequipa, travel is quoted separately.',
		faq_5_q: 'What does your audience look like?',
		faq_5_a: `I have ${compact(tt)} followers on TikTok and ${ig} on Instagram. ${peru}% of my audience is in Peru and most are between 18 and 34 years old.`,
		faq_6_q: 'How do we start a collaboration?',
		faq_6_a: 'Fill in the contact form or message me on WhatsApp with your brand, the type of content and your budget. I reply within 24 hours with a proposal.',
		contact_eyebrow: 'Contact',
		contact_hi: 'hi!',
		contact_h1: "Let's create something",
		contact_h2: 'incredible',
		contact_h3: 'together',
		contact_tagline: 'I respond within 24 hours. Tell me about your brand and what you want to achieve.',
		contact_avail: 'Arequipa, Peru — Available for national and international projects',
		contact_form_label: 'Contact form',
		contact_submit: 'Send via WhatsApp',
		contact_privacy: "Your information is safe. We don't share it with third parties.",
		contact_success_title: 'Almost there!',
		contact_success_desc: "WhatsApp opened with your proposal ready. Just hit send and I'll get back to you within 24 hours.",
		contact_whatsapp: 'Open WhatsApp again',
		contact_error: 'Something went wrong. Please try again or message me on WhatsApp.',
		contact_required: 'Please fill in the required fields.',
		form_name: 'Full name',
		form_email: 'Corporate email',
		form_company: 'Company / Brand',
		form_type: 'Content type',
		form_budget: 'Approximate budget (USD)',
		form_message: 'Message / Project brief',
		ph_name: 'Your full name',
		ph_email: 'you@company.com',
		ph_company: 'Your company or brand name',
		ph_message: 'Tell me about your brand, the product or service you want to promote, and the goal of the campaign...',
		content_type: ['Select type', 'Instagram Reel ($350)', 'TikTok Video ($400)', 'Instagram Story ($100)', 'Instagram Post ($350)', 'TikTok + Reel Replica ($450)', 'Image usage ($200)', 'Custom package', 'Other / Inquiry'],
		budget_range: ['Select range', '$100 – $300 USD', '$300 – $500 USD', '$500 – $1,000 USD', 'Over $1,000 USD', 'To be defined'],
		footer_tagline: 'Authentic content creator from Arequipa, Peru.',
		footer_nav: 'Navigation',
		footer_connect: "Let's connect",
		footer_rights: 'All rights reserved.',
		footer_availability: 'Arequipa, Peru · Available for national and international collaborations',
		footer_top: 'Back to top',
	},
} satisfies Record<Lang, Record<string, string | string[]>>;

export type TKey = keyof typeof t.es;

/** Texto en español para el render del servidor; el cambio a EN lo hace `scripts/i18n.ts`. */
export const es = (key: string): string => {
	const v = (t.es as Record<string, unknown>)[key];
	if (typeof v !== 'string') throw new Error(`Falta el texto "${key}"`);
	return v;
};

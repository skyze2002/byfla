// Sistema de idiomas ES/EN (mismo mecanismo de la versión anterior):
// [data-i18n] → textContent, [data-i18n-placeholder], [data-i18n-aria], [data-i18n-select]
// y botones .lang-btn con .lang-es / .lang-en. La preferencia se guarda en localStorage('lang').
import { t, type Lang } from '../data/site';

type Dict = Record<string, string | string[]>;

function read(): Lang {
	try {
		return localStorage.getItem('lang') === 'en' ? 'en' : 'es';
	} catch {
		return 'es';
	}
}

export function currentLang(): Lang {
	return document.documentElement.lang === 'en' ? 'en' : 'es';
}

export function tr(key: string): string {
	const v = (t[currentLang()] as Dict)[key];
	return typeof v === 'string' ? v : '';
}

export function apply(lang: Lang) {
	const dict = t[lang] as Dict;

	document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
		const v = dict[el.dataset.i18n!];
		if (typeof v === 'string') el.textContent = v;
	});

	document.querySelectorAll<HTMLSelectElement>('[data-i18n-select]').forEach((el) => {
		const v = dict[el.dataset.i18nSelect!];
		if (!Array.isArray(v)) return;
		const value = el.value;
		Array.from(el.options).forEach((opt, i) => {
			if (v[i] !== undefined) opt.text = v[i];
		});
		el.value = value;
	});

	document.querySelectorAll<HTMLElement>('[data-i18n-placeholder]').forEach((el) => {
		const v = dict[el.dataset.i18nPlaceholder!];
		if (typeof v === 'string') (el as HTMLInputElement).placeholder = v;
	});

	document.querySelectorAll<HTMLElement>('[data-i18n-aria]').forEach((el) => {
		const v = dict[el.dataset.i18nAria!];
		if (typeof v === 'string') el.setAttribute('aria-label', v);
	});

	document.querySelectorAll<HTMLElement>('[data-i18n-alt]').forEach((el) => {
		const v = dict[el.dataset.i18nAlt!];
		if (typeof v === 'string') el.setAttribute('alt', v);
	});

	document.querySelectorAll<HTMLElement>('.lang-btn').forEach((btn) => {
		btn.setAttribute('data-lang', lang);
		btn.querySelector('.lang-es')?.classList.toggle('active', lang === 'es');
		btn.querySelector('.lang-en')?.classList.toggle('active', lang === 'en');
	});

	document.documentElement.setAttribute('lang', lang === 'es' ? 'es-PE' : 'en');
	try {
		localStorage.setItem('lang', lang);
	} catch {
		/* sin almacenamiento: el idioma solo dura esta visita */
	}
	document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
}

export function initI18n() {
	const start = read();
	if (start === 'en') apply('en');
	document.querySelectorAll('.lang-btn').forEach((btn) =>
		btn.addEventListener('click', () => apply(currentLang() === 'es' ? 'en' : 'es')),
	);
}

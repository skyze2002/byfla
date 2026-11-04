// Animaciones e interacciones del sitio. Sin librerías: CSS + IntersectionObserver + Web Animations API.
// Cada bloque es independiente: si uno falla, los demás siguen funcionando.
import { initI18n, currentLang, tr } from './i18n';
import { compact, typewriter, contact, t } from '../data/site';

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

const $ = <T extends Element = HTMLElement>(sel: string, ctx: ParentNode = document) => ctx.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, ctx: ParentNode = document) =>
	Array.from(ctx.querySelectorAll<T>(sel));
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, f: number) => a + (b - a) * f;

/** Lee `--d` (p. ej. "1.05s" o "200ms") del elemento revelable más cercano, en ms. */
function delayOf(el: Element): number {
	const host = el.closest<HTMLElement>('[data-reveal]');
	if (!host) return 0;
	const raw = getComputedStyle(host).getPropertyValue('--d').trim();
	if (!raw) return 0;
	return raw.endsWith('ms') ? parseFloat(raw) : parseFloat(raw) * 1000;
}

function heroReady(cb: () => void) {
	if (root.classList.contains('hero-ready')) cb();
	else document.addEventListener('hero-ready', cb, { once: true });
}

const inHero = (el: Element) => !!el.closest('[data-hero]');

/* ---------- Estado compartido de `translate` (parallax + arrastre) ---------- */

type Mover = { px: number; py: number; dx: number; dy: number; top: number; h: number; speed: number; base: number };
const movers = new Map<HTMLElement, Mover>();

function mover(el: HTMLElement): Mover {
	let m = movers.get(el);
	if (!m) {
		m = { px: 0, py: 0, dx: 0, dy: 0, top: 0, h: 0, base: 0, speed: parseFloat(el.dataset.parallax || '0') };
		movers.set(el, m);
	}
	return m;
}

function writeTranslate(el: HTMLElement, m: Mover) {
	el.style.translate = `${(m.px + m.dx).toFixed(2)}px ${(m.py + m.dy).toFixed(2)}px`;
}

/* 1. Split de letras */
function initSplit() {
	$$('[data-split]').forEach((el) => {
		const text = (el.textContent || '').trim();
		el.setAttribute('aria-label', text);
		el.textContent = '';
		const sr = document.createElement('span');
		sr.className = 'sr-only';
		sr.textContent = text;
		el.append(sr);
		[...text].forEach((ch, i) => {
			const mask = document.createElement('span');
			mask.className = 'split-mask';
			mask.setAttribute('aria-hidden', 'true');
			const inner = document.createElement('span');
			inner.className = 'split-ch';
			inner.style.setProperty('--i', String(i));
			inner.textContent = ch === ' ' ? ' ' : ch;
			mask.append(inner);
			el.append(mask);
		});
	});
}

/* 2. Stagger: asigna --d escalonado a los [data-reveal] de cada [data-stagger] */
function initStagger() {
	$$('[data-stagger]').forEach((parent) => {
		const step = parseFloat(parent.dataset.stagger || '0.1');
		const base = parseFloat(parent.dataset.staggerBase || '0');
		$$('[data-reveal]', parent)
			.filter((el) => el.parentElement?.closest('[data-stagger]') === parent)
			.forEach((el, i) => {
				if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', `${(base + i * step).toFixed(3)}s`);
			});
	});
}

/* 3. Contadores (easeOutQuart, 1.7s, respetan el delay de su contenedor) */
function formatCount(n: number, fmt: string) {
	return fmt === 'compact' ? compact(n) : String(Math.round(n));
}

function runCounter(el: HTMLElement) {
	const target = parseFloat(el.dataset.count || '0');
	const fmt = el.dataset.format || 'int';
	const suffix = el.dataset.suffix || '';
	const final = formatCount(target, fmt) + suffix;
	if (reduced) {
		el.textContent = final;
		return;
	}
	el.textContent = formatCount(0, fmt) + suffix;
	const dur = 1700;
	window.setTimeout(() => {
		const t0 = performance.now();
		const tick = (now: number) => {
			const p = clamp((now - t0) / dur, 0, 1);
			const eased = 1 - Math.pow(1 - p, 4);
			el.textContent = p < 1 ? formatCount(target * eased, fmt) + suffix : final;
			if (p < 1) requestAnimationFrame(tick);
		};
		requestAnimationFrame(tick);
	}, delayOf(el));
}

function initCounters() {
	const els = $$('[data-count]');
	if (!('IntersectionObserver' in window)) return;
	const io = new IntersectionObserver(
		(entries) => {
			entries.forEach((e) => {
				if (!e.isIntersecting) return;
				io.unobserve(e.target);
				runCounter(e.target as HTMLElement);
			});
		},
		{ threshold: 0.3 },
	);
	els.filter((el) => !inHero(el)).forEach((el) => io.observe(el));
	heroReady(() => els.filter(inHero).forEach((el) => io.observe(el)));
}

/* 4. Revelado al hacer scroll */
function reveal(el: HTMLElement) {
	el.classList.add('in');
	if (el.hasAttribute('data-tilt')) {
		const wait = reduced ? 0 : delayOf(el) + 1050;
		window.setTimeout(() => el.classList.add('settled'), wait);
	}
}

function initReveal() {
	const els = $$('[data-reveal]');
	if (reduced || !('IntersectionObserver' in window)) {
		els.forEach(reveal);
		return;
	}
	const io = new IntersectionObserver(
		(entries) => {
			entries.forEach((e) => {
				if (!e.isIntersecting) return;
				io.unobserve(e.target);
				reveal(e.target as HTMLElement);
			});
		},
		{ rootMargin: '0px 0px -6% 0px' },
	);
	els.filter((el) => !inHero(el)).forEach((el) => io.observe(el));
	heroReady(() => els.filter(inHero).forEach((el) => io.observe(el)));
}

/* 5. Typewriter */
function initTypewriter() {
	const el = $('[data-typewriter]');
	const word = el && $('.tw-word', el);
	if (!el || !word) return;
	let token = 0;

	const run = () => {
		const id = ++token;
		const words = typewriter[currentLang()];
		if (reduced) {
			word.textContent = words[0];
			return;
		}
		let w = 0;
		let i = 0;
		let deleting = false;
		word.textContent = '';
		const step = () => {
			if (id !== token) return;
			const current = words[w];
			if (!deleting) {
				i++;
				word.textContent = current.slice(0, i);
				if (i === current.length) {
					deleting = true;
					return void setTimeout(step, 1700);
				}
				return void setTimeout(step, 95);
			}
			i--;
			word.textContent = current.slice(0, i);
			if (i === 0) {
				deleting = false;
				w = (w + 1) % words.length;
				return void setTimeout(step, 320);
			}
			setTimeout(step, 45);
		};
		setTimeout(step, 400);
	};

	heroReady(run);
	document.addEventListener('langchange', run);
}

/* 6. Intro + hero-ready */
function markHeroReady() {
	if (root.classList.contains('hero-ready')) return;
	root.classList.add('hero-ready');
	document.dispatchEvent(new Event('hero-ready'));
}

function initIntro() {
	const w = window as unknown as { __introFallback?: number };
	if (w.__introFallback) clearTimeout(w.__introFallback);
	const intro = $('.intro');
	if (!root.classList.contains('intro-on') || !intro) {
		root.classList.remove('intro-on');
		markHeroReady();
		return;
	}
	scrollTo(0, 0);
	// La intro se queda hasta que la persona intenta bajar (rueda, swipe, teclado o clic)
	const keys = ['ArrowDown', 'PageDown', 'End', ' ', 'Enter', 'Tab'];
	let wheel = 0;
	let touchY = 0;
	let done = false;

	const leave = () => {
		if (done) return;
		done = true;
		removeEventListener('wheel', onWheel);
		removeEventListener('touchstart', onTouchStart);
		removeEventListener('touchmove', onTouchMove);
		removeEventListener('keydown', onKey);
		intro.classList.add('intro--out');
		setTimeout(markHeroReady, 220);
		setTimeout(() => {
			root.classList.remove('intro-on');
			intro.remove();
		}, 900);
	};
	const onWheel = (e: WheelEvent) => {
		wheel = Math.max(0, wheel + e.deltaY);
		if (wheel > 24) leave();
	};
	const onTouchStart = (e: TouchEvent) => {
		touchY = e.touches[0].clientY;
	};
	const onTouchMove = (e: TouchEvent) => {
		if (touchY - e.touches[0].clientY > 30) leave();
	};
	const onKey = (e: KeyboardEvent) => {
		if (!keys.includes(e.key)) return;
		if (e.key !== 'Tab') e.preventDefault();
		leave();
	};

	addEventListener('wheel', onWheel, { passive: true });
	addEventListener('touchstart', onTouchStart, { passive: true });
	addEventListener('touchmove', onTouchMove, { passive: true });
	addEventListener('keydown', onKey);
	intro.addEventListener('click', leave);
}

/* 7. Loop único de scroll: parallax, header, progreso y velocidad de las cintas */
function initScrollLoop() {
	const header = $('[data-header]');
	const progress = $('[data-progress]');
	const parallaxEls = reduced ? [] : $$('[data-parallax]');
	parallaxEls.forEach(mover);

	let spinAnims: Animation[] = [];
	const collectAnims = () => {
		spinAnims = reduced ? [] : $$('.marquee__track, [data-scroll-spin]').flatMap((el) => el.getAnimations());
		// Con playbackRate negativo una animación infinita se detiene al llegar a 0:
		// la adelantamos miles de vueltas para que pueda retroceder sin terminar.
		spinAnims.forEach((a) => {
			const dur = Number(a.effect?.getComputedTiming().duration) || 0;
			const now = Number(a.currentTime) || 0;
			if (dur && now < dur * 1000) a.currentTime = now + dur * 5000;
		});
	};

	let vh = innerHeight;
	let maxScroll = 1;
	const measure = () => {
		vh = innerHeight;
		maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
		const y = scrollY;
		parallaxEls.forEach((el) => {
			const m = mover(el);
			const r = el.getBoundingClientRect();
			m.top = r.top + y - (m.py + m.dy);
			m.h = r.height;
			// Lo que ya se ve al cargar parte de su posición de diseño (desplazamiento 0 en scroll 0)
			const c = m.top + m.h / 2;
			m.base = c < vh ? (vh / 2 - c) * m.speed : 0;
		});
		collectAnims();
	};

	let lastY = scrollY;
	let dir = 1;
	let rate = 1;
	let running = false;
	let idle = 0;
	let hiddenHeader = false;
	let travel = 0;

	const frame = () => {
		const y = scrollY;
		const delta = y - lastY;
		lastY = y;

		// Header
		if (header) {
			header.classList.toggle('is-scrolled', y > 20);
			travel = Math.sign(delta) === Math.sign(travel) ? travel + delta : delta;
			if (y > 500 && travel > 6 && !hiddenHeader && !header.matches(':focus-within')) {
				hiddenHeader = true;
				header.classList.add('is-hidden');
			} else if ((travel < -6 || y <= 500) && hiddenHeader) {
				hiddenHeader = false;
				header.classList.remove('is-hidden');
			}
		}

		// Barra de progreso
		if (progress) progress.style.transform = `scaleX(${clamp(y / maxScroll, 0, 1).toFixed(4)})`;

		// Parallax (solo cerca del viewport, limitado a ±220px)
		const mid = y + vh / 2;
		let moved = false;
		parallaxEls.forEach((el) => {
			const m = mover(el);
			const center = m.top + m.h / 2;
			if (Math.abs(center - mid) > vh * 1.2 + m.h / 2) return;
			const target = clamp((mid - center) * m.speed - m.base, -220, 220);
			if (Math.abs(target - m.py) < 0.1) return;
			m.py = target;
			moved = true;
			writeTranslate(el, m);
		});

		// Cintas y sello: velocidad + dirección del scroll
		if (delta !== 0) dir = delta > 0 ? 1 : -1;
		const speed = Math.min(1 + Math.abs(delta) / 7, 6);
		const target = (delta === 0 ? 1 : speed) * dir;
		rate = lerp(rate, target, 0.12);
		if (Math.abs(rate - target) < 0.005) rate = target;
		spinAnims.forEach((a) => {
			if (Math.abs(a.playbackRate - rate) > 0.001) a.playbackRate = rate;
		});

		const settled = delta === 0 && !moved && rate === target;
		idle = settled ? idle + 1 : 0;
		if (idle > 4) {
			running = false;
			return;
		}
		requestAnimationFrame(frame);
	};

	const start = () => {
		if (running) return;
		running = true;
		idle = 0;
		requestAnimationFrame(frame);
	};

	measure();
	start();
	addEventListener('scroll', start, { passive: true });
	addEventListener('resize', () => {
		measure();
		start();
	});
	addEventListener('load', () => {
		measure();
		start();
	});
	document.addEventListener('hero-ready', () => setTimeout(collectAnims, 50));
	new ResizeObserver(() => {
		maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
	}).observe(document.body);
}

/* 8. Efectos de mouse: profundidad, inclinación 3D, botones magnéticos y cursor */
function initMouse() {
	if (!finePointer || reduced) return;

	// Profundidad del grupo visual del hero
	const depthEls = $$('[data-depth]');
	if (depthEls.length) {
		let tx = 0;
		let ty = 0;
		let cx = 0;
		let cy = 0;
		let raf = 0;
		const loop = () => {
			cx = lerp(cx, tx, 0.08);
			cy = lerp(cy, ty, 0.08);
			depthEls.forEach((el) => {
				const d = parseFloat(el.dataset.depth || '12');
				el.style.translate = `${(cx * d).toFixed(2)}px ${(cy * d).toFixed(2)}px`;
			});
			raf = Math.abs(cx - tx) + Math.abs(cy - ty) > 0.001 ? requestAnimationFrame(loop) : 0;
		};
		addEventListener('pointermove', (e) => {
			tx = (e.clientX / innerWidth - 0.5) * 2;
			ty = (e.clientY / innerHeight - 0.5) * 2;
			if (!raf) raf = requestAnimationFrame(loop);
		});
	}

	// Inclinación 3D
	$$('[data-tilt]').forEach((el) => {
		const max = parseFloat(el.dataset.tilt || '') || 12;
		let rect: DOMRect | null = null;
		el.addEventListener('pointerenter', () => (rect = el.getBoundingClientRect()));
		el.addEventListener('pointermove', (e) => {
			rect ??= el.getBoundingClientRect();
			const x = (e.clientX - rect.left) / rect.width - 0.5;
			const y = (e.clientY - rect.top) / rect.height - 0.5;
			el.style.setProperty('--ry', `${(x * 2 * max).toFixed(2)}deg`);
			el.style.setProperty('--rx', `${(-y * 2 * max).toFixed(2)}deg`);
		});
		el.addEventListener('pointerleave', () => {
			rect = null;
			el.style.setProperty('--rx', '0deg');
			el.style.setProperty('--ry', '0deg');
		});
	});

	// Botones magnéticos
	$$('[data-magnetic]').forEach((el) => {
		const strength = parseFloat(el.dataset.magnetic || '') || 0.3;
		let rect: DOMRect | null = null;
		el.addEventListener('pointerenter', () => (rect = el.getBoundingClientRect()));
		el.addEventListener('pointermove', (e) => {
			rect ??= el.getBoundingClientRect();
			const x = e.clientX - (rect.left + rect.width / 2);
			const y = e.clientY - (rect.top + rect.height / 2);
			el.style.translate = `${(x * strength).toFixed(1)}px ${(y * strength).toFixed(1)}px`;
		});
		el.addEventListener('pointerleave', () => {
			rect = null;
			el.style.translate = '0px 0px';
		});
	});

	// Cursor con etiqueta
	const cursor = $('[data-cursor-bubble]');
	if (cursor) {
		let x = innerWidth / 2;
		let y = innerHeight / 2;
		let cx = x;
		let cy = y;
		let raf = 0;
		const loop = () => {
			cx = lerp(cx, x, 0.2);
			cy = lerp(cy, y, 0.2);
			cursor.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
			raf = Math.abs(cx - x) + Math.abs(cy - y) > 0.2 ? requestAnimationFrame(loop) : 0;
		};
		addEventListener('pointermove', (e) => {
			x = e.clientX;
			y = e.clientY;
			const over = (e.target as Element | null)?.closest?.('[data-cursor]');
			cursor.classList.toggle('is-on', !!over);
			if (!raf) raf = requestAnimationFrame(loop);
		});
		document.addEventListener('pointerleave', () => cursor.classList.remove('is-on'));
	}
}

/* 9. Stickers arrastrables (se suman al parallax en `translate`) */
function initDrag() {
	const easeBack = (p: number) => {
		const c1 = 1.70158;
		const c3 = c1 + 1;
		return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
	};

	$$('[data-drag]').forEach((el) => {
		const m = mover(el);
		let startX = 0;
		let startY = 0;
		let baseX = 0;
		let baseY = 0;
		let pointer: number | null = null;

		el.addEventListener('pointerdown', (e) => {
			if (e.button !== 0) return;
			pointer = e.pointerId;
			el.setPointerCapture(e.pointerId);
			startX = e.clientX;
			startY = e.clientY;
			baseX = m.dx;
			baseY = m.dy;
			el.classList.add('is-dragging');
		});
		el.addEventListener('pointermove', (e) => {
			if (pointer !== e.pointerId) return;
			m.dx = baseX + e.clientX - startX;
			m.dy = baseY + e.clientY - startY;
			writeTranslate(el, m);
		});
		const end = (e: PointerEvent) => {
			if (pointer !== e.pointerId) return;
			pointer = null;
			el.classList.remove('is-dragging');
		};
		el.addEventListener('pointerup', end);
		el.addEventListener('pointercancel', end);

		el.addEventListener('dblclick', () => {
			const fromX = m.dx;
			const fromY = m.dy;
			if (!fromX && !fromY) return;
			if (reduced) {
				m.dx = m.dy = 0;
				return writeTranslate(el, m);
			}
			const t0 = performance.now();
			const tick = (now: number) => {
				const p = clamp((now - t0) / 650, 0, 1);
				const k = 1 - easeBack(p);
				m.dx = fromX * k;
				m.dy = fromY * k;
				writeTranslate(el, m);
				if (p < 1) requestAnimationFrame(tick);
			};
			requestAnimationFrame(tick);
		});
	});
}

/* 10. Filtros con píldora deslizante + FLIP */
function initFilters() {
	const bar = $('[data-filters]');
	const grid = $('[data-grid]');
	if (!bar || !grid) return;
	const tabs = $$<HTMLButtonElement>('[data-filter]', bar);
	const pill = $('.filters__pill', bar);
	const items = $$('[data-cat]', grid);
	let active = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];

	const movePill = () => {
		if (!pill || !active) return;
		pill.style.width = `${active.offsetWidth}px`;
		pill.style.height = `${active.offsetHeight}px`;
		pill.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
	};

	const select = (tab: HTMLButtonElement) => {
		if (tab === active) return;
		active = tab;
		tabs.forEach((t) => {
			const on = t === tab;
			t.setAttribute('aria-selected', String(on));
			t.tabIndex = on ? 0 : -1;
		});
		movePill();

		const cat = tab.dataset.filter!;
		const first = new Map(items.filter((el) => !el.hidden).map((el) => [el, el.getBoundingClientRect()]));
		items.forEach((el) => (el.hidden = !(cat === 'todo' || el.dataset.cat === cat)));
		let entering = 0;
		items.forEach((el) => {
			if (el.hidden) return;
			el.classList.add('in', 'settled');
			if (reduced) return;
			const before = first.get(el);
			if (before) {
				const after = el.getBoundingClientRect();
				const dx = before.left - after.left;
				const dy = before.top - after.top;
				if (dx || dy)
					el.animate([{ translate: `${dx}px ${dy}px` }, { translate: '0px 0px' }], {
						duration: 600,
						easing: 'cubic-bezier(.22,1,.36,1)',
					});
			} else {
				el.animate(
					[
						{ opacity: 0, scale: 0.6, rotate: '-6deg' },
						{ opacity: 1, scale: 1, rotate: '0deg' },
					],
					{ duration: 650, delay: entering++ * 45, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'backwards' },
				);
			}
		});
	};

	tabs.forEach((tab, i) => {
		tab.addEventListener('click', () => select(tab));
		tab.addEventListener('keydown', (e) => {
			const k = e.key;
			if (k !== 'ArrowRight' && k !== 'ArrowLeft') return;
			e.preventDefault();
			const next = tabs[(i + (k === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
			next.focus();
			select(next);
		});
	});

	movePill();
	bar.classList.add('is-ready');
	addEventListener('resize', movePill);
	document.addEventListener('langchange', () => requestAnimationFrame(movePill));
	document.fonts?.ready.then(movePill);
}

/* 11. Visor de embeds (el iframe se crea al abrir y se elimina al cerrar) */
function initViewer() {
	const dialog = $<HTMLDialogElement>('[data-viewer]');
	const frame = dialog && $('[data-viewer-frame]', dialog);
	if (!dialog || !frame) return;

	$$('[data-embed]').forEach((btn) =>
		btn.addEventListener('click', () => {
			const iframe = document.createElement('iframe');
			iframe.src = btn.dataset.embed!;
			iframe.title = btn.dataset.title || tr('viewer_label');
			iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
			iframe.allowFullscreen = true;
			iframe.setAttribute('frameborder', '0');
			frame.replaceChildren(iframe);
			dialog.dataset.platform = btn.dataset.platform || '';
			dialog.showModal();
		}),
	);

	$$('[data-viewer-close]', dialog).forEach((b) => b.addEventListener('click', () => dialog.close()));
	dialog.addEventListener('click', (e) => {
		if (e.target === dialog) dialog.close();
	});
	dialog.addEventListener('close', () => frame.replaceChildren());
}

/* 12. Preselección de tarifa en el formulario */
function initPricePick() {
	const select = $<HTMLSelectElement>('#tipo');
	if (!select) return;
	const field = select.closest<HTMLElement>('.field');
	$$('[data-pick]').forEach((btn) =>
		btn.addEventListener('click', (e) => {
			e.preventDefault();
			select.value = btn.dataset.pick!;
			select.dispatchEvent(new Event('change', { bubbles: true }));
			$('#contacto')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
			setTimeout(
				() => {
					if (!field) return;
					field.classList.remove('is-flash');
					void field.offsetWidth;
					field.classList.add('is-flash');
					select.focus({ preventScroll: true });
				},
				reduced ? 0 : 750,
			);
		}),
	);
}

/* 13. Formulario (Web3Forms vía fetch) + confeti */
function confetti(origin: HTMLElement, host: HTMLElement) {
	if (reduced) return;
	const colors = ['#7a1238', '#f6e98a', '#f7a8d8', '#a8cbe0', '#e5482f', '#2f5d46', '#1a1414'];
	const o = origin.getBoundingClientRect();
	const h = host.getBoundingClientRect();
	const layer = document.createElement('div');
	layer.className = 'confetti';
	layer.setAttribute('aria-hidden', 'true');
	layer.style.left = `${o.left - h.left + o.width / 2}px`;
	layer.style.top = `${o.top - h.top + o.height / 2}px`;
	for (let i = 0; i < 46; i++) {
		const p = document.createElement('i');
		const angle = Math.random() * Math.PI * 2;
		const dist = 90 + Math.random() * 230;
		p.style.setProperty('--x', `${(Math.cos(angle) * dist).toFixed(0)}px`);
		p.style.setProperty('--y', `${(Math.sin(angle) * dist * 0.8 + 60).toFixed(0)}px`);
		p.style.setProperty('--rot', `${Math.round(Math.random() * 900 - 450)}deg`);
		p.style.background = colors[i % colors.length];
		p.style.animationDuration = `${(1.1 + Math.random() * 0.8).toFixed(2)}s`;
		p.style.width = `${6 + Math.random() * 8}px`;
		p.style.height = `${8 + Math.random() * 10}px`;
		if (i % 3 === 0) p.style.borderRadius = '50%';
		layer.append(p);
	}
	host.append(layer);
	setTimeout(() => layer.remove(), 2200);
}

function initForm() {
	const form = $<HTMLFormElement>('#contact-form');
	if (!form) return;
	const card = form.closest<HTMLElement>('[data-form-card]')!;
	const submit = $<HTMLButtonElement>('[type="submit"]', form)!;
	const status = $('[data-form-status]', form)!;
	const success = $('[data-form-success]', card)!;

	// Etiquetas flotantes de los select
	$$<HTMLSelectElement>('select', form).forEach((s) => {
		const sync = () => s.closest('.field')?.classList.toggle('has-value', !!s.value);
		s.addEventListener('change', sync);
		sync();
	});

	const fail = (msg: string) => {
		status.textContent = msg;
		status.hidden = false;
		submit.classList.remove('is-shake');
		void submit.offsetWidth;
		submit.classList.add('is-shake');
	};

	/** Mensaje para WhatsApp, siempre con etiquetas en español (lo lee Flavia). */
	const waMessage = (data: FormData) => {
		const pick = (name: string, key: 'content_type' | 'budget_range') => {
			const sel = $<HTMLSelectElement>(`[name="${name}"]`, form)!;
			return sel.selectedIndex > 0 ? (t.es[key] as string[])[sel.selectedIndex] : '';
		};
		const lines = [
			'¡Hola Flavia! Te escribo desde byfla.com ✨',
			'',
			`*${t.es.form_name}:* ${data.get('nombre')}`,
			`*${t.es.form_email}:* ${data.get('email')}`,
			`*${t.es.form_company}:* ${data.get('empresa')}`,
			pick('tipo', 'content_type') ? `*${t.es.form_type}:* ${pick('tipo', 'content_type')}` : null,
			pick('presupuesto', 'budget_range') ? `*${t.es.form_budget}:* ${pick('presupuesto', 'budget_range')}` : null,
			'',
			`*${t.es.form_message}:*`,
			String(data.get('mensaje')).trim(),
		];
		return lines.filter((l) => l !== null).join('\n');
	};

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		status.hidden = true;
		if (!form.checkValidity()) {
			form.reportValidity();
			return fail(tr('contact_required'));
		}
		const data = new FormData(form);
		if (data.get('botcheck')) return;
		const url = `${contact.whatsapp}?text=${encodeURIComponent(waMessage(data))}`;

		// Se abre dentro del clic para que el navegador no lo bloquee; en móvil abre la app
		const win = window.open(url, '_blank');
		if (win) win.opener = null;
		else location.href = url;

		// Copia por email (Web3Forms) en segundo plano; si falla, WhatsApp ya tiene la propuesta
		fetch(form.action, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
			body: JSON.stringify(Object.fromEntries(data)),
			keepalive: true,
		}).catch(() => {});

		const again = $<HTMLAnchorElement>('a[href*="wa.me"]', success);
		if (again) again.href = url;
		form.hidden = true;
		success.hidden = false;
		success.focus();
		const check = $('[data-success-check]', success);
		requestAnimationFrame(() => confetti(check || success, card));
	});
}

/* 14. Menú móvil */
function initMenu() {
	const btn = $<HTMLButtonElement>('#menu-toggle');
	const menu = $('#mobile-menu');
	if (!btn || !menu) return;

	const setOpen = (open: boolean) => {
		if (open) {
			const r = btn.getBoundingClientRect();
			menu.style.setProperty('--cx', `${r.left + r.width / 2}px`);
			menu.style.setProperty('--cy', `${r.top + r.height / 2}px`);
		}
		menu.classList.toggle('is-open', open);
		root.classList.toggle('menu-open', open);
		btn.setAttribute('aria-expanded', String(open));
		btn.dataset.i18nAria = open ? 'menu_close' : 'menu_open';
		btn.setAttribute('aria-label', tr(btn.dataset.i18nAria));
		if (open) $('a', menu)?.focus({ preventScroll: true });
	};

	btn.addEventListener('click', () => setOpen(btn.getAttribute('aria-expanded') !== 'true'));
	$$('a', menu).forEach((a) => a.addEventListener('click', () => setOpen(false)));
	addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
			setOpen(false);
			btn.focus();
		}
	});
	matchMedia('(min-width: 960px)').addEventListener('change', (e) => e.matches && setOpen(false));
}

/* ---------- Arranque ---------- */

const blocks: [string, () => void][] = [
	['i18n', initI18n],
	['split', initSplit],
	['stagger', initStagger],
	['reveal', initReveal],
	['counters', initCounters],
	['typewriter', initTypewriter],
	['intro', initIntro],
	['scroll', initScrollLoop],
	['mouse', initMouse],
	['drag', initDrag],
	['filters', initFilters],
	['viewer', initViewer],
	['prices', initPricePick],
	['form', initForm],
	['menu', initMenu],
];

for (const [name, init] of blocks) {
	try {
		init();
	} catch (err) {
		console.error(`[motion] ${name}`, err);
	}
}

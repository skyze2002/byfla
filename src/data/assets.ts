// Solo servidor: comprueba si un archivo opcional existe en /public
// (portadas del portafolio y fotos extra) para no pedir imágenes rotas.
import { existsSync } from 'node:fs';
import { join } from 'node:path';

export const publicAsset = (path: string): string | null =>
	existsSync(join(process.cwd(), 'public', path)) ? path : null;

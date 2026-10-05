/**
 * Prefixa um arquivo de `public/` com o basePath do site. No GitHub Pages o site mora em
 * `/sisconforme-site/`, e caminhos crus como `/img/...` (fora de next/link e next/image) não ganham o prefixo sozinhos.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const caminho = (arquivo: string): string => `${BASE}${arquivo}`;

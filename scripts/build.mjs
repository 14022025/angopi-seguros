// Generador estático de ANGOPI. Sin dependencias: `node scripts/build.mjs`.
// Lee src/pages/*.html (con front matter) y escribe el sitio listo en la raíz del repo.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');

// ---------------------------------------------------------------------------
// Configuración del sitio
// ---------------------------------------------------------------------------
const SITE = {
  // Cambiar a 'https://www.angopi.co/' cuando el sitio se publique en el dominio propio.
  url: 'https://14022025.github.io/angopi-seguros/',
  name: 'Angopi Agencia de Seguros',
  legalName: 'Agencia de Seguros Angopi Ltda.',
  nit: '900.297.260-8',
  whatsapp: '573013631792',
  phone1: '+57 301 363 1792',
  phone1Raw: '+573013631792',
  phone2: '+57 300 202 2101',
  phone2Raw: '+573002022101',
  email: 'info@angopi.co',
  address: 'Carrera 64B # 85 – 150, Of. 506, Edificio River View',
  city: 'Barranquilla',
  region: 'Atlántico',
};

// Versión para invalidar caché: hash del CSS y JS actuales
SITE.version = createHash('sha1')
  .update(readFileSync(join(ROOT, 'assets/css/styles.css')))
  .update(readFileSync(join(ROOT, 'assets/js/main.js')))
  .digest('hex')
  .slice(0, 10);

const LINKS = {
  calendly: 'https://calendly.com/angopi-ltda',
  soat: 'https://angopi.co.agentemotor.com/portalclientes/formulario/soat',
  suraAutos: 'https://www.suraenlinea.com/movilidad/sura/seguro-de-carro?asesor=10218',
  suraMotos: 'https://www.suraenlinea.com/motos/plan-motos?asesor=10218',
  suraViaje: 'https://www.suraenlinea.com/viajes/sura?codigoAsesor=10218',
  suraArriendo: 'https://www.suraenlinea.com/arrendamiento-digital/sura/cotizacion/calculadora?asesor=10218',
  suraFinancia: 'https://surafinancia.com.co/sura-financia/informacion-personal/angopi/10218?v=2026-1-0',
  tarifasSoat: 'https://www.angopi.co/files/TarifasSOAT2026.pdf',
  formatoNatural: 'https://www.angopi.co/files/PersonaNatural.pdf',
  formatoJuridica: 'https://www.angopi.co/files/PersonaJuridica.pdf',
  formHogar: 'https://docs.google.com/forms/d/1TAo7LrC0siZLnIbMaW7OhMaIhCkh0wt3S9-GMLMse-8/viewform',
  formVida: 'https://docs.google.com/forms/d/1jhKlNKV0RmiF_vYnM2TILmalbTB7pN3RMmf4kKX5buM/viewform',
  formPyme: 'https://docs.google.com/forms/d/1MLlvlzY1D3Azez8c1_BHTGhq1pu_hM4kiUjwwk2MpLw/viewform',
  facebook: 'https://www.facebook.com/angopiltda',
  instagram: 'https://www.instagram.com/angopi_ltda',
  linkedin: 'https://co.linkedin.com/company/agencia-de-seguros-angopi-ltda',
  youtube: 'https://www.youtube.com/channel/UCFu8ceEwrFtgullOjb4gHsA',
  maps: 'https://www.google.com/maps/search/?api=1&query=Edificio+River+View+Carrera+64B+85-150+Barranquilla',
  mapsEmbed: 'https://www.google.com/maps?q=Edificio%20River%20View%2C%20Carrera%2064B%20%2385-150%2C%20Barranquilla&output=embed',
};

// El sitio es una sola landing: la navegación lleva a sus secciones
const NAV = [
  { label: 'Personas', href: '#personas' },
  { label: 'Empresas', href: '#empresas' },
  { label: 'Arrendamiento', href: '#arrendamiento' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Recursos', href: '#recursos' },
];

// Redirecciones desde las URLs de angopi.co y de las páginas internas anteriores
const LEGACY = {
  'spersonas.html': '#personas',
  'sempresas.html': '#empresas',
  'segurodearrendamiento.html': '#arrendamiento',
  'about.html': '#nosotros',
  'formatos.html': '#recursos',
  'contact.html': '#contacto',
  'personas/index.html': '#personas',
  'empresas/index.html': '#empresas',
  'arrendamiento/index.html': '#arrendamiento',
  'siniestros/index.html': '#contacto',
  'nosotros/index.html': '#nosotros',
  'contacto/index.html': '#contacto',
  'formatos/index.html': '#recursos',
};

// ---------------------------------------------------------------------------
// Íconos (trazos de 24 px, estilo lineal)
// ---------------------------------------------------------------------------
const ICONS = {
  'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  external: '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
  bike: '<circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/>',
  health: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  home: '<path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
  key: '<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  'file-check': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  'file-search': '<path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3"/><path d="m9 18-1.5-1.5"/><circle cx="5" cy="14" r="3"/>',
  handshake: '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  helmet: '<path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M4 15v-3a6 6 0 0 1 6-6"/><path d="M14 6a6 6 0 0 1 6 6v3"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  scale: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  plus: '<circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/>',
  paw: '<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/>',
  umbrella: '<path d="M22 12a10.06 10.06 1 0 0-20 0Z"/><path d="M12 12v8a2 2 0 0 0 4 0"/><path d="M12 2v1"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  'user-check': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/>',
  compass: '<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
  menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
  close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  ear: '<path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0"/><path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4"/>',
  message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  banknote: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  id: '<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M5 17a3 3 0 0 1 6 0"/><path d="M14 10h4"/><path d="M14 14h4"/>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><path d="M17.5 6.5h.01"/>',
  linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
  youtube: '<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
};
// WhatsApp (Simple Icons, CC0), relleno
const WHATSAPP_PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z';

function icon(name, cls = '') {
  const extra = cls ? ` ${cls}` : '';
  if (name === 'whatsapp') {
    return `<svg class="icon icon--fill${extra}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${WHATSAPP_PATH}"/></svg>`;
  }
  const body = ICONS[name];
  if (!body) throw new Error(`Ícono desconocido: ${name}`);
  return `<svg class="icon${extra}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${body}</svg>`;
}

// Sello de Angopi (como en sus redes): escudo relleno con el ícono en blanco, dentro de un círculo
const SEAL_SHIELD = 'M24 5c4.6 3.6 10 5.4 16 5.6V23c0 9.6-6.6 16.4-16 20-9.4-3.6-16-10.4-16-20V10.6C14 10.4 19.4 8.6 24 5Z';
const SEAL_GLYPHS = {
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  cross: '<path d="M12 5v14"/><path d="M5 12h14"/>',
};
function seal(name, cls = '') {
  const body = SEAL_GLYPHS[name] || ICONS[name];
  if (!body) throw new Error(`Ícono desconocido para el sello: ${name}`);
  return `<span class="seal${cls ? ' ' + cls : ''}" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false"><path class="seal__shield" d="${SEAL_SHIELD}"/><g class="seal__glyph" transform="translate(15.2 13.4) scale(.73)">${body}</g></svg></span>`;
}

const wa = (text) =>`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

// Fotografías propias en WebP (assets/img/fotos), en dos tamaños cada una
const PHOTOS = {
  "hero-casa": [1600, 2400, 3200],
  personas: [700, 1100],
  empresas: [900, 1600],
  familia: [900, 1600],
  // ¿Por qué elegir?: una foto por cada punto (Unsplash, uso libre)
  "familia-2": [900, 1600],
  "familia-3": [900, 1600],
  "familia-4": [900, 1600],
  campo: [1400, 2400],
  historia: [1400, 2400, 3200],
  // Fotos de Angopi para el carrusel de servicios (recortadas a 3:4)
  "svc-auto": [720, 1080],
  "svc-salud": [720, 1080],
  "svc-hogar": [720, 1080],
  "svc-mascota": [720, 1080],
  "svc-bici": [720, 1080],
  // Provisionales: Unsplash (u:, licencia libre) y vista previa de Magnific (m:, hay que descargarlas con la cuenta antes de publicar)
  "u-viaje": "m:big-family-leaving-seaside-holiday-with-vehicle-trip-small-child-with-grandparents-parents-travelling-vacation-journey-summer-people-feeling-excited-about-sea-destination_482257-48324.jpg",
  "u-arriendo": "m:happy-couple-with-house-keys_1098-1984.jpg",
  "u-moto": "m:young-woman-driving-moped-tropical-life_1321-2766.jpg",
  "u-profesional": "m:portrait-handsome-smiling-young-man-online-tutor-businessman-working-cafe-remotely-waving-hand_1258-245358.jpg",
  "u-cumplimiento": "u:1758599543278-32d9d073941e",
  "u-empleados": "m:happy-business-colleagues-hugging_1262-21066.jpg",
  "u-negocio": "m:young-florist_1098-13710.jpg",
  "u-transporte": "m:portrait-professional-truck-driver-showing-thumbs-up-smiling_342744-296.jpg",
  "u-obra": "m:happy-builders-hardhat_1398-1745.jpg",
};
function photo(root, name, alt, sizes, attrs = '') {
  const widths = PHOTOS[name];
  if (!widths) throw new Error(`Foto desconocida: ${name}`);
  if (typeof widths === "string" && widths.startsWith("m:")) {
    const p = widths.slice(2);
    const u = (w) => esc(`https://img.magnific.com/free-photo/${p}?w=${w}&q=80`);
    return `<img src="${u(1000)}" srcset="${u(600)} 600w, ${u(1000)} 1000w" sizes="${sizes}" alt="${esc(alt)}" width="1000" height="667"${attrs ? " " + attrs : ""}>`;
  }
  if (typeof widths === "string") {
    const id = widths.slice(2);
    const u = (w) => esc(`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${Math.round(w * 4 / 3)}&q=75`);
    const set = [480, 720, 960].map((w) => `${u(w)} ${w}w`).join(", ");
    return `<img src="${u(720)}" srcset="${set}" sizes="${sizes}" alt="${esc(alt)}" width="720" height="960"${attrs ? " " + attrs : ""}>`;
  }
  const url = (w) => `${root}assets/img/fotos/${name}-${w}.webp`;
  const srcset = widths.map((w) => `${url(w)} ${w}w`).join(', ');
  return `<img src="${url(widths[widths.length - 1])}" srcset="${srcset}" sizes="${sizes}" alt="${esc(alt)}"${attrs ? ' ' + attrs : ''}>`;
}

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function parsePage(file) {
  const raw = readFileSync(file, 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) throw new Error(`Falta el front matter en ${file}`);
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: m[2] };
}

function partial(name) {
  const p = join(SRC, 'partials', `${name}.html`);
  if (!existsSync(p)) throw new Error(`Parcial no encontrado: ${name}`);
  return readFileSync(p, 'utf8');
}

// Reemplaza marcadores. Se aplica varias veces para resolver parciales anidados.
function render(html, ctx) {
  let out = html;
  for (let pass = 0; pass < 4; pass++) {
    out = out
      .replace(/\{\{partial:([\w-]+)\}\}/g, (_, n) => partial(n))
      .replace(/\{\{icon:([\w-]+)(?::([^}]+))?\}\}/g, (_, n, c) => icon(n, c || ''))
      .replace(/\{\{seal:([\w-]+)(?::([^}]+))?\}\}/g, (_, n, c) => seal(n, c || ''))
      .replace(/\{\{wa:([^}]*)\}\}/g, (_, t) => esc(wa(t)))
      .replace(/\{\{photo:([^|}]+)\|([^|}]+)\|([^|}]+)(?:\|([^}]*))?\}\}/g, (_, name, alt, sizes, attrs) => photo(ctx.root, name, alt, sizes, attrs))
      .replace(/\{\{link:(\w+)\}\}/g, (_, k) => {
        if (!LINKS[k]) throw new Error(`Enlace desconocido: ${k}`);
        return esc(LINKS[k]);
      })
      .replace(/\{\{site:(\w+)\}\}/g, (_, k) => esc(SITE[k]))
      .replace(/\{\{root\}\}/g, ctx.root)
      .replace(/\{\{year\}\}/g, String(new Date().getFullYear()));
  }
  const left = out.match(/\{\{[^}]+\}\}/);
  if (left) throw new Error(`Marcador sin resolver en ${ctx.path}: ${left[0]}`);
  return out;
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

// FAQPage automático a partir de los <details> de la página
function faqSchema(html) {
  const re = /<details[^>]*>\s*<summary>([\s\S]*?)<\/summary>\s*<div class="faq__body[^"]*">([\s\S]*?)<\/div>\s*<\/details>/g;
  const items = [];
  let m;
  while ((m = re.exec(html))) {
    items.push({
      '@type': 'Question',
      name: stripTags(m[1]),
      acceptedAnswer: { '@type': 'Answer', text: stripTags(m[2]) },
    });
  }
  return items.length ? { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items } : null;
}

function agencySchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'InsuranceAgency',
    '@id': `${SITE.url}#agencia`,
    name: SITE.legalName,
    alternateName: 'ANGOPI',
    slogan: 'Te guardamos la espalda.',
    description: 'Agencia de seguros multi-productos en Barranquilla desde 1955. Ayudamos a personas y empresas a proteger lo que más valoran.',
    foundingDate: '1955',
    taxID: SITE.nit,
    url: SITE.url,
    logo: `${SITE.url}assets/img/logo-angopi.png`,
    image: `${SITE.url}assets/img/og-portada.jpg`,
    telephone: SITE.phone1Raw,
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address,
      addressLocality: SITE.city,
      addressRegion: SITE.region,
      addressCountry: 'CO',
    },
    areaServed: 'CO',
    sameAs: [LINKS.facebook, LINKS.instagram, LINKS.linkedin, LINKS.youtube],
  };
}

function breadcrumbSchema(meta) {
  if (!meta.crumb) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: meta.crumb, item: SITE.url + meta.path },
    ],
  };
}

// ---------------------------------------------------------------------------
// Plantilla
// ---------------------------------------------------------------------------
function layout(meta, body, ctx) {
  const { root } = ctx;
  const canonical = SITE.url + (meta.path || '');
  const title = meta.title;
  const ogTitle = meta.ogTitle || title;
  const asesoria = esc(wa('¡Hola! Me gustaría recibir asesoría.'));

  const schemas = [];
  if (meta.schema === 'home') schemas.push(agencySchema());
  const bc = breadcrumbSchema(meta);
  if (bc) schemas.push(bc);
  const faq = faqSchema(body);
  if (faq) schemas.push(faq);
  const jsonld = schemas
    .map((s) => `<script type="application/ld+json">${JSON.stringify(s).replace(/</g, '\\u003c')}</script>`)
    .join('\n  ');

  const scripts = (meta.scripts || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => `<script src="${esc(s)}" defer></script>`)
    .join('\n  ');

  return `<!doctype html>
<html lang="es-CO">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <script>document.documentElement.classList.add('js')</script>
  <meta name="description" content="${esc(meta.description)}">
  ${meta.noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${esc(canonical)}">`}
  <meta name="theme-color" content="#418ef2">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_CO">
  <meta property="og:site_name" content="${esc(SITE.name)}">
  <meta property="og:title" content="${esc(ogTitle)}">
  <meta property="og:description" content="${esc(meta.description)}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:image" content="${SITE.url}assets/img/og-portada.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Angopi Agencia de Seguros: Pase lo que pase, estamos aquí para ti.">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="${root}favicon.ico" sizes="any">
  <link rel="icon" type="image/png" sizes="32x32" href="${root}assets/img/icons/favicon-32.png">
  <link rel="apple-touch-icon" href="${root}assets/img/icons/apple-touch-icon.png">
  <link rel="manifest" href="${root}site.webmanifest">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Nunito+Sans:opsz,wght@6..12,600;6..12,700;6..12,800&display=swap">
  <link rel="stylesheet" href="${root}assets/css/styles.css?v=${SITE.version}">
  ${jsonld}
</head>
<body>
  <a class="skip-link" href="#contenido">Saltar al contenido</a>

  <header class="nav-shell${meta.light ? '' : ' on-dark'}">
    <div class="nav-bar">
      <a class="brand" href="${root || './'}" aria-label="Angopi Agencia de Seguros, ir al inicio">
        <img class="brand__dark" src="${root}assets/img/logo-angopi.png" alt="ANGOPI Agencia de Seguros" width="568" height="191">
        <img class="brand__light" src="${root}assets/img/logo-angopi-blanco.png" alt="ANGOPI Agencia de Seguros" width="568" height="191">
      </a>
      <nav aria-label="Principal">
        <ul class="nav-links">${NAV.map((n) => `<li><a href="${root}${n.href}">${n.label}</a></li>`).join('')}</ul>
      </nav>
      <div class="nav-actions">
        <a class="btn btn--dark btn--sm nav-cta" href="${asesoria}" target="_blank" rel="noopener">Solicitar asesoría</a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="menu-movil" aria-label="Abrir menú">
          <span class="icon-open">${icon('menu')}</span><span class="icon-close">${icon('close')}</span>
        </button>
      </div>
    </div>
    <div class="mobile-menu" id="menu-movil" hidden>
      <nav aria-label="Principal (móvil)">
        <ul>
          ${NAV.map((n) => `<li><a href="${root}${n.href}">${n.label}${icon('arrow-right', 'icon--sm')}</a></li>`).join('')}
        </ul>
      </nav>
      <div class="mobile-menu__actions">
        <a class="btn btn--dark btn--block" href="${asesoria}" target="_blank" rel="noopener">Solicitar asesoría</a>
        <a class="btn btn--outline btn--block" href="tel:${SITE.phone1Raw}">${icon('phone')}Llamar al ${SITE.phone1}</a>
      </div>
    </div>
  </header>

  <main id="contenido">
${body}
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="${root}assets/img/logo-angopi.png" alt="ANGOPI Agencia de Seguros" width="568" height="191" loading="lazy">
          <p class="footer-claim">Te guardamos la espalda.</p>
          <p>Agencia de seguros multi-productos. En Barranquilla desde 1955.</p>
          <ul class="social" aria-label="Redes sociales">
            <li><a href="${LINKS.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${icon('facebook')}</a></li>
            <li><a href="${LINKS.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${icon('instagram')}</a></li>
            <li><a href="${LINKS.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${icon('linkedin')}</a></li>
            <li><a href="${LINKS.youtube}" target="_blank" rel="noopener" aria-label="YouTube">${icon('youtube')}</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <p class="footer-col__title">Navegación</p>
          <ul>
            ${NAV.map((n) => `<li><a href="${root}${n.href}">${n.label}</a></li>`).join('\n            ')}
          </ul>
        </div>
        <div class="footer-col">
          <p class="footer-col__title">Contacto</p>
          <ul>
            <li><a href="${esc(wa('¡Hola! Les escribo desde la página web.'))}" target="_blank" rel="noopener">WhatsApp ${SITE.phone1}</a></li>
            <li><a href="tel:${SITE.phone2Raw}">Teléfono ${SITE.phone2}</a></li>
            <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
            <li><a href="${LINKS.calendly}" target="_blank" rel="noopener">Cita virtual con un asesor</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <p class="footer-col__title">Visítanos</p>
          <address>
            <a href="${LINKS.maps}" target="_blank" rel="noopener">Carrera 64B # 85 – 150, Of. 506<br>Edificio River View, Barranquilla</a>
            <a href="${LINKS.maps}" target="_blank" rel="noopener">Cómo llegar</a>
          </address>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© ${new Date().getFullYear()} ${SITE.legalName} NIT ${SITE.nit}</p>
        <p><a href="${root}politica-de-datos/">Política de tratamiento de datos</a></p>
      </div>
    </div>
  </footer>

  <a class="wa-float" href="${esc(wa('¡Hola! Les escribo desde la página web.'))}" target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp">${icon('whatsapp')}</a>

  <script src="${root}assets/js/main.js?v=${SITE.version}" defer></script>
  ${scripts}
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// Construcción
// ---------------------------------------------------------------------------
function rootFor(path) {
  const depth = path.split('/').filter(Boolean).length;
  return depth ? '../'.repeat(depth) : '';
}

const pagesDir = join(SRC, 'pages');
const files = readdirSync(pagesDir).filter((f) => f.endsWith('.html'));
const sitemap = [];

for (const f of files) {
  const { meta, body } = parsePage(join(pagesDir, f));
  const path = meta.path ?? '';
  const isNotFound = f === '404.html';
  const ctx = { root: isNotFound ? SITE.url : rootFor(path), path, absolute: isNotFound };
  const html = layout(meta, render(body, ctx), ctx);
  const outFile = isNotFound ? join(ROOT, '404.html') : join(ROOT, path, 'index.html');
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, html);
  if (!meta.noindex) sitemap.push({ loc: SITE.url + path, priority: path === '' ? '1.0' : '0.8' });
  console.log('✓', outFile.replace(ROOT, '').replace(/\\/g, '/'));
}

// Redirecciones de URLs antiguas
for (const [from, anchor] of Object.entries(LEGACY)) {
  const target = SITE.url + anchor;
  const to = (rootFor(dirname(from).replace(/^\.$/, '')) || './') + anchor;
  mkdirSync(dirname(join(ROOT, from)), { recursive: true });
  writeFileSync(
    join(ROOT, from),
    `<!doctype html>
<html lang="es-CO">
<head>
  <meta charset="utf-8">
  <title>Redirigiendo…</title>
  <meta name="robots" content="noindex">
  <link rel="canonical" href="${target}">
  <meta http-equiv="refresh" content="0; url=${to}">
</head>
<body>
  <p>Esta página cambió de dirección. <a href="${to}">Continuar</a>.</p>
</body>
</html>
`,
  );
  console.log('↪', from, '→', to);
}

sitemap.sort((a, b) => a.loc.localeCompare(b.loc));
writeFileSync(
  join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map((u) => `  <url><loc>${u.loc}</loc><changefreq>monthly</changefreq><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>
`,
);
writeFileSync(join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}sitemap.xml\n`);
writeFileSync(
  join(ROOT, 'site.webmanifest'),
  JSON.stringify(
    {
      name: SITE.name,
      short_name: 'Angopi',
      start_url: './',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#1a50b8',
      icons: [
        { src: 'assets/img/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: 'assets/img/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    null,
    2,
  ) + '\n',
);
console.log('✓ sitemap.xml, robots.txt, site.webmanifest');

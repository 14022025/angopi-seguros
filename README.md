# Angopi Agencia de Seguros — Sitio web

Home de **Agencia de Seguros Angopi Ltda.** (Barranquilla, desde 1955), por Kaiva Studio.

**Vista en línea:** https://14022025.github.io/angopi-seguros/

## Qué tiene

Cinco páginas con el mismo menú:

- **Home:** portada, aliados, carrusel de seguros, Somos Angopi, ¿Por qué elegir Angopi?, Nuestra historia, Equipo, Recursos y Contacto. Cada tarjeta del carrusel lleva a la sección de ese seguro en su landing.
- **Personas (`/personas/`):** auto, moto, SOAT, vida, salud, hogar, viaje, mascotas, bicicletas y otros seguros.
- **Empresas (`/empresas/`):** responsabilidad civil, cumplimiento, daños y lucro, transporte, montaje y construcción, beneficios a empleados y profesionales independientes.
- **Arrendamiento (`/arrendamiento/`):** abre con el cotizador de SURA (Arriendy) y el código de asesor de Angopi.
- **Contacto (`/contacto/`):** canales, formulario que abre WhatsApp, mapa y correos de cada asesor.

- **Textos:** salen de fuentes reales de Angopi: angopi.co, su LinkedIn, su Instagram, su Linktree y el correo de bienvenida.
- **Color:** un solo azul, el del logo (`#418EF2`), con negro, grises y blanco.
- **Tipografía:** Nunito Sans en los títulos y Geist en el texto.

## Estructura

```
src/pages/        Contenido de cada página (HTML con front matter)
src/partials/     Bloques reutilizables (aseguradoras, equipo)
scripts/build.mjs Generador estático sin dependencias
assets/           CSS, JS e imágenes (assets/img/fotos: fotos en WebP)
```

Las páginas de la raíz se **generan**, no se editan a mano:

```bash
node scripts/build.mjs
```

Las direcciones del sitio anterior (`spersonas.html`, `about.html`, `/personas/`, etc.) redirigen a la sección correspondiente de la página de inicio.

## Pendiente antes de publicar en el dominio propio

- **Fotos del carrusel:** 8 se ven hoy desde la vista previa de Magnific (antes Freepik) y aparecen marcadas con `m:` en `scripts/build.mjs`. Hay que descargarlas con la cuenta y reemplazarlas por archivos en `assets/img/fotos`.
- **Dominio:** para publicar en el dominio propio, cambia `SITE.url` en `scripts/build.mjs` y vuelve a generar.
- **Política de tratamiento de datos:** falta el texto final, validado con Angopi.

# Angopi Agencia de Seguros — Sitio web

Rediseño del sitio de **Agencia de Seguros Angopi Ltda.** (Barranquilla, desde 1955), por Kaiva Studio.

**Demo:** https://theo272004.github.io/angopi-seguros/

## Dirección

- **Mensaje:** «Te guardamos la espalda». Es una agencia familiar del lado del asegurado: compara entre siete aseguradoras, explica la póliza y acompaña al reclamar.
- **Prueba de confianza:** la historia real, desde Colseguros en Magangué, pasando por Barranquilla en 1955 y el relevo familiar de 1985.
- **Sistema visual:** Geist, titulares 600 con tracking cerrado, navegación flotante en píldora, marcos oscuros redondeados, bento en paneles grises y el azul del logo (#418EF2) como acento.
- **Conversión:**
  - WhatsApp con mensajes prellenados por producto.
  - Cotizador de arrendamiento SURA (Arriendy) embebido.
  - SOAT en línea y enlaces de SURA en línea con el código de asesor 10218.
  - Calendly para citas virtuales.

## Estructura

```
src/pages/       Contenido de cada página (HTML con front matter)
src/partials/    Bloques reutilizables (aseguradoras, equipo, CTA…)
scripts/build.mjs  Generador estático sin dependencias
assets/          CSS, JS e imágenes
```

Las páginas de la raíz (`index.html`, `personas/`, `empresas/`…) se **generan**. No se editan a mano.

```bash
node scripts/build.mjs
```

El generador también crea `sitemap.xml`, `robots.txt`, `site.webmanifest`, los datos estructurados (InsuranceAgency, BreadcrumbList y FAQPage) y las redirecciones desde las URLs del sitio actual (`spersonas.html`, `about.html`, etc.).

Para publicar en el dominio propio, cambia `SITE.url` en `scripts/build.mjs` y vuelve a generar.

## Pendiente de validar con Angopi

- NIT y razón social para el pie de página.
- Roles exactos del equipo (hoy se infieren de los correos: gerencia, comercial, asistencia, técnico y ventas).
- Número oficial de WhatsApp (el sitio actual usa también el 302 226 8682 en la página de empresas).
- Que cotizar y recibir asesoría no tenga costo (se menciona en el sitio).
- Coberturas exactas del seguro de arrendamiento SURA.
- Texto final de la política de tratamiento de datos (hoy está marcada como «en revisión»).
- Fotos profesionales del equipo y material de archivo histórico.

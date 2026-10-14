# Angopi Agencia de Seguros — Sitio web

Home de **Agencia de Seguros Angopi Ltda.** (Barranquilla, desde 1955), por Kaiva Studio.

**Vista en línea:** https://14022025.github.io/angopi-seguros/

## Qué tiene

Una sola página de inicio, con sus secciones en este orden:

1. Portada.
2. Aliados: franja con los logos en movimiento.
3. Seguros y soluciones: carrusel con todos los servicios para personas y empresas.
4. Somos Angopi.
5. ¿Por qué elegir Angopi?
6. Nuestra historia.
7. Equipo.
8. Recursos y gestiones.
9. Contacto.

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

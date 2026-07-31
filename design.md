# Design — Routine Tracker

Sistema de diseño bloqueado para la app. Toda página nueva o rediseño debe leer
este archivo antes de emitir código. No regenerar por página — extender o
modificar este archivo cuando el sistema necesite crecer.

## Genero
editorial (tema Sport)

## Familia de macroestructura
Una sola familia — app pages (no hay páginas de marketing). Función > adorno:
sin hero enrichment, sin imágenes decorativas. La identidad Sport vive en
color, tipografía, voz de CTA y trato de tablas/tarjetas, no en estructura de
landing.

- App pages: shell estándar (`.navbar` + `.page-container` + `.page-header`),
  variando solo el contenido (formulario / tabla / gráfico).

## Tema — Sport
- `--color-paper`    oklch(97% 0.008 60)
- `--color-paper-2`  oklch(94% 0.010 60)
- `--color-paper-3`  oklch(90% 0.012 58)
- `--color-rule`     oklch(85% 0.010 55)
- `--color-neutral`  oklch(60% 0.008 55)
- `--color-ink-2`    oklch(38% 0.010 50)
- `--color-ink`      oklch(18% 0.012 50)
- `--color-accent`       oklch(58% 0.19 27)   /* rojo-naranja atlético */
- `--color-accent-hover` oklch(52% 0.20 27)
- `--color-accent-ink`   oklch(97% 0.010 60)
- `--color-focus`        oklch(62% 0.19 27)
- `--color-success` oklch(62% 0.15 145)
- `--color-danger`  oklch(55% 0.18 25)
- `--color-warn`    oklch(75% 0.15 85)

Ejes de diversificación (por si se agrega otro tema más adelante): paper band
= light · display style = display-condensed (roman) · accent hue = warm (27°).

## Tipografia
- Display: Big Shoulders Display, peso 700/900 — h1/h2/h3, wordmark, botones.
- Body: IBM Plex Sans, peso 400/500/600 — texto de página, labels, inputs.
- Outlier (Geist Mono): SOLO en cifras "hero-stat" — el maximo/minimo de
  `.analisis-destacado strong` y las fechas de `.session-detail-fecha`. No se
  usa en ningun otro lugar (regla de maximo 2 slots).
- Escala: 1.25 (major third) sobre base de 16px. Ver `--text-*` en `tokens.css`.

## Espaciado
Escala de 4pt con nombres semanticos (`--space-3xs` a `--space-2xl`). Los
componentes usan los tokens, nunca valores crudos.

## Motion
- Easings: `--ease-out` = cubic-bezier(0.16, 1, 0.3, 1), `--ease-in-out`.
- Patron: solo transform/opacity en hover/active de botones (press effect:
  el boton se "hunde" en su propia sombra dura al hacer click). Sin scroll
  reveals — es una app de datos, no una landing.
- `prefers-reduced-motion: reduce` recorta toda transicion a 1ms.

## Postura de microinteracciones
- Sin toasts celebratorios; los errores se muestran inline (`.auth-error`,
  `.analisis-nota`).
- Foco visible instantaneo (`:focus-visible`, sin transicion en el anillo).

## Voz de CTA
- Primario: solido, color de acento, texto en mayusculas, `font-display`,
  sombra dura (offset 2-3px sin blur) que colapsa al hacer click.
- Secundario: outline punteado en `--color-ink-2`, se tiñe de acento al hover.
- Destructivo (eliminar/cerrar sesion): outline en `--color-ink` o texto en
  `--color-danger`, nunca compite en peso visual con el primario.

## Asignaciones por pagina
- Todas las paginas de la app siguen el mismo shell (navbar + page-container).
- Ninguna pagina usa imagenes ni enrichment — la app es 100% funcional/datos.
- Los graficos (Chart.js, HU-05/HU-06) usan `--color-accent` para la serie
  principal y variantes de exito/alerta (`#409d48` / `#c53637`) para
  maximo/minimo — ver constantes en `ProgressChart.jsx` / `MuscleAnalysis.jsx`
  (Chart.js no puede leer `var()` de CSS, por eso llevan el hex equivalente).

## Que deben compartir todas las paginas
- El wordmark "Routine**Tracker**" (Routine en tinta, Tracker en acento).
- El color de acento y su uso moderado (barras de foco, botones primarios,
  bordes de tarjeta izquierdos en `.filter-bar` / `.analisis-destacado`).
- Las fuentes display + body.
- La voz de los botones (radios agudos, sombra dura, mayusculas en el primario).

## Que pueden variar
- El contenido interno de cada `.page-container` (tabla, formulario, grafico).
- La presencia o no de `.filter-bar` segun si la pagina filtra datos.

## Exports

### tokens.css
Ver `frontend/src/tokens.css` — es el archivo real que consume la app,
mantenido como fuente de verdad (no se duplica aqui para evitar que ambos
diverjan).

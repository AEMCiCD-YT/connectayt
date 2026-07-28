# Cromática · Conecta IEEE YT 2026

Guía de color para el sistema de marca de Conecta IEEE YT y sus dos jornadas (Conecta Empresas y Conecta Universidades). Incluye valores HEX/RGB y notas de uso recomendadas según el rol de cada color en el diseño.

---

## 1. Color IEEE YT

Color raíz de la marca. Ancla el hub general (`index.html`) y aparece como acento institucional en ambas jornadas.

| Color | HEX | RGB |
|---|---|---|
| 🔵 IEEE YT | `#00629b` | `rgb(0, 98, 155)` |

**Uso:** logotipo, encabezado del hub, panel "día" del split-hero, menciones de crédito institucional en la jornada nocturna.

---

## 2. Colores Logos Escuelas YT

Paleta secundaria, tomada de los logos de las escuelas participantes. Es la más vibrante del sistema y funciona bien en conjunto (gradientes, acentos, iconografía), no como bloques de color aislados.

| Color | HEX | RGB | Nota de contraste |
|---|---|---|---|
| 🟤 Bronce | `#926f45` | `rgb(146, 111, 69)` | texto blanco encima |
| 🔵 Azul escuelas | `#0048a1` | `rgb(0, 72, 161)` | texto blanco encima |
| 🩵 Cian | `#00bcca` | `rgb(0, 188, 202)` | texto negro/oscuro encima |
| 🟢 Verde | `#00bc52` | `rgb(0, 188, 82)` | texto negro/oscuro encima |
| 🟡 Amarillo | `#fdca26` | `rgb(253, 202, 38)` | texto negro encima (nunca blanco) |
| 🟠 Coral | `#ff5242` | `rgb(255, 82, 66)` | texto blanco encima |
| 🟣 Morado | `#9d7cb0` | `rgb(157, 124, 176)` | texto blanco/negro encima (contraste medio) |

**Uso:** paleta "gala" de Conecta Universidades — halos de fondo, bordes de tarjetas, degradados de botones. Evitar usarla en fondos grandes de la jornada corporativa (Conecta Empresas), donde debe mantenerse subordinada al azul institucional.

---

## 3. Color Institucional AEMCiCD

Paleta neutra + roja de la asociación estudiantil. Es la base tipográfica y estructural de las páginas: blanco/negro para fondo y texto, rojo como único acento de acción.

| Color | HEX | RGB |
|---|---|---|
| 🔴 Rojo AEMCiCD | `#ef4036` | `rgb(239, 64, 54)` |
| ⚪ Blanco | `#ffffff` | `rgb(255, 255, 255)` |
| ⚫ Negro | `#000000` | `rgb(0, 0, 0)` |
| 🔵 Azul AEMCiCD | `#25628f` | `rgb(37, 98, 143)` |

**Uso:** el rojo se reserva para llamadas a la acción (botones "Enviar", "Revisar Dossier") — nunca para grandes superficies. El azul (`#25628f`) es el color de texto/headline principal en Conecta Empresas.

---

## 4. Sombra Rojo AEMCiCD

Escala tonal del rojo institucional, de más claro/saturado a más oscuro. Sirve para estados (hover, active, disabled) y para dar profundidad sin salir de la familia de marca.

| Paso | HEX | RGB | Uso sugerido |
|---|---|---|---|
| 1 · Base | `#ef4036` | `rgb(239, 64, 54)` | color de acción por defecto |
| 2 · Hover | `#cc372f` | `rgb(204, 55, 47)` | estado `:hover` de botones |
| 3 · Active | `#a32c26` | `rgb(163, 44, 38)` | estado `:active` / pressed |
| 4 · Oscuro | `#7a211c` | `rgb(122, 33, 28)` | texto sobre fondos claros, bordes |
| 5 · Más oscuro | `#521613` | `rgb(82, 22, 19)` | sombras, fondos muy oscuros con acento rojo |

---

## 5. Sombra Azul AEMCiCD

Escala tonal del azul institucional. Es la escala más versátil del sistema: cubre desde un azul casi negro (fondos nocturnos) hasta un azul cielo claro (acentos sobre fondo oscuro).

| Paso | HEX | RGB | Uso sugerido |
|---|---|---|---|
| 1 · Base | `#25628f` | `rgb(37, 98, 143)` | color primario de texto/marca (Conecta Empresas) |
| 2 · Medio | `#1c4a6b` | `rgb(28, 74, 107)` | bordes, estados intermedios |
| 3 · Oscuro | `#112e42` | `rgb(17, 46, 66)` | fondos oscuros, tarjetas sobre negro |
| 4 · Claro | `#3c9fe6` | `rgb(60, 159, 230)` | enlaces/acentos sobre fondo oscuro |
| 5 · Medio-claro | `#3183bd` | `rgb(49, 131, 189)` | degradados, panel "día" del hub |

---

## 6. Cómo se combinan las tres paletas

| Contexto | Paleta dominante | Paleta de acento |
|---|---|---|
| **Hub (`index.html`)** | IEEE YT (`#00629b`) + Sombra Azul (día) | Logos Escuelas (noche) |
| **Conecta Empresas** | Sombra Azul AEMCiCD (texto, fondo) | Rojo AEMCiCD (CTAs) |
| **Conecta Universidades** | Fondo oscuro + Sombra Azul (base nocturna) | Logos Escuelas (neones, degradados) |

**Regla general de contraste:** los colores con luminancia alta —blanco, amarillo (`#fdca26`), cian (`#00bcca`), verde (`#00bc52`), azul claro (`#3c9fe6`)— llevan texto oscuro o negro encima. El resto de la paleta (rojos, azules profundos, morado, bronce, negro) lleva texto blanco.

---

## 7. Contribuidores & Desarrolladores

* **Ariel Pincay** ([@arielpincayy](https://github.com/arielpincayy)) — Co-Desarrollador / Maquetación y Diseño de **Conecta Universidades** (Integración IEEE 2026) y Estructura del Macroevento.
* **Equipo AEMCiCD & IEEE Yachay Tech** — Co-Organización y Desarrollo Institucional para **Conecta Empresas** y **Conecta Universidades**.

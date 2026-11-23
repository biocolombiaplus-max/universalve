# Universal de Sintéticos Venezuela — Tienda web

Landing + tienda de cueros sintéticos, semicueros y textiles recubiertos.
Funciona sin servidor ni base de datos: son archivos estáticos (HTML, CSS, JS).

## Estructura

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La tienda (landing, catálogo, carrito, pedido) |
| `admin.html` | Panel para agregar, editar y eliminar productos |
| `assets/js/config.js` | **WhatsApp, pagos, envíos, tasa Bs., datos de contacto** |
| `assets/js/productos.js` | **El catálogo de productos y categorías** |
| `assets/css/styles.css` | Diseño |
| `assets/img/` | Fotos de productos y favicon |

## Antes de publicar (5 minutos)

1. Abre `assets/js/config.js` y cambia:
   - `whatsapp`: tu número en formato internacional, sin `+` (ej. `584141234567`).
   - `metodosPago`: datos reales de Pago Móvil, cuenta bancaria, Zelle y Binance.
   - `email`, `instagram`, `direccion`, `horario`.
   - `tasaBs`: tasa del día si quieres mostrar el total en bolívares (0 la oculta).
2. Revisa precios y productos (ver abajo).

## Cómo agregar productos

**Opción fácil:** abre `admin.html`, crea o edita productos (nombre, precio, colores…),
pulsa **Descargar productos.js** y reemplaza `assets/js/productos.js` por el archivo descargado.

**Opción manual:** en `assets/js/productos.js` copia un bloque `{ ... }`, pégalo al final de la
lista y cambia los datos. Cada campo está explicado al inicio del archivo.

Fotos: sube la imagen a `assets/img/` y escribe su ruta en el campo `imagen`
(ej. `assets/img/vertice.jpg`). Sin foto, la tienda dibuja una muestra con textura de cuero en el color elegido.

## Cómo compra el cliente

1. Elige producto → color → metros → "Agregar al carrito".
2. En el carrito completa nombre, cédula/RIF, teléfono, ciudad, entrega y método de pago.
3. Se abre WhatsApp con el pedido detallado (número de orden, productos, total y datos del cliente).

El carrito se guarda en el navegador del cliente aunque cierre la página.

Enlace directo a un producto: `index.html#p=vertice-pu`

## Publicar gratis

Sirve cualquier hosting estático: **Netlify** (arrastrar la carpeta), **Vercel**,
**GitHub Pages** o **Cloudflare Pages**. Luego conecta tu dominio.

## Probar en tu computadora

Abre `index.html` con doble clic, o desde la carpeta:

```bash
python3 -m http.server 8000
```

y visita http://localhost:8000

/* =========================================================================
   CONFIGURACIÓN DEL NEGOCIO — edita estos datos antes de publicar
   ========================================================================= */
window.CONFIG = {
  empresa: "Universal de Sintéticos Venezuela",
  marcaCorta: "Universal",

  // WhatsApp que recibe los pedidos. Formato internacional sin "+" ni espacios.
  // Ej. 0414-123.45.67  →  "584141234567"
  whatsapp: "584140000000",

  email: "ventas@universalsinteticos.com",
  instagram: "universalsinteticos",
  direccion: "Zona Industrial, Valencia, Carabobo",
  horario: "Lun a Vie 8:00 a 17:00 · Sáb 8:00 a 12:00",

  moneda: "USD",
  // Tasa en Bs. por USD para mostrar el equivalente en bolívares (0 = no mostrar).
  tasaBs: 0,

  // Pedido mínimo en metros por color (no aplica a productos con unidad "unidad")
  minimoMetros: 1,

  // Envío gratis a partir de este monto en USD (0 = desactivado)
  envioGratisDesde: 300,

  metodosPago: [
    { id: "pagomovil", nombre: "Pago Móvil",            detalle: "Banco 0102 · V-00.000.000 · 0414-0000000" },
    { id: "transferencia", nombre: "Transferencia Bs.", detalle: "Cuenta corriente 0102-0000-00-0000000000" },
    { id: "zelle",    nombre: "Zelle",                  detalle: "pagos@universalsinteticos.com" },
    { id: "binance",  nombre: "Binance Pay (USDT)",     detalle: "ID 000000000" },
    { id: "efectivo", nombre: "Efectivo en tienda",     detalle: "USD o Bs. al retirar" }
  ],

  metodosEntrega: [
    { id: "retiro", nombre: "Retiro en almacén" },
    { id: "delivery", nombre: "Delivery en la ciudad" },
    { id: "mrw", nombre: "Envío nacional MRW" },
    { id: "zoom", nombre: "Envío nacional Zoom" },
    { id: "tealca", nombre: "Envío nacional Tealca" }
  ]
};

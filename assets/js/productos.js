/* =========================================================================
   CATÁLOGO — Universal de Sintéticos Venezuela
   -------------------------------------------------------------------------
   Para AGREGAR un producto: copia un bloque { ... }, pégalo al final de la
   lista y cambia sus datos. También puedes usar /admin.html, que genera
   este archivo automáticamente.

   Campos:
     id          identificador único, sin espacios (ej. "vertice-pu")
     nombre      nombre comercial
     linea       subtítulo corto
     categoria   una de las claves de CATEGORIAS (abajo)
     precio      precio en USD por metro lineal
     precioAntes (opcional) precio tachado para mostrar oferta
     ancho       ancho del rollo, ej. "1,40 m"
     composicion ej. "PU sobre base poliéster"
     espesor     ej. "1,1 mm"
     descripcion texto de venta
     usos        lista de aplicaciones
     atributos   lista de etiquetas técnicas
     colores     lista de { nombre, hex }   (el hex pinta la muestra)
     ref         código de referencia, ej. "VT-1402"
     textura     grano | liso | gamuza | croco | perforado | capitone
     imagen      (opcional) ruta a una foto, ej. "assets/img/vertice.jpg"
     destacado   true para mostrarlo con la etiqueta "Destacado"
     nuevo       true para mostrar la etiqueta "Nuevo"
     stock       true = disponible / false = bajo pedido
   ========================================================================= */

window.CATEGORIAS = {
  tapiceria:  { nombre: "Tapicería y muebles",       icono: "sofa" },
  automotriz: { nombre: "Automotriz",                icono: "car" },
  nautico:    { nombre: "Náutico y exterior",        icono: "wave" },
  salud:      { nombre: "Salud y hospitalario",      icono: "cross" },
  calzado:    { nombre: "Calzado y marroquinería",   icono: "bag" },
  eco:        { nombre: "Línea ecológica",           icono: "leaf" }
};

window.PRODUCTOS = [
  {
    id: "vertice-pu",
    ref: "VT-1402",
    textura: "grano",
    nombre: "Vértice",
    linea: "Poliuretano premium de tacto natural",
    categoria: "tapiceria",
    precio: 14.9,
    ancho: "1,40 m",
    composicion: "PU sobre base poliéster",
    espesor: "1,1 mm",
    descripcion: "Nuestro sintético de mayor nobleza: caída suave, poro fino y un tacto que se confunde con la piel natural. Pensado para sofás, cabeceros y mobiliario de diseño.",
    usos: ["Sofás y butacas", "Cabeceros", "Mobiliario de diseño", "Hotelería"],
    atributos: ["Más de 100.000 ciclos Martindale", "Fácil limpieza", "Resistente a la luz"],
    colores: [
      { nombre: "Coñac", hex: "#8a4b26" },
      { nombre: "Negro ónix", hex: "#1c1b1a" },
      { nombre: "Arena", hex: "#c9b08d" },
      { nombre: "Grafito", hex: "#4a4847" },
      { nombre: "Verde botella", hex: "#28402f" },
      { nombre: "Marfil", hex: "#e8dfcf" }
    ],
    destacado: true,
    stock: true
  },
  {
    id: "atlas-pvc",
    ref: "AT-1100",
    textura: "liso",
    nombre: "Atlas",
    linea: "PVC de alto tráfico",
    categoria: "tapiceria",
    precio: 8.5,
    precioAntes: 9.9,
    ancho: "1,40 m",
    composicion: "PVC sobre tejido de algodón-poliéster",
    espesor: "1,0 mm",
    descripcion: "El caballo de batalla para restaurantes, oficinas y espacios comerciales. Alta resistencia a la abrasión y al uso intensivo a un precio imbatible.",
    usos: ["Restaurantes", "Sillas de oficina", "Bancos y barras", "Espacios comerciales"],
    atributos: ["Alta abrasión", "Retardante de llama", "Impermeable"],
    colores: [
      { nombre: "Rojo vino", hex: "#6b1e24" },
      { nombre: "Negro", hex: "#161616" },
      { nombre: "Chocolate", hex: "#3e271b" },
      { nombre: "Blanco", hex: "#efece6" },
      { nombre: "Azul marino", hex: "#1d2a44" }
    ],
    stock: true
  },
  {
    id: "andes-auto",
    ref: "AN-1210",
    textura: "grano",
    nombre: "Andes",
    linea: "Tapicería automotriz OEM",
    categoria: "automotriz",
    precio: 12.4,
    ancho: "1,40 m",
    composicion: "PVC/PU con soporte tricot",
    espesor: "1,2 mm",
    descripcion: "Desarrollado para asientos, techos y paneles de vehículos. Soporta calor extremo, sol directo y el roce diario sin perder color ni forma.",
    usos: ["Asientos", "Paneles de puerta", "Volantes y palancas", "Motos"],
    atributos: ["Resistente a 90 °C", "Bajo olor", "Antimanchas"],
    colores: [
      { nombre: "Beige", hex: "#b9a27f" },
      { nombre: "Negro mate", hex: "#1a1a1a" },
      { nombre: "Gris titanio", hex: "#6b6d70" },
      { nombre: "Rojo racing", hex: "#9b1b1b" }
    ],
    destacado: true,
    stock: true
  },
  {
    id: "andes-perforado",
    ref: "AP-1215",
    textura: "perforado",
    nombre: "Andes Perforado",
    linea: "Versión transpirable para asientos",
    categoria: "automotriz",
    precio: 13.9,
    ancho: "1,40 m",
    composicion: "PU microperforado con soporte tricot",
    espesor: "1,2 mm",
    descripcion: "La misma resistencia de Andes, con microperforación que deja respirar al asiento. Ideal para el clima venezolano.",
    usos: ["Asientos deportivos", "Insertos", "Fundas a medida"],
    atributos: ["Transpirable", "Resistente a 90 °C", "Acabado deportivo"],
    colores: [
      { nombre: "Camel", hex: "#9c7148" },
      { nombre: "Negro", hex: "#191919" },
      { nombre: "Gris humo", hex: "#56585b" }
    ],
    nuevo: true,
    stock: true
  },
  {
    id: "marina-pro",
    ref: "MP-1370",
    textura: "grano",
    nombre: "Marina Pro",
    linea: "Náutico con protección UV y antihongos",
    categoria: "nautico",
    precio: 16.8,
    ancho: "1,37 m",
    composicion: "PVC marino con tratamiento antimicrobiano",
    espesor: "1,0 mm",
    descripcion: "Para lanchas, yates, piscinas y terrazas. Resiste el sol del Caribe, el salitre y la humedad sin agrietarse ni manchar.",
    usos: ["Lanchas y yates", "Muebles de exterior", "Piscinas y terrazas", "Clubes de playa"],
    atributos: ["Protección UV", "Antihongos", "Resiste el agua salada"],
    colores: [
      { nombre: "Blanco náutico", hex: "#f2f1ec" },
      { nombre: "Azul Caribe", hex: "#1f5f8b" },
      { nombre: "Arena", hex: "#d4c3a3" },
      { nombre: "Gris perla", hex: "#a9acad" }
    ],
    destacado: true,
    stock: true
  },
  {
    id: "terra-outdoor",
    ref: "TR-0940",
    textura: "liso",
    nombre: "Terra",
    linea: "Exterior para hotelería y jardín",
    categoria: "nautico",
    precio: 11.2,
    ancho: "1,40 m",
    composicion: "PVC con barniz protector",
    espesor: "0,9 mm",
    descripcion: "Colores tierra y texturas suaves para mobiliario de exterior en hoteles, posadas y residencias.",
    usos: ["Tumbonas", "Cojines de exterior", "Posadas y hoteles"],
    atributos: ["Protección UV", "Lavable", "Secado rápido"],
    colores: [
      { nombre: "Terracota", hex: "#a5532f" },
      { nombre: "Oliva", hex: "#6b6a3e" },
      { nombre: "Lino", hex: "#d9cdb5" }
    ],
    stock: true
  },
  {
    id: "clinica-shield",
    ref: "CS-1010",
    textura: "liso",
    nombre: "Clínica Shield",
    linea: "Antibacterial para el sector salud",
    categoria: "salud",
    precio: 15.5,
    ancho: "1,40 m",
    composicion: "PU con aditivo antimicrobiano e inhibidor de fluidos",
    espesor: "1,0 mm",
    descripcion: "Diseñado para clínicas, consultorios y laboratorios. Inhibe el crecimiento bacteriano, resiste desinfectantes con alcohol y cloro diluido y repele fluidos.",
    usos: ["Camillas", "Sillones de odontología", "Salas de espera", "Laboratorios clínicos"],
    atributos: ["Antibacterial", "Resiste desinfectantes", "Repele fluidos", "Fácil asepsia"],
    colores: [
      { nombre: "Azul clínico", hex: "#2f6f9f" },
      { nombre: "Verde quirófano", hex: "#3e8a7a" },
      { nombre: "Blanco", hex: "#eeeeea" },
      { nombre: "Gris", hex: "#7a7d80" },
      { nombre: "Negro", hex: "#1b1b1b" }
    ],
    destacado: true,
    nuevo: true,
    stock: true
  },
  {
    id: "bravo-calzado",
    ref: "BR-1300",
    textura: "liso",
    nombre: "Bravo",
    linea: "Sintético para calzado y marroquinería",
    categoria: "calzado",
    precio: 9.8,
    ancho: "1,40 m",
    composicion: "PU sobre base no tejida",
    espesor: "1,3 mm",
    descripcion: "Buen cuerpo, flexibilidad y un brillo controlado para zapatos, carteras, correas y artículos de cuero sintético.",
    usos: ["Calzado", "Carteras", "Correas", "Billeteras"],
    atributos: ["Alta flexión", "Corte limpio", "Buen pegado"],
    colores: [
      { nombre: "Miel", hex: "#a8692e" },
      { nombre: "Negro", hex: "#141414" },
      { nombre: "Taupe", hex: "#7c6d62" },
      { nombre: "Vino", hex: "#5a1c25" }
    ],
    stock: true
  },
  {
    id: "lux-croco",
    ref: "LC-1220",
    textura: "croco",
    nombre: "Lux Croco",
    linea: "Grabado de cocodrilo",
    categoria: "calzado",
    precio: 13.5,
    ancho: "1,40 m",
    composicion: "PU grabado en alto relieve",
    espesor: "1,2 mm",
    descripcion: "Textura de reptil con relieve profundo y acabado satinado. Para piezas de lujo, accesorios y detalles de mobiliario.",
    usos: ["Carteras de lujo", "Accesorios", "Detalles de mobiliario"],
    atributos: ["Alto relieve", "Acabado satinado", "Edición limitada"],
    colores: [
      { nombre: "Verde musgo", hex: "#3a4a31" },
      { nombre: "Negro", hex: "#121212" },
      { nombre: "Nude", hex: "#c4a487" }
    ],
    nuevo: true,
    stock: false
  },
  {
    id: "nobuk-soft",
    ref: "NS-0800",
    textura: "gamuza",
    nombre: "Nobuk Soft",
    linea: "Microfibra efecto gamuza",
    categoria: "tapiceria",
    precio: 12.9,
    ancho: "1,45 m",
    composicion: "Microfibra de poliéster",
    espesor: "0,8 mm",
    descripcion: "Un terciopelo técnico con efecto nobuk: cálido al tacto, fácil de limpiar y de tono profundo.",
    usos: ["Sofás", "Cojines", "Cabeceros", "Paneles decorativos"],
    atributos: ["Tacto aterciopelado", "Antimanchas", "Lavable"],
    colores: [
      { nombre: "Mostaza", hex: "#b78a2c" },
      { nombre: "Petróleo", hex: "#20494f" },
      { nombre: "Topo", hex: "#7d7065" },
      { nombre: "Rosa antiguo", hex: "#b88a85" }
    ],
    stock: true
  },
  {
    id: "origen-eco",
    ref: "OR-1000",
    textura: "grano",
    nombre: "Origen",
    linea: "Base de fibra PET reciclada",
    categoria: "eco",
    precio: 14.2,
    ancho: "1,40 m",
    composicion: "PU base agua sobre R-PET",
    espesor: "1,0 mm",
    descripcion: "Fabricado con una base de botellas PET recicladas y poliuretano base agua, sin solventes. Para marcas y proyectos con criterio de sostenibilidad.",
    usos: ["Mobiliario sostenible", "Marcas eco", "Proyectos corporativos"],
    atributos: ["Base reciclada", "Sin solventes", "Bajo impacto"],
    colores: [
      { nombre: "Café natural", hex: "#6d4c35" },
      { nombre: "Salvia", hex: "#8c9a7e" },
      { nombre: "Crudo", hex: "#ddd3c0" }
    ],
    nuevo: true,
    stock: true
  },
  {
    id: "muestrario",
    ref: "MU-2026",
    textura: "capitone",
    nombre: "Muestrario profesional",
    linea: "Todas las líneas en un solo libro",
    categoria: "eco",
    precio: 25,
    ancho: "Formato A5",
    composicion: "Más de 60 muestras físicas",
    espesor: "—",
    descripcion: "Toca, compara y elige antes de comprar. El valor del muestrario se reembolsa como crédito en tu primera compra mayor a 50 m.",
    usos: ["Tapiceros", "Arquitectos", "Diseñadores de interiores", "Fábricas"],
    atributos: ["Reembolsable", "Envío nacional", "Más de 60 colores"],
    colores: [
      { nombre: "Edición 2026", hex: "#2b2622" }
    ],
    unidad: "unidad",
    stock: true
  }
];

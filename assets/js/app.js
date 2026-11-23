/* =========================================================================
   Universal de Sintéticos Venezuela — lógica de tienda
   Catálogo, filtros, ficha de producto, carrito y pedido por WhatsApp.
   ========================================================================= */
(function () {
  "use strict";

  const CFG = window.CONFIG;
  const CATS = window.CATEGORIAS;
  const PRODUCTS = window.PRODUCTOS;
  const CART_KEY = "uds_cart_v1";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => "$" + n.toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const bs = (n) => "Bs. " + (n * CFG.tasaBs).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const unitOf = (p) => (p.unidad === "unidad" ? "und" : "m");
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const waLink = (text) => `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(text)}`;

  const SECTOR_COPY = {
    tapiceria: "Sofás, butacas, cabeceros y mobiliario comercial.",
    automotriz: "Asientos, paneles y techos que soportan el sol.",
    nautico: "Lanchas, piscinas y terrazas frente al mar.",
    salud: "Camillas y sillones antibacteriales y fáciles de desinfectar.",
    calzado: "Zapatos, carteras y accesorios con cuerpo y flexibilidad.",
    eco: "Bases recicladas y PU base agua, sin solventes."
  };

  /* ---------------- Estado ---------------- */
  const state = { cat: "todos", q: "", sort: "destacados", current: null, color: 0 };
  let cart = load();

  function load() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
  }
  function save() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* modo privado */ }
  }

  /* ---------------- Swatch ---------------- */
  function swatch(p, colorIdx = 0, cls = "") {
    const c = p.colores[colorIdx] || p.colores[0];
    if (p.imagen) return `<div class="swatch swatch--img ${cls}" style="--img:url('${esc(p.imagen)}')"></div>`;
    return `<div class="swatch ${cls}" style="--c:${esc(c.hex)}"></div>`;
  }
  function priceHTML(p) {
    const old = p.precioAntes ? `<s>${money(p.precioAntes)}</s>` : "";
    return `${old}${money(p.precio)} <small>/ ${p.unidad === "unidad" ? "unidad" : "metro"}</small>`;
  }

  /* ---------------- Filtros ---------------- */
  function renderFilters() {
    const items = [["todos", "Todos"], ...Object.entries(CATS).map(([k, v]) => [k, v.nombre])];
    $("#filters").innerHTML = items
      .map(([k, n]) => `<button class="chip" role="tab" data-cat="${k}" aria-selected="${k === state.cat}">${esc(n)}</button>`)
      .join("");
  }

  function filtered() {
    const q = state.q.trim().toLowerCase();
    let list = PRODUCTS.filter((p) => state.cat === "todos" || p.categoria === state.cat);
    if (q) {
      list = list.filter((p) =>
        [p.nombre, p.linea, p.descripcion, p.composicion, CATS[p.categoria]?.nombre, ...(p.usos || []), ...(p.atributos || []), ...p.colores.map((c) => c.nombre)]
          .join(" ").toLowerCase().includes(q)
      );
    }
    const s = state.sort;
    if (s === "precio-asc") list.sort((a, b) => a.precio - b.precio);
    else if (s === "precio-desc") list.sort((a, b) => b.precio - a.precio);
    else if (s === "nombre") list.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    else list.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));
    return list;
  }

  /* ---------------- Grid ---------------- */
  function renderGrid() {
    const list = filtered();
    $("#empty").hidden = list.length > 0;
    $("#ref-count").textContent = list.length;
    $("#product-grid").innerHTML = list.map((p, i) => {
      const badges = [
        p.destacado ? '<span class="badge badge--gold">Destacado</span>' : "",
        p.nuevo ? '<span class="badge">Nuevo</span>' : "",
        p.precioAntes ? `<span class="badge badge--off">−${Math.round((1 - p.precio / p.precioAntes) * 100)}%</span>` : ""
      ].join("");
      const dots = p.colores.slice(0, 6).map((c, ci) =>
        `<button class="dot${ci === 0 ? " active" : ""}" style="--c:${esc(c.hex)}" data-dot="${ci}" title="${esc(c.nombre)}" aria-label="${esc(c.nombre)}"></button>`).join("");
      const more = p.colores.length > 6 ? `<span class="card__more">+${p.colores.length - 6}</span>` : "";
      return `
        <article class="card" data-id="${esc(p.id)}" style="animation-delay:${Math.min(i, 8) * 50}ms">
          <div class="card__media" data-open>
            <div class="card__badges">${badges}</div>
            ${swatch(p)}
            <button class="card__quick" data-open>Elegir color y metros</button>
          </div>
          <div class="card__body">
            <div class="card__top">
              <h3 class="card__name" data-open>${esc(p.nombre)}</h3>
              <span class="price">${priceHTML(p)}</span>
            </div>
            <p class="card__line">${esc(p.linea)}</p>
            <div class="card__meta">
              <div class="card__dots">${dots}${more}</div>
              <span class="card__stock${p.stock === false ? " pedido" : ""}">${p.stock === false ? "Bajo pedido" : esc(p.ancho)}</span>
            </div>
          </div>
        </article>`;
    }).join("");
  }

  /* ---------------- Sectores / pagos / footer ---------------- */
  function renderStatic() {
    $("#sectors").innerHTML = Object.entries(CATS).map(([k, v], i) => {
      const tones = PRODUCTS.filter((p) => p.categoria === k).flatMap((p) => p.colores).slice(0, 5);
      return `
      <button class="index__row" data-sector="${k}">
        <span class="index__n">${String(i + 1).padStart(2, "0")}</span>
        <span><span class="index__name">${esc(v.nombre)}</span>
          <span class="index__chips">${tones.map((c) => `<i style="--c:${esc(c.hex)}"></i>`).join("")}</span></span>
        <span class="index__desc">${esc(SECTOR_COPY[k] || "")}</span>
        <span class="index__go"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
      </button>`;
    }).join("");

    $("#payments").innerHTML = "<b>Formas de pago</b>" + CFG.metodosPago.map((m) => `<span>${esc(m.nombre)}</span>`).join("");
    $("#contact-mail").href = "mailto:" + CFG.email;
    $("#footer-cats").innerHTML = Object.entries(CATS).map(([k, v]) => `<li><a href="#catalogo" data-sector="${k}">${esc(v.nombre)}</a></li>`).join("");
    $("#footer-contact").innerHTML = `
      <li><a href="${waLink("Hola, quiero información sobre sus materiales.")}" target="_blank" rel="noopener">WhatsApp</a></li>
      <li><a href="mailto:${esc(CFG.email)}">${esc(CFG.email)}</a></li>
      <li><a href="https://instagram.com/${esc(CFG.instagram)}" target="_blank" rel="noopener">@${esc(CFG.instagram)}</a></li>
      <li><span>${esc(CFG.direccion)}</span></li>`;
    $("#footer-hours").textContent = CFG.horario;
    $("#year").textContent = "© " + new Date().getFullYear();

    const hello = waLink("Hola, me gustaría recibir asesoría para un proyecto.");
    $("#wa-float").href = hello;
    $("#contact-cta").href = hello;
    $("#wholesale-cta").href = waLink("Hola, quiero cotizar precios al mayor. Empresa: ___  Material: ___  Metros aprox.: ___");

    // Libro de muestras del hero: [producto, índice de color]
    const picks = [["vertice-pu", 2], ["vertice-pu", 0], ["marina-pro", 1], ["vertice-pu", 4], ["nobuk-soft", 0]]
      .map(([id, ci]) => [byId(id), ci]).filter(([p]) => p && p.colores[0]);
    $("#swatch-book").innerHTML = picks.map(([p, ci]) => {
      const c = p.colores[ci] || p.colores[0];
      return `<figure data-product="${esc(p.id)}" data-color="${ci}"><div class="swatch" style="--c:${esc(c.hex)}"></div>
        <figcaption><b>${esc(p.nombre)}</b><span>${esc(c.nombre)}</span></figcaption></figure>`;
    }).join("");
  }

  /* ---------------- Ficha de producto ---------------- */
  const modal = $("#product-modal");

  function openProduct(id, colorIdx = 0) {
    const p = byId(id);
    if (!p) return;
    state.current = p;
    state.color = colorIdx;
    const u = unitOf(p);
    $("#pm-cat").textContent = CATS[p.categoria]?.nombre || "";
    $("#pm-title").textContent = p.nombre;
    $("#pm-line").textContent = p.linea;
    $("#pm-price").innerHTML = priceHTML(p);
    $("#pm-desc").textContent = p.descripcion;
    $("#pm-unit").textContent = u;
    const qty = $("#pm-qty");
    qty.value = 1;
    qty.step = u === "m" ? 0.5 : 1;
    qty.min = u === "m" ? CFG.minimoMetros : 1;
    $("#pm-colors").innerHTML = p.colores.map((c, i) =>
      `<button class="color-opt" role="radio" aria-checked="${i === colorIdx}" data-color="${i}" style="--c:${esc(c.hex)}" title="${esc(c.nombre)}" aria-label="${esc(c.nombre)}"></button>`).join("");
    $("#pm-colors").setAttribute("role", "radiogroup");
    $("#pm-specs").innerHTML = [
      ["Ancho", p.ancho], ["Composición", p.composicion], ["Espesor", p.espesor],
      ["Usos", (p.usos || []).join(", ")], ["Disponibilidad", p.stock === false ? "Bajo pedido (3–5 días)" : "Inmediata"]
    ].filter(([, v]) => v && v !== "—").map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join("");
    $("#pm-tags").innerHTML = (p.atributos || []).map((a) => `<span>${esc(a)}</span>`).join("");
    paintColor();
    showModal(true);
  }

  function paintColor() {
    const p = state.current, c = p.colores[state.color];
    const sw = $("#pm-swatch");
    if (p.imagen) { sw.className = "swatch swatch--xl swatch--img"; sw.style.setProperty("--img", `url('${p.imagen}')`); }
    else { sw.className = "swatch swatch--xl"; sw.style.setProperty("--c", c.hex); }
    $("#pm-color-name").textContent = c.nombre;
    $("#pm-color-label").textContent = c.nombre;
    $$("#pm-colors .color-opt").forEach((b, i) => b.setAttribute("aria-checked", i === state.color));
    updateSubtotal();
  }

  function updateSubtotal() {
    const p = state.current;
    const q = parseFloat($("#pm-qty").value) || 0;
    const t = q * p.precio;
    $("#pm-subtotal").innerHTML = q > 0 ? `Subtotal: <strong style="color:var(--text)">${money(t)}</strong>${CFG.tasaBs ? " · " + bs(t) : ""}` : "";
  }

  function showModal(open) {
    modal.classList.toggle("open", open);
    modal.setAttribute("aria-hidden", !open);
    document.body.classList.toggle("lock", open || cartEl.classList.contains("open"));
    if (open) setTimeout(() => $(".modal__close", modal).focus(), 50);
  }

  function stepQty(input, dir) {
    const step = parseFloat(input.step) || 1;
    const min = parseFloat(input.min) || 1;
    const v = Math.max(min, Math.round(((parseFloat(input.value) || 0) + dir * step) * 100) / 100);
    input.value = v;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  /* ---------------- Carrito ---------------- */
  const cartEl = $("#cart");

  function addToCart(p, colorIdx, qty) {
    const color = p.colores[colorIdx].nombre;
    const key = p.id + "|" + color;
    const found = cart.find((i) => i.key === key);
    if (found) found.qty = Math.round((found.qty + qty) * 100) / 100;
    else cart.push({ key, id: p.id, color, hex: p.colores[colorIdx].hex, qty });
    save();
    renderCart();
    const btn = $("#open-cart");
    btn.classList.remove("bump"); void btn.offsetWidth; btn.classList.add("bump");
    toast(`${p.nombre} · ${color} agregado al carrito`);
  }

  function cartTotal() {
    return cart.reduce((s, i) => { const p = byId(i.id); return p ? s + p.precio * i.qty : s; }, 0);
  }

  function renderCart() {
    cart = cart.filter((i) => byId(i.id)); // descarta productos eliminados del catálogo
    const count = cart.length;
    const cc = $("#cart-count");
    cc.textContent = count;

    $("#cart-empty").hidden = count > 0;
    $("#cart-foot").hidden = count === 0;
    if (count === 0) showCheckout(false);

    $("#cart-list").innerHTML = cart.map((i) => {
      const p = byId(i.id), u = unitOf(p);
      const step = u === "m" ? 0.5 : 1, min = u === "m" ? CFG.minimoMetros : 1;
      return `
        <li class="cart-item" data-key="${esc(i.key)}">
          <div class="swatch swatch--sm" style="--c:${esc(i.hex)}"></div>
          <div>
            <h4>${esc(p.nombre)}</h4>
            <p>${esc(i.color)} · ${money(p.precio)}/${u}</p>
            <div class="qty">
              <button type="button" data-step="-1" aria-label="Menos">−</button>
              <input type="number" value="${i.qty}" step="${step}" min="${min}" inputmode="decimal" aria-label="Cantidad">
              <span class="qty__unit">${u}</span>
              <button type="button" data-step="1" aria-label="Más">+</button>
            </div>
          </div>
          <div class="cart-item__right">
            <strong>${money(p.precio * i.qty)}</strong>
            <button class="remove" data-remove>Quitar</button>
          </div>
        </li>`;
    }).join("");

    const total = cartTotal();
    $("#cart-subtotal").textContent = money(total);
    $("#cart-bs").textContent = CFG.tasaBs ? "Equivale a " + bs(total) : "";
    const free = CFG.envioGratisDesde;
    $("#cart-ship-note").textContent = !free ? "" :
      total >= free ? "✓ Tu pedido tiene envío nacional gratis" : `Te faltan ${money(free - total)} para envío nacional gratis`;
  }

  function showCart(open) {
    cartEl.classList.toggle("open", open);
    cartEl.setAttribute("aria-hidden", !open);
    document.body.classList.toggle("lock", open || modal.classList.contains("open"));
    if (!open) showCheckout(false);
  }

  function showCheckout(on) {
    $("#cart-step-items").hidden = on;
    $("#checkout").hidden = !on;
    $("#to-checkout").hidden = on;
    $("#send-order").hidden = !on;
    $("#cart-title").textContent = on ? "Datos de envío" : "Tu pedido";
    $("#form-error").hidden = true;
    $(".drawer__body").scrollTop = 0;
  }

  function renderCheckoutOptions() {
    $("#c-entrega").innerHTML = CFG.metodosEntrega.map((m) => `<option value="${esc(m.id)}">${esc(m.nombre)}</option>`).join("");
    $("#c-pagos").innerHTML = CFG.metodosPago.map((m, i) => `
      <label class="pay-opt"><input type="radio" name="pago" value="${esc(m.id)}"${i === 0 ? " checked" : ""}>
        <span><strong>${esc(m.nombre)}</strong><small>${esc(m.detalle)}</small></span></label>`).join("");
    const syncDir = () => { $("#c-dir-wrap").hidden = $("#c-entrega").value === "retiro"; };
    $("#c-entrega").addEventListener("change", syncDir);
    syncDir();
  }

  function sendOrder() {
    const f = $("#checkout");
    const required = ["#c-nombre", "#c-doc", "#c-tel", "#c-ciudad"];
    if ($("#c-entrega").value !== "retiro") required.push("#c-dir");
    let ok = true;
    $$("input, select", f).forEach((el) => el.classList.remove("invalid"));
    required.forEach((s) => { const el = $(s); if (!el.value.trim()) { el.classList.add("invalid"); ok = false; } });
    $("#form-error").hidden = ok;
    if (!ok) { $(".invalid", f)?.focus(); return; }

    const data = Object.fromEntries(new FormData(f).entries());
    const entrega = CFG.metodosEntrega.find((m) => m.id === data.entrega)?.nombre;
    const pago = CFG.metodosPago.find((m) => m.id === data.pago)?.nombre;
    const nro = "UDS-" + Date.now().toString(36).toUpperCase().slice(-6);
    const total = cartTotal();

    const lines = cart.map((i) => {
      const p = byId(i.id), u = unitOf(p);
      return `• ${p.nombre} — ${i.color}\n   ${i.qty} ${u} × ${money(p.precio)} = ${money(p.precio * i.qty)}`;
    });

    const msg = [
      `*NUEVO PEDIDO ${nro}*`,
      `Universal de Sintéticos Venezuela`,
      ``,
      ...lines,
      ``,
      `*Total: ${money(total)}*${CFG.tasaBs ? ` (${bs(total)})` : ""}`,
      ``,
      `*Cliente:* ${data.nombre}`,
      `*Cédula/RIF:* ${data.doc}`,
      `*Teléfono:* ${data.tel}`,
      `*Ciudad:* ${data.ciudad}`,
      `*Entrega:* ${entrega}${data.entrega !== "retiro" && data.dir ? " — " + data.dir : ""}`,
      `*Pago:* ${pago}`,
      data.notas ? `*Notas:* ${data.notas}` : ""
    ].filter((l, idx, arr) => !(l === "" && arr[idx - 1] === "")).join("\n").trim();

    window.open(waLink(msg), "_blank", "noopener");
    toast("¡Listo! Envía el mensaje en WhatsApp para confirmar tu pedido.");
    cart = []; save(); renderCart(); f.reset(); renderCheckoutOptions();
    setTimeout(() => showCart(false), 600);
  }

  /* ---------------- Toast ---------------- */
  let tt;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(tt);
    tt = setTimeout(() => t.classList.remove("show"), 2800);
  }

  /* ---------------- Eventos ---------------- */
  function bind() {
    $("#filters").addEventListener("click", (e) => {
      const b = e.target.closest("[data-cat]"); if (!b) return;
      state.cat = b.dataset.cat; renderFilters(); renderGrid();
    });
    let st;
    $("#search").addEventListener("input", (e) => { clearTimeout(st); st = setTimeout(() => { state.q = e.target.value; renderGrid(); }, 120); });
    $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; renderGrid(); });

    $("#product-grid").addEventListener("click", (e) => {
      const card = e.target.closest(".card"); if (!card) return;
      const p = byId(card.dataset.id);
      const dot = e.target.closest("[data-dot]");
      if (dot) {
        const idx = +dot.dataset.dot;
        $$(".dot", card).forEach((d) => d.classList.toggle("active", d === dot));
        if (!p.imagen) $(".card__media .swatch", card).style.setProperty("--c", p.colores[idx].hex);
        card.dataset.color = idx;
        return;
      }
      if (e.target.closest("[data-open]")) openProduct(p.id, +(card.dataset.color || 0));
    });

    document.addEventListener("click", (e) => {
      const s = e.target.closest("[data-sector]");
      if (s) {
        e.preventDefault();
        state.cat = s.dataset.sector; state.q = ""; $("#search").value = "";
        renderFilters(); renderGrid();
        $("#catalogo").scrollIntoView({ behavior: "smooth" });
      }
      const dp = e.target.closest("[data-product]");
      if (dp) openProduct(dp.dataset.product, +(dp.dataset.color || 0));
    });

    // Modal
    modal.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) showModal(false); });
    $("#pm-colors").addEventListener("click", (e) => {
      const b = e.target.closest("[data-color]"); if (!b) return;
      state.color = +b.dataset.color; paintColor();
    });
    $("#pm-minus").addEventListener("click", () => stepQty($("#pm-qty"), -1));
    $("#pm-plus").addEventListener("click", () => stepQty($("#pm-qty"), 1));
    $("#pm-qty").addEventListener("input", updateSubtotal);
    $("#pm-add").addEventListener("click", () => {
      const q = parseFloat($("#pm-qty").value);
      const min = parseFloat($("#pm-qty").min) || 1;
      if (!(q >= min)) { toast(`La cantidad mínima es ${min}`); return; }
      addToCart(state.current, state.color, q);
      showModal(false);
    });

    // Carrito
    $("#open-cart").addEventListener("click", () => showCart(true));
    cartEl.addEventListener("click", (e) => { if (e.target.closest("[data-close-cart]")) showCart(false); });
    $("#cart-list").addEventListener("click", (e) => {
      const li = e.target.closest(".cart-item"); if (!li) return;
      const item = cart.find((i) => i.key === li.dataset.key);
      if (e.target.closest("[data-remove]")) { cart = cart.filter((i) => i !== item); save(); renderCart(); return; }
      const sb = e.target.closest("[data-step]");
      if (sb) stepQty($("input", li), +sb.dataset.step);
    });
    $("#cart-list").addEventListener("change", (e) => {
      if (e.target.matches("input")) {
        const li = e.target.closest(".cart-item");
        const item = cart.find((i) => i.key === li.dataset.key);
        const min = parseFloat(e.target.min) || 1;
        item.qty = Math.max(min, parseFloat(e.target.value) || min);
        save(); renderCart();
      }
    });
    $("#cart-list").addEventListener("input", (e) => {
      // los botones +/- disparan "input"; se confirma al instante
      if (e.target.matches("input") && e.isTrusted === false) e.target.dispatchEvent(new Event("change", { bubbles: true }));
    });
    $("#to-checkout").addEventListener("click", () => { showCheckout(true); setTimeout(() => $("#c-nombre").focus(), 50); });
    $("#back-to-cart").addEventListener("click", () => showCheckout(false));
    $("#send-order").addEventListener("click", sendOrder);
    $("#checkout").addEventListener("input", (e) => e.target.classList.remove("invalid"));
    $("#checkout").addEventListener("submit", (e) => { e.preventDefault(); sendOrder(); });

    // Teclado
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (modal.classList.contains("open")) showModal(false);
      else if (cartEl.classList.contains("open")) showCart(false);
    });

    // Nav
    const nav = $("#nav");
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    $("#menu-btn").addEventListener("click", () => $("#nav-links").classList.toggle("open"));
    $("#nav-links").addEventListener("click", (e) => { if (e.target.closest("a")) $("#nav-links").classList.remove("open"); });

    // Animación de entrada
    const io = "IntersectionObserver" in window ? new IntersectionObserver((ents) => {
      ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: .15 }) : null;
    $$(".reveal").forEach((el, i) => { el.style.transitionDelay = i * 80 + "ms"; io ? io.observe(el) : el.classList.add("in"); });
  }

  /* ---------------- Arranque ---------------- */
  renderFilters();
  renderGrid();
  renderStatic();
  renderCheckoutOptions();
  renderCart();
  bind();

  // Permite abrir un producto directo con un enlace: index.html#p=vertice-pu
  const m = location.hash.match(/^#p=([\w-]+)/);
  if (m) openProduct(m[1]);
})();

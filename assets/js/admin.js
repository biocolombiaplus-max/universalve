/* Panel de productos: edita el catálogo y genera un nuevo productos.js */
(function () {
  "use strict";
  const KEY = "uds_admin_draft_v1";
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const CATS = window.CATEGORIAS;

  let list;
  try { list = JSON.parse(localStorage.getItem(KEY)); } catch { list = null; }
  if (!Array.isArray(list)) list = structuredClone(window.PRODUCTOS);
  let currentId = null;

  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {} };
  const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const form = $("#form");

  $("#f-cat").innerHTML = Object.entries(CATS).map(([k, v]) => `<option value="${k}">${esc(v.nombre)}</option>`).join("");

  function renderList() {
    $("#count").textContent = `${list.length} productos`;
    $("#plist").innerHTML = list.map((p) => `
      <li><button data-id="${esc(p.id)}" class="${p.id === currentId ? "active" : ""}">
        <span class="swatch swatch--sm tex-${esc(p.textura || "grano")}" style="--c:${esc(p.colores?.[0]?.hex || "#555")}"></span>
        <span><strong>${esc(p.nombre)}</strong><small>${esc(CATS[p.categoria]?.nombre || p.categoria)} · $${p.precio}</small></span>
      </button></li>`).join("");
  }

  function colorRow(c = { nombre: "", hex: "#6b4a32" }) {
    const d = document.createElement("div");
    d.className = "crow field";
    d.innerHTML = `<input type="color" value="${esc(c.hex)}"><input placeholder="Nombre del color" value="${esc(c.nombre)}"><button type="button" class="icon-btn" aria-label="Quitar color"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>`;
    $("button", d).onclick = () => d.remove();
    $("#colors").appendChild(d);
  }

  function fill(p) {
    currentId = p ? p.id : null;
    form.reset();
    $("#colors").innerHTML = "";
    $("#err").hidden = true;
    $("#del").hidden = !p;
    if (p) {
      for (const [k, v] of Object.entries(p)) {
        const el = form.elements[k];
        if (!el || k === "colores") continue;
        if (el.type === "checkbox") el.checked = k === "stock" ? v !== false : !!v;
        else el.value = Array.isArray(v) ? v.join(", ") : v ?? "";
      }
      if (!("stock" in p)) form.elements.stock.checked = true;
      (p.colores || []).forEach(colorRow);
    } else colorRow();
    renderList();
  }

  form.elements.nombre.addEventListener("input", (e) => { if (!currentId) form.elements.id.value = slug(e.target.value); });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = form.elements;
    const colores = [...$("#colors").querySelectorAll(".crow")].map((r) => {
      const [hex, nombre] = r.querySelectorAll("input");
      return { nombre: nombre.value.trim(), hex: hex.value };
    }).filter((c) => c.nombre);
    const id = slug(f.id.value || f.nombre.value);
    const errs = [];
    if (!f.nombre.value.trim()) errs.push("nombre");
    if (!id) errs.push("ID");
    if (!(parseFloat(f.precio.value) >= 0) || f.precio.value === "") errs.push("precio");
    if (!colores.length) errs.push("al menos un color con nombre");
    if (list.some((p) => p.id === id && p.id !== currentId)) errs.push("un ID que no esté repetido");
    if (errs.length) { $("#err").textContent = "Falta: " + errs.join(", ") + "."; $("#err").hidden = false; return; }

    const split = (s) => s.split(",").map((x) => x.trim()).filter(Boolean);
    const p = {
      id, ...(f.ref.value.trim() ? { ref: f.ref.value.trim() } : {}), textura: f.textura.value, nombre: f.nombre.value.trim(), linea: f.linea.value.trim(), categoria: f.categoria.value,
      precio: +(+f.precio.value).toFixed(2),
      ...(f.precioAntes.value ? { precioAntes: +(+f.precioAntes.value).toFixed(2) } : {}),
      ancho: f.ancho.value.trim(), composicion: f.composicion.value.trim(), espesor: f.espesor.value.trim(),
      descripcion: f.descripcion.value.trim(), usos: split(f.usos.value), atributos: split(f.atributos.value),
      colores,
      ...(f.imagen.value.trim() ? { imagen: f.imagen.value.trim() } : {}),
      ...(f.unidad.value ? { unidad: f.unidad.value } : {}),
      ...(f.destacado.checked ? { destacado: true } : {}),
      ...(f.nuevo.checked ? { nuevo: true } : {}),
      stock: f.stock.checked
    };
    const idx = list.findIndex((x) => x.id === currentId);
    if (idx >= 0) list[idx] = p; else list.push(p);
    persist(); fill(p); toast("Producto guardado en el borrador");
  });

  $("#del").onclick = () => {
    if (!currentId || !confirm("¿Eliminar este producto del catálogo?")) return;
    list = list.filter((p) => p.id !== currentId); persist(); fill(null); toast("Producto eliminado");
  };
  $("#new").onclick = () => { fill(null); form.elements.nombre.focus(); };
  $("#add-color").onclick = () => colorRow();
  $("#plist").onclick = (e) => { const b = e.target.closest("[data-id]"); if (b) fill(list.find((p) => p.id === b.dataset.id)); };
  $("#reset").onclick = () => {
    if (!confirm("Se perderán los cambios no descargados. ¿Continuar?")) return;
    try { localStorage.removeItem(KEY); } catch {}
    list = structuredClone(window.PRODUCTOS); fill(list[0]);
  };

  $("#download").onclick = () => {
    const cats = JSON.stringify(window.CATEGORIAS, null, 2);
    const body = `/* CATÁLOGO — Universal de Sintéticos Venezuela
   Generado desde admin.html el ${new Date().toLocaleString("es-VE")}.
   Reemplaza assets/js/productos.js con este archivo. */

window.CATEGORIAS = ${cats};

window.PRODUCTOS = ${JSON.stringify(list, null, 2)};
`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([body], { type: "text/javascript" }));
    a.download = "productos.js";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast("Archivo descargado. Súbelo a assets/js/");
  };

  let tt;
  function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2400); }

  fill(list[0]);
})();

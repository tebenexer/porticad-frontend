/* PortiCAD · analítica compartida de las herramientas (https://porticad.app/analytics.js)
   - Google Analytics (ID G-YD846TF3G6) se carga SOLO si la persona lo acepta en el aviso.
   - Usa la misma clave de consentimiento que el editor (index.html): la decisión vale para todo porticad.app.
   - Cada herramienta se distingue en los informes por su título y su ruta; no se envía nada más.
   Para añadirlo a una herramienta nueva: <script src="/analytics.js" defer></script> antes de </head>. */
(function () {
  'use strict';
  if (window.__porticadAnalytics) return;
  window.__porticadAnalytics = true;

  var GA_ID = 'G-YD846TF3G6';
  var KEY = 'porticad_cookie_consent';

  function leer() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function guardar(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function () { window.dataLayer.push(arguments); };
  }

  function cargarGA() {
    if (window.__gaCargado) return;
    window.__gaCargado = true;
    var sc = document.createElement('script');
    sc.async = true;
    sc.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(sc);
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
  }

  function cerrarAviso() {
    var b = document.getElementById('cookie-banner');
    if (b) b.style.display = 'none';
  }

  function aceptar() { guardar('aceptado'); cerrarAviso(); cargarGA(); }
  function rechazar() {
    guardar('rechazado'); cerrarAviso();
    window['ga-disable-' + GA_ID] = true; // por si ya se había cargado
  }

  function crearAviso() {
    if (document.getElementById('cookie-banner')) return;
    var b = document.createElement('div');
    b.id = 'cookie-banner';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Aviso de cookies y analítica');
    b.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:100000;max-width:560px;margin:0 auto;' +
      'background:#161b22;color:#e6edf3;border:1px solid #30363d;border-radius:10px;padding:14px 16px;' +
      'box-shadow:0 8px 32px rgba(0,0,0,.6);display:flex;flex-wrap:wrap;gap:10px 14px;align-items:center;' +
      'font:13px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;';

    var txt = document.createElement('div');
    txt.style.cssText = 'flex:1 1 260px;min-width:0;';
    txt.appendChild(document.createTextNode('Usamos Google Analytics para saber cuántas personas usan cada herramienta, solo si lo aceptas. Más detalles en la '));
    var a = document.createElement('a');
    a.href = '/legal/privacidad/';
    a.target = '_blank';
    a.rel = 'noopener';
    a.style.color = '#58a6ff';
    a.textContent = 'política de privacidad';
    txt.appendChild(a);
    txt.appendChild(document.createTextNode('.'));

    var fila = document.createElement('div');
    fila.style.cssText = 'display:flex;gap:8px;';

    var no = document.createElement('button');
    no.type = 'button';
    no.textContent = 'Rechazar';
    no.style.cssText = 'padding:7px 12px;border-radius:6px;border:1px solid #30363d;background:transparent;color:#e6edf3;font:inherit;cursor:pointer;';
    no.addEventListener('click', rechazar);

    var si = document.createElement('button');
    si.type = 'button';
    si.textContent = 'Aceptar';
    si.style.cssText = 'padding:7px 12px;border-radius:6px;border:none;background:#22c55e;color:#000;font:inherit;font-weight:700;cursor:pointer;';
    si.addEventListener('click', aceptar);

    fila.appendChild(no);
    fila.appendChild(si);
    b.appendChild(txt);
    b.appendChild(fila);
    document.body.appendChild(b);
  }

  var estado = leer();
  if (estado === 'aceptado') {
    cargarGA();
  } else if (estado === null) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', crearAviso);
    } else {
      crearAviso();
    }
  }
})();

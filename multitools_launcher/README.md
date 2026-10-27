# Multi-Tools launcher (multitools.porticad.app)

Página de botones grandes que redirige a cada herramienta de https://porticad.app.
No modifica porticad.app: el panel Multi-Tools de allí sigue igual.

## Añadir o cambiar una herramienta
1. Edita `MT_CATEGORIES` en `../index.html` (como siempre).
2. Ejecuta `node build_tools.js` dentro de esta carpeta: regenera `tools.json`.
   Las herramientas y renombres que son solo del lanzador (p. ej. «PortiCAD 2D» y el nombre
   «Análisis Estructural») viven en `launcher_extras.json` y se aplican en cada regeneración.
3. Commit y push a `main`.

## Railway
- New service → Deploy from GitHub repo `tebenexer/porticad-frontend`.
- Settings → Source → **Root Directory**: `multitools_launcher` (usa `npm start`).
- Settings → Networking → Custom Domain: `multitools.porticad.app`; Railway muestra el
  registro CNAME que hay que crear en el DNS de porticad.app.
- Health check opcional: `/health`.

## Legal y seguridad
- Páginas propias del lanzador: `/legal/terminos/`, `/legal/privacidad/`, `/legal/derechos-de-autor/`
  (enlazadas en el pie). Si cambias algo que afecte datos (analítica, cookies, nuevos servicios),
  actualiza la página de privacidad y su fecha.
- `server.js` solo sirve una lista cerrada de archivos y añade CSP, `frame-ancestors 'none'`,
  HSTS y demás cabeceras. Si añades un archivo nuevo al sitio, agrégalo a `FILES` en `server.js`.
- `.well-known/security.txt` (RFC 9116) tiene fecha de expiración: renovar antes del 2027-10-27.
- El lanzador solo muestra enlaces `https://porticad.app/...`; cualquier otro se ignora.

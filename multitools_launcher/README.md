# Multi-Tools launcher (multitools.porticad.app)

Página de botones grandes que redirige a cada herramienta de https://porticad.app.
No modifica porticad.app: el panel Multi-Tools de allí sigue igual.

## Añadir o cambiar una herramienta
1. Edita `MT_CATEGORIES` en `../index.html` (como siempre).
2. Ejecuta `node build_tools.js` dentro de esta carpeta: regenera `tools.json`.
3. Commit y push a `main`.

## Railway
- New service → Deploy from GitHub repo `tebenexer/porticad-frontend`.
- Settings → Source → **Root Directory**: `multitools_launcher` (usa `npm start`).
- Settings → Networking → Custom Domain: `multitools.porticad.app`; Railway muestra el
  registro CNAME que hay que crear en el DNS de porticad.app.
- Health check opcional: `/health`.

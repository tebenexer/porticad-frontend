// Genera tools.json a partir de MT_CATEGORIES en ../index.html (fuente única).
// Además aplica launcher_extras.json (renombres de categoría y herramientas solo del lanzador).
// Uso: node build_tools.js   (ejecutar cada vez que se añada/cambie una herramienta en porticad.app)
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const start = html.indexOf('const MT_CATEGORIES = [');
if (start < 0) throw new Error('No se encontró MT_CATEGORIES en index.html');
const end = html.indexOf('\n];', start);
const src = html.slice(start, end + 3).replace('const MT_CATEGORIES =', 'return');
const cats = new Function(src)();
const ORIGIN = 'https://porticad.app';
const out = cats.map(c => ({
  id: c.id, name: c.name, color: c.color, icon: c.icon,
  tools: c.tools.map(t => ({
    name: t.name, desc: t.desc, color: t.color, icon: t.icon,
    href: ORIGIN + (t.href.startsWith('/') ? t.href : '/' + t.href)
  }))
}));
const extras = JSON.parse(fs.readFileSync(path.join(__dirname, 'launcher_extras.json'), 'utf8'));
out.forEach(c => {
  if (extras.categoryNames && extras.categoryNames[c.id]) c.name = extras.categoryNames[c.id];
  const add = extras.prepend && extras.prepend[c.id];
  if (add) c.tools = add.concat(c.tools.filter(t => !add.some(a => a.href === t.href)));
});
fs.writeFileSync(path.join(__dirname, 'tools.json'), JSON.stringify(out, null, 1) + '\n');
console.log(out.length + ' categorías, ' + out.reduce((n, c) => n + c.tools.length, 0) + ' herramientas');

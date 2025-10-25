import { mkdirSync, readFileSync, writeFileSync, copyFileSync, existsSync } from 'fs';
import { cpSync } from 'fs';
import { dirname, join } from 'path';

const root = new URL('..', import.meta.url).pathname;
const dist = join(root, 'dist');

function ensureDir(p) {
    if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

ensureDir(dist);

// Copy assets from src/assets (icons, css, html)
const assetsSrc = join(root, 'src', 'assets');
if (existsSync(assetsSrc)) {
    cpSync(assetsSrc, dist, { recursive: true });
}

// Copy ready-to-publish manifest for dist
const manifestDistSrc = readFileSync(join(root, 'src', 'manifest.json'), 'utf8');
writeFileSync(join(dist, 'manifest.json'), manifestDistSrc);

// Copy popup.html for dist
const popupSrc = readFileSync(join(root, 'src', 'templates', 'popup.html'), 'utf8');
const popupDist = popupSrc.replace(/dist\/popup\.js/g, 'popup.js');
writeFileSync(join(dist, 'popup.html'), popupDist);

// Copy options.html for dist
const optionsSrc = readFileSync(join(root, 'src', 'templates', 'options.html'), 'utf8');
const optionsDist = optionsSrc.replace(/dist\/options\.js/g, 'options.js');
writeFileSync(join(dist, 'options.html'), optionsDist);



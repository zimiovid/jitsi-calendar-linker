import esbuild from 'esbuild';
import inlineImport from 'esbuild-plugin-inline-import';

await esbuild.build({
    entryPoints: ['src/main.ts', 'src/popup.ts', 'src/options.ts'],
    bundle: true,
    outdir: 'dist',
    format: 'iife',
    target: 'es2018',
    plugins: [inlineImport({ filter: /\.html$/ })],
    alias: {
        '@': 'src',
        '@calendar': 'src/calendar',
        '@templates': 'src/templates'
    }
});



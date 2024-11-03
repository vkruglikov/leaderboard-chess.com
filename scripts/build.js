const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const minify = require('html-minifier').minify;
const data = require('../api-chess-com-pub-leaderboards.json');

function loadLocales(localesPath) {
    const locales = {};

    fs.readdirSync(localesPath).forEach((file) => {
        const localeCode = path.parse(file).name;
        const filePath = path.join(localesPath, file);

        locales[localeCode] = require(filePath);
    });

    return locales;
}
const locals = loadLocales(path.join(__dirname, '../locales'));

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            if (path.extname(entry.name) === '.css') {
                const cssContent = fs.readFileSync(srcPath, 'utf8');
                const minifiedCss = minify(cssContent, {
                    minifyCSS: true,
                    collapseWhitespace: true,
                });
                fs.writeFileSync(destPath, minifiedCss, 'utf8');
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }
}

copyDir(path.join(__dirname, '../public'), path.join(__dirname, '../build'));

Object.keys(locals).forEach((localeCode) => {
    ejs.renderFile(path.join(__dirname, '../views', 'index.ejs'), { locale: locals[localeCode], data, buildTime: Date.now() }, (err, html) => {
        if (err) throw err;

        const pathPrefix = localeCode === 'en' ? '' : `/${localeCode}`;
        const outputPath = path.join(__dirname, `../build${pathPrefix}`);

        fs.mkdir(outputPath, { recursive: true }, (err) => {
            if (err) throw err;

            fs.writeFile(
                path.join(outputPath, 'index.html'),
                minify(html, {
                    collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    removeEmptyAttributes: true,
                    minifyCSS: true,
                    minifyJS: true,
                }),
                { flag: 'w' },
                (err) => {
                    if (err) throw err;
                }
            );
        });
    });
})


ejs.renderFile(path.join(__dirname, '../views', '404.ejs'), { locale: locals.en, data, buildTime: Date.now() }, (err, html) => {
    if (err) throw err;

    fs.writeFile(path.join(__dirname, '../build', '404.html'), minify(html, {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeEmptyAttributes: true,
        minifyCSS: true,
        minifyJS: true,
    }), { flag: 'w' }, (err) => {
        if (err) throw err;
    });
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
    <url>
        <loc>https://www.leaderboard-chess.com/</loc>
        ${Object.keys(locals).map((code) => {
            if (code === 'en') {
                return '';
            }
            return `<xhtml:link rel="alternate" hreflang="${code}" href="https://www.leaderboard-chess.com/${code}/" />`;
        }).join('\n')}
    </url>
</urlset>`;

fs.writeFile(path.join(__dirname, '../build', 'sitemap.xml'), sitemap, { flag: 'w' }, (err) => {
    if (err) throw err;
});
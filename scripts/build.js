const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const minify = require('html-minifier').minify;
const data = require('../api-chess-com-pub-leaderboards.json');

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

ejs.renderFile(path.join(__dirname, '../views', 'index.ejs'), { data, buildTime: Date.now() }, (err, html) => {
    if (err) throw err;

    fs.writeFile(path.join(__dirname, '../build', 'index.html'), minify(html, {
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

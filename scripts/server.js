const express = require('express');
const path = require('path');
const data = require('../api-chess-com-pub-leaderboards.json');
const loadLocales = require('./tools/index').loadLocales;

const app = express();
const locals = loadLocales(path.join(__dirname, '../locales'));

app.set('views', path.join(__dirname, '../views'));

app.set('view engine', 'ejs');
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index', { locale: locals.en, locales: Object.values(locals),  data, buildTime: Date.now() });
});

Object.entries(locals).forEach(([code, locale]) => {
    app.get(`/${code}`, (req, res) => {
        res.render('index', { locale, data,  locales: Object.values(locals), buildTime: Date.now() });
    });
})

app.get('*', (req, res) => {
    res.render('404', { data, buildTime: Date.now() });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server started http://localhost:${PORT}`);
});


process.on('SIGTERM', () => {
    process.exit(0);
});

process.on('SIGINT', () => {
    process.exit(0);
});
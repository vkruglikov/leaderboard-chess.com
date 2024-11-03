const express = require('express');
const path = require('path');
const data = require('../api-chess-com-pub-leaderboards.json');

const app = express();
const locals = {
    en: require(path.join(__dirname, '../locales/en.json')),
    ru: require(path.join(__dirname, '../locales/ru.json')),
};

app.set('views', path.join(__dirname, '../views'));

app.set('view engine', 'ejs');
app.use(express.static('public'))


app.get('/', (req, res) => {
    res.render('index', { locale: locals.en, data, buildTime: Date.now() });
});
app.get('/ru', (req, res) => {
    res.render('index', { locale: locals.ru, data, buildTime: Date.now() });
});

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
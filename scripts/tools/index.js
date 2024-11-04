const fs = require('fs');
const path = require('path');

function loadLocales(localesPath) {
    const locales = {};

    fs.readdirSync(localesPath).forEach((file) => {
        const localeCode = path.parse(file).name;
        const filePath = path.join(localesPath, file);

        locales[localeCode] = require(filePath);
    });

    return locales;
}

module.exports = {
    loadLocales
};
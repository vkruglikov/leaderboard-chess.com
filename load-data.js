const fs = require('fs');

fetch('https://api.chess.com/pub/leaderboards')
    .then((response) => response.json())
    .then((data) => {
        fs.writeFile('api-chess-com-pub-leaderboards.json', JSON.stringify(data, null, 2), (err) => {
            if (err) throw err;
        });
    });
const fs = require('fs');

async function loadUser(name) {
    const [stats, info] = await Promise.all([
        (await fetch(`https://api.chess.com/pub/player/${name}/stats`)).json(),
        (await fetch(`https://api.chess.com/pub/player/${name}`)).json()
    ])

    return { stats, info }
}

function sort(arr) {
    return [...arr].sort((a, b) => b.score - a.score).map((item, index) => ({
        ...item,
        rank: index + 1
    }))
}

(async function() {
    const data = await (await fetch('https://api.chess.com/pub/leaderboards')).json();
    const user = await loadUser('saveliy_golubov');

    const newData = {
        live_blitz: sort([
            {
                ...user.info,
                score: user.stats.chess_blitz ? user.stats.chess_blitz.last.rating : 0,
            },
            ...data.live_blitz,
        ]),
        live_rapid: sort([
            {
                ...user.info,
                score: user.stats.chess_rapid ? user.stats.chess_rapid.last.rating : 0,
            },
            ...data.live_rapid
        ]),
        live_bullet: sort([
            {
                ...user.info,
                score: user.stats.chess_bullet ? user.stats.chess_bullet.last.rating : 0,
            },
            ...data.live_bullet
        ]),
    };

    await (new Promise((resolve, reject) => {
        fs.writeFile('api-chess-com-pub-leaderboards.json', JSON.stringify(newData, null, 2), (err) => {
            if (err) return reject(err);
            resolve();
        })
    }));
})();
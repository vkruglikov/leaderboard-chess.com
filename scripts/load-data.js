const fs = require('fs');
const csv = require('csv-parser')


function getPlayers() {
    const results = [];
    return new Promise((resolve) => {
        fs.createReadStream('players.csv')
            .pipe(csv({
                separator: ';',
            }))
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results);
            });
    })
}

async function loadUser(name) {
    try {
        const [stats, info] = await Promise.allSettled([
            (await fetch(`https://api.chess.com/pub/player/${name}/stats`)).json(),
            (await fetch(`https://api.chess.com/pub/player/${name}`)).json()
        ])

        if (!stats.value || !info.value) {
            throw new Error('Failed to load user data');
        }

        if (info.value.code === 0 || stats.value.code === 0) {
            throw new Error('User not found');
        }
        return { stats: stats.value, info: info.value }
    } catch (e) {
        return null;
    }
}

function sort(arr) {
    return [...arr].sort((a, b) => b.score - a.score).map((item, index) => ({
        ...item,
        rank: index + 1
    }))
}

(async function() {
    const players = (await Promise.all((await getPlayers()).map(({username}) => loadUser(username)))).filter(Boolean);
    const data = await (await fetch('https://api.chess.com/pub/leaderboards')).json();

console.log(players);

    const unsortedData = players.reduce((acc, user) => {
        if (user.stats.chess_blitz) {
            acc.live_blitz.push({
                ...user.info,
                score: user.stats.chess_blitz.last.rating,
            })
        }
        if (user.stats.chess_rapid) {
            acc.live_rapid.push({
                ...user.info,
                score: user.stats.chess_rapid.last.rating,
            })
        }
        if (user.stats.chess_bullet) {
            acc.live_bullet.push({
                ...user.info,
                score: user.stats.chess_bullet.last.rating,
            })
        }
        return acc;
    }, {
        live_blitz: data.live_blitz,
        live_rapid: data.live_rapid,
        live_bullet: data.live_bullet,
    })

    const newData = Object.entries(unsortedData).reduce((acc, [key, value]) => {
        acc[key] = sort(value);
        return acc;
    }, {});

    await (new Promise((resolve, reject) => {
        fs.writeFile('api-chess-com-pub-leaderboards.json', JSON.stringify(newData, null, 2), (err) => {
            if (err) return reject(err);
            resolve();
        })
    }));
})();
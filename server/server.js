const bodyParser = require('body-parser');
const connection = require('./database');
const NodeCache = require("node-cache");
const express = require('express');
const https = require('https');
const path = require('path');
const url = require('url');
const app = express();
const port = 8000;

const Cache = new NodeCache({ stdTTL: 3600 });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));

require('dotenv').config();

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());

app.listen(port);

const request = (options) => {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (response) => {
            let data = '';
            response.on('data', chunk => data += chunk);
            response.on('end', () => resolve(data));
        });

        req.on('error', error => reject(error));
        if (options.method === 'POST') req.write(options.payload);
        req.end();
    })
};

/******************** API Endpoints ********************/

app.get('/getUser', (req, res) => {
    const access_token = req.query.access_token;

    if (!access_token) {
        return res.status(400).json({ Error: "No access token or refresh token was provided." });
    }

    let options = {
        hostname: 'api.spotify.com',
        path: '/v1/me',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    };

    request(options)
        .then(user => {
            user = JSON.parse(user);
            if (user.error && (user.error.message === 'Invalid access token' || user.error.message === 'The access token expired')) {
                return res.json({
                    redirect: true,
                    URL: `https://accounts.spotify.com/authorize?response_type=token&client_id=${process.env.CLIENT_ID}&scope=user-library-read%20user-read-email&redirect_uri=http://192.168.0.152:3000/dashboard&state=123`
                });
            } else {
                let cached_user = Cache.get(user.id);

                if (cached_user !== undefined) {
                    res.json(cached_user);
                } else {
                    connection.query(`SELECT * FROM Users WHERE Username = '${user.id}'`, (err, result) => {
                        if (err) throw err;
                        if (result.length === 0) {

                            function getSongs(URL) {
                                const nextURL = url.parse(URL);

                                options = {
                                    hostname: 'api.spotify.com',
                                    path: nextURL.path,
                                    method: 'GET',
                                    headers: {
                                        'Authorization': `Bearer ${access_token}`,
                                    }
                                };

                                return new Promise((resolve, reject) => {
                                    request(options)
                                        .then(data => {
                                            data = JSON.parse(data);

                                            data.items.forEach(song => {
                                                songs.push({ Name: song.track.name, Artists: song.track.artists, Images: song.track.album.images });
                                            });

                                            resolve(data.next ? getSongs(data.next) : '');
                                        })
                                        .catch(error => reject(error));
                                });
                            }

                            let songs = [];
                            getSongs('https://api.spotify.com/v1/me/tracks?limit=50').then(() => {
                                user.songs = songs;
                                Cache.set(user.id, user);
                                res.json(user);
                            }).catch(error => res.json(error));
                        } else {
                            user.songs = result[0].Songs;
                            user.updated = result[0].Updated;
                            res.json(user);
                        }
                    });
                }
            }
        })
        .catch(error => res.json(error));

});

app.post('/storeSongs', (req, res) => {
    const user = req.body.user;

    if (!user) {
        return res.status(400).json({ Error: "No user account was provided." });
    }

    Cache.del(user.display_name);
    const song_string = JSON.stringify(user.songs);

    connection.query(`INSERT INTO Users (Username, Songs, Updated) VALUES ("${user.display_name}", ${JSON.stringify(song_string)}, NOW()) ON DUPLICATE KEY UPDATE Songs = ${JSON.stringify(song_string)}, Updated = NOW();`, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});
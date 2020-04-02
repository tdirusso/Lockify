const bodyParser = require('body-parser');
const connection = require('./database');
const express = require('express');
const https = require('https');
const path = require('path');
const url = require('url');
const app = express();

const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));

require('dotenv').config();

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());

app.listen(port);

const auth_protocol = 'https';
const auth_domain = 'accounts.spotify.com/authorize';
const auth_response_type = 'token';
const auth_client_id = process.env.REACT_APP_CLIENT_ID;
const auth_scope = encodeURIComponent('user-library-read user-read-email');
const auth_redirect_uri = 'http://192.168.0.152:3000/dashboard';
const authorize_url = `${auth_protocol}://${auth_domain}?response_type=${auth_response_type}&client_id=${auth_client_id}&scope=${auth_scope}&redirect_uri=${auth_redirect_uri}&state=123`;

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
        return res.status(400).json({ Error: "No access token was provided." });
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
                    URL: authorize_url
                });
            } else {
                connection.query(`SELECT * FROM Users WHERE Username = ?`, [user.id], (err, result) => {
                    if (err) throw err;
                    if (result.length) {
                        user.updated = result[0].Updated;
                    }
                    res.json(user);
                });

            }
        })
        .catch(error => res.json(error));
});

app.post('/storeSongs', (req, res) => {
    const user = req.body.user;
    const access_token = req.body.token;

    if (!user) {
        return res.status(400).json({ Error: "No user account was provided." });
    }

    if (!access_token) {
        return res.status(400).json({ Error: "No access token was provided." });
    }

    let songs = [];

    getSongs('https://api.spotify.com/v1/me/tracks?limit=50').then(() => {
        const song_string = JSON.stringify(songs);

        connection.query(`INSERT INTO Users (Username, Songs, Updated) VALUES (?,?, NOW()) ON DUPLICATE KEY UPDATE Songs = ?, Updated = NOW();`, [user.display_name, song_string, song_string], (err) => {
            if (err) throw err;
            res.end();
        });
    }).catch(error => res.json(error));

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
                        songs.push({ Name: song.track.name, Artist: song.track.artists[0], Image: song.track.album.images[0], URL: song.track.external_urls.spotify });
                    });

                    resolve(data.next ? getSongs(data.next) : '');
                })
                .catch(error => reject(error));
        });
    }
});

app.post('/deletedSongs', (req, res) => {
    const access_token = req.body.access_token;

    if (!access_token) {
        return res.status(400).json({ Error: "No access token was provided." });
    }

    let user = req.body.user;

    if (!user) {
        return res.status(400).json({ Error: "No user account was provided." });
    }

    connection.query(`SELECT * FROM Users WHERE Username = ?`, [user.display_name], (err, result) => {
        if (err) throw err;

        function getSongs(URL) {
            const nextURL = url.parse(URL);

            let options = {
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
                            songs.push(song.track.name);
                        });

                        resolve(data.next ? getSongs(data.next) : '');
                    })
                    .catch(error => reject(error));
            });
        }

        let songs = [];
        getSongs('https://api.spotify.com/v1/me/tracks?limit=50').then(() => {
            let stored_songs = JSON.parse(result[0].Songs);

            deleted_songs = stored_songs.filter(function (song) {
                return !songs.includes(song.Name);
            });

            res.json(JSON.stringify(deleted_songs));
        }).catch(error => res.json(error));
    });
});

app.post('/deleteAccount', (req, res) => {
    const user = req.body.user;

    if (!user) {
        return res.status(400).json({ Error: "No user account was provided." });
    }

    connection.query(`DELETE FROM Users WHERE Username = ?`, [user.display_name], (err) => {
        if (err) throw err;
        res.end();
    });
});
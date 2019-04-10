const express = require('express');
const qs = require('querystring');
const https = require('https');
const path = require('path');
const app = express();
const port = 8000;

require('dotenv').config();

app.use(express.static(path.join(__dirname, 'build')));

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

/* Retreives and returns a Spotify access token given a valid access code */
app.get('/token', function (req, res) {
    const code = req.query.code;

    if (!code) {
        res.status(400).json({ Error: "No access code was provided." });
    }

    const options = {
        hostname: 'accounts.spotify.com',
        path: '/api/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        payload: qs.stringify({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: 'http://localhost:3000/dashboard',
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        })
    };

    return request(options)
        .then(data => res.json(data))
        .catch(error => res.json(error));
});

/* Retreives and returns Spotify tracks for the current user given a valid access token */
app.get('/tracks', function (req, res) {
    const token = req.query.token;

    if (!token) {
        return res.status(400).json({ Error: "No access token was provided." });
    }

    const options = {
        hostname: 'api.spotify.com',
        path: '/v1/me/tracks',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    };

    return request(options)
        .then(data => res.json(data))
        .catch(error => res.json(error))
});
const express = require('express');
const https = require('https');
const path = require('path');
const app = express();
const port = 8000;

app.use(express.static(path.join(__dirname, 'build')));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.get('/', function (req, res) {
    res.json({ test: 'test' });
});




const options = {
    hostname: 'jsonplaceholder.typicode.com',
    path: '/todos/1',
    method: 'GET'
};



const request = (options) => {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (response) => {
            let data = '';
            response.on('data', chunk => data += chunk);
            response.on('end', () => resolve(data));
        });

        req.on('error', error => reject(error));
        if (options.method === 'POST') req.write(payload);
        req.end();
    })
};

request(options).then((data) => {
    console.log(data);
});
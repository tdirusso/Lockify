const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;

require('dotenv').config();

app.use(express.static(path.join(__dirname, 'build')));

app.listen(port);

app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'build', 'index.html')));
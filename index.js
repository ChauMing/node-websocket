'use strict';

const http = require('http');
const path = require('path');

const express = require('express');
const app = express();

const NW = require('./lib/nw-core');


app.use(express.static(path.resolve(__dirname, 'test', 'public')));


const server = http.createServer(app);

const sockets = NW(server);

setTimeout(function() {
    console.log(sockets);
}, 5000);

server.listen(8888);
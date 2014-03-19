#!/usr/bin/env node

var connect = require('connect'),
    root = process.cwd(),
    config = require(root + '/config.json');

var dist = root + '/' + config.distPath;

connect.createServer(
    connect.static(dist)
).listen(1307);

console.log('Server started at http://localhost:1307');
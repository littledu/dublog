#!/usr/bin/env node

var compiler = require('../lib/compiler');

var root = process.cwd();

compiler.compile(root);
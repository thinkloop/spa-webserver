#!/usr/bin/env node
"use strict";

var nodeStatic = require("node-static"),
	http = require("http"),
	chalk = require("chalk"),
	getopt = require("posix-getopt"),
	execSync = require('child_process').execSync,
	parser = new getopt.BasicParser("d:(directory)s(ssl)p:(port)", process.argv);

var opt,
	directory,
	port;


// parse passed-in cli options: -d (directory), -p (port)
while ((opt = parser.getopt()) !== undefined) {
	switch (opt.option) {
	case 'd':
		directory = opt.optarg;
		break;
	case 'p':
		port = opt.optarg;
		break;
	}
}

// set param defaults if opts not passed in
directory = directory || './';
port = port || process.env.PORT || 8080;

log('*********************************************************************');

var indexes = {};
var files =
	execSync(`find ${directory} -type f`)
	.toString()
	.split('\n').filter(function(path) {
		if (path.length && path !== directory) {
			return true;
		}
		return false;
	})
	.reduce(function(p, path) {
			var cleanPath = path.replace(directory, '/').replace(/[/]+/, '/'),
				indexFolder = cleanPath.replace(/index.*html/, '');

			// find main index file
			if(cleanPath !== indexFolder) {
				log(cleanPath);
				indexes[indexFolder] = cleanPath;
			}

			p[cleanPath] = true;

			return p;
		}, {});

log('*********************************************************************');

var staticServer = new(nodeStatic.Server)(directory, {cache: 600});

http.createServer(serveHTTP).listen(port);

log(`http://${process.env.C9_HOSTNAME || 'localhost'}/`);

function serveHTTP(req, res) {

	// if the file doesn't exist, find the closest index file
	if (!files[req.url]) {
		var splitURL = req.url.split('/'),
			joinURL,
			joinURLWithSlash;

		splitURL.push('dummy element to be popped on the first iteration');

		do {
			splitURL.pop();
			joinURL = splitURL.join('/'),
			joinURLWithSlash = `${joinURL}/`.replace(/[/]+/g, '/');
			req.url = indexes[joinURL] || indexes[joinURLWithSlash];
		}
		while (!req.url && splitURL.length);
	}

	res.setHeader('X-Frame-Options', 'DENY');
	res.setHeader("X-XSS-Protection", "1; mode=block");

	staticServer.serve(req, res, function (err, result) {
		if (err) {
			console.error("Error serving %s: %s", req.url, err.message);
			res.writeHead(err.status, err.headers);
			res.end();
		}
		else {
			log(req.url);
		}
	});
}

function log(str) {
	console.log(chalk.cyan.dim("[webserver]"), str);
}

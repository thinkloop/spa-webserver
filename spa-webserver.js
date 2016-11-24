#!/usr/bin/env node
"use strict";

var nodeStatic = require("node-static"),
	chokidar = require('chokidar'),
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

var staticServer = new(nodeStatic.Server)(directory, {cache: 600});
var indexes = {};
var files = {};

chokidar.watch(directory)
	.on('ready', () => {
		log('*********************************************************************');

		http.createServer(serveHTTP).listen(port);

		log(`http://${process.env.C9_HOSTNAME || 'localhost'}/`);
	})
	.on('all', (event, path) => {
		if (event !== 'add' && event !== 'unlink') {
			return;
		}

		var cleanDirectory = directory.replace(/^.\//, ''),
			cleanPath = path.replace(cleanDirectory, '/').replace(/[/]+/, '/'),
			indexFolder = cleanPath.replace(/index.*html/, '');

		if (event === 'unlink') {
			delete files[cleanPath];

			if (indexFolder && indexes[indexFolder] === cleanPath) {
				delete indexes[indexFolder];
			}
		}

		if(cleanPath !== indexFolder) {
			log(cleanPath);
			indexes[indexFolder] = cleanPath;
		}

		files[cleanPath] = true;
	});

function serveHTTP(req, res) {

	// if the file doesn't exist, find the closest index file
	if (!files[req.url]) {
		var logic = [],
			originalURL = `${req.url}/`.replace(/[/]+/g, '/'),
			splitURL = originalURL.split('/'),
			joinURL;

		do {
			splitURL.pop();
			joinURL = `${splitURL.join('/')}/`.replace(/[/]+/g, '/');
			req.url = indexes[joinURL];
			logic.push(joinURL);
			//console.log(splitURL);
		}
		while (!req.url && splitURL.length);

		if (!indexes[originalURL] && req.url) {
			logic.pop();
			logic.push(req.url);
			log(logic.join(' >>> '));
		}
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
			// log(req.url);
		}
	});
}

function log(str) {
	console.log(chalk.cyan.dim("[webserver]"), str);
}

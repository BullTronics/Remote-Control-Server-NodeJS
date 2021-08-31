const crypto = require("./crypto-util");
const controller = require("./controller");
var express = require('express');
const fs = require("fs");

function loadConfig() {
	let fileName = `${__dirname}/config.json`;

	let jsonString = fs.readFileSync(fileName, {encoding:'utf8', flag:'r'});
	let configJson = JSON.parse(jsonString);
	global.server = configJson;
}

function storeConfig() {
	let fileName = `${__dirname}/config.json`;

	let configJson = global.server;
	fs.writeFileSync(fileName, JSON.stringify(configJson, null, 4));
}

loadConfig();

var app = express();

var server = app.listen(global.server.port, function () {
	var host = 'localhost';
	var port = server.address().port;

	console.log("%s listening at http://%s:%s", global.server.title, host, port);
})

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// parse application/json
app.use(express.json())

/* Auth Gaurd */
app.use(function (req, res, next) {
	console.log(``);
	console.log(`Time: ${new Date().toLocaleTimeString()} || URL: ${req.originalUrl} || Method: ${req.method}`);

	if(global.server.whitelisted_hostname.indexOf(req.hostname) >= 0) {
		console.log("Bypass Request For allowed host");
		next();
	} else if(global.server.public_paths.indexOf(req.originalUrl) >= 0) {
		console.log("Bypass Request For Public Path");
		next();
	} else {
		let requestSignature = req.headers['signature'];
		let requestBody = req.body;
		
		let strRequestBody = JSON.stringify(requestBody);
		let expectedSignature = crypto.encrypt(strRequestBody);

		if(requestSignature === expectedSignature) {
			let currentTimestampInMs = new Date().valueOf();
			let requestedTimestampInMs = requestBody.timestamp;

			if(requestedTimestampInMs < currentTimestampInMs + (2*60*1000) && requestedTimestampInMs + (2*60*1000) > currentTimestampInMs ) {
				console.log("Authorised Request");
				next();
			} else {
				let errorMsg = `Expired Request, Timestamp Mismatch, currentTimestampInMs: ${currentTimestampInMs}, requestedTimestampInMs: ${requestedTimestampInMs}`;
				console.log(errorMsg);
				res.status(410).send({message: errorMsg, success: false});
			}
		} else {
			let errorMsg = "Invalid Request, Signature Mismatch";
			console.log(errorMsg);
			res.status(401).send({message: errorMsg, success: false});
		}
	}
})

function isValidRequest(object) {
	if(object === null) {
		return false;
	}
	return true;
}

async function handleMediaCommand(requestBody) {
	let responseObj = {success: false, message: 'Server Error'};
	let action = requestBody.action;

	switch(action) {
		case "PLAY":
			responseObj.success = controller.keyPressFromKeyboard('audio_play');
			responseObj.message = 'Command Executed';
			responseObj.data = {};
			break;
		case "PAUSE":
			responseObj.success = controller.keyPressFromKeyboard('audio_pause');
			responseObj.message = 'Command Executed';
			responseObj.data = {};
			break;
		case "STOP":
			responseObj.success = controller.keyPressFromKeyboard('audio_stop');
			responseObj.message = 'Command Executed';
			responseObj.data = {};
			break;
		case "NEXT":
			responseObj.success = controller.keyPressFromKeyboard('audio_next');
			responseObj.message = 'Command Executed';
			responseObj.data = {};
			break;
		case "PREVIOUS":
			responseObj.success = controller.keyPressFromKeyboard('audio_prev');
			responseObj.message = 'Command Executed';
			responseObj.data = {};
			break;
		case "VOLUME_INC":
			responseObj.success = controller.keyPressFromKeyboard('audio_vol_up');
			responseObj.message = 'Command Executed';
			responseObj.data = {};
			break;
		case "VOLUME_DEC":
			responseObj.success = controller.keyPressFromKeyboard('audio_vol_down');
			responseObj.message = 'Command Executed';
			responseObj.data = {};
			break;
	}

	return responseObj;
}

async function handleVolumeCommand(requestBody) {
	let responseObj = {success: false, message: 'Server Error'};
	let action = requestBody.action;

	switch(action) {
		case "SET_VOLUME":
			let volumeLevel = requestBody.data.level;
			let retStatus = controller.setVolume(volumeLevel);

			responseObj.success = retStatus;
			responseObj.message = 'Command Executed';
			responseObj.data = await controller.getVolumeStatus();
			break;
		case "STATUS":
			responseObj.success = true;
			responseObj.message = 'Command Executed';
			responseObj.data = await controller.getVolumeStatus();
			break;
		case "MUTE":
			controller.setMute();

			responseObj.success = true;
			responseObj.message = 'Command Executed';
			responseObj.data = await controller.getVolumeStatus();
			break;
		case "UNMUTE":
			controller.setUnmute();

			responseObj.success = true;
			responseObj.message = 'Command Executed';
			responseObj.data = await controller.getVolumeStatus();
			break;
	}

	return responseObj;
}

async function handleMouseCommand(requestBody) {
	let responseObj = {success: false, message: 'Server Error'};
	let action = requestBody.action;

	switch(action) {
		case "SET":
			let posX = requestBody.data.posX;
			let posY = requestBody.data.posX;
			let retStatus = controller.setVolume(posX, posY);

			responseObj.success = retStatus;
			responseObj.message = 'Command Executed';
			responseObj.data = {};
			break;
		case "STATUS":
			responseObj.success = true;
			responseObj.message = 'Command Executed';
			responseObj.data = controller.getMouse();
			break;
		case "CLICK_RIGHT":
			responseObj.success = true;
			responseObj.message = 'Command Executed';
			break;
		case "CLICK_LEFT":
			responseObj.success = true;
			responseObj.message = 'Command Executed';
			break;
	}

	return responseObj;
}

async function handleKeyboardCommand(requestBody) {
	let responseObj = {success: false, message: 'Server Error'};
	let action = requestBody.action;

	switch(action) {
		case "TYPE":
			let strToType = requestBody.data.str;

			responseObj.success = controller.typeFromKeyboard(strToType);
			responseObj.message = 'Command Executed';
			responseObj.data = {};
			break;
		case "COMMAND":
			let keyToPress = requestBody.data.key;

			responseObj.success = controller.keyPressFromKeyboard(keyToPress);
			responseObj.message = 'Command Executed';
			responseObj.data = {};
			break;
	}

	return responseObj;
}

async function handleMiscCommand(requestBody) {
	let responseObj = {success: false, message: 'Server Error'};
	let action = requestBody.action;

	switch(action) {
		case "RANDOM_CURSOR_MOVE_START":
			let smoothMoveFlag = requestBody.data.smoothMoveFlag;
			responseObj.success = controller.randomCursorMoveStart(smoothMoveFlag);
			responseObj.message = 'Command Executed';
			responseObj.data = {};
			break;
		case "RANDOM_CURSOR_MOVE_STOP":
			responseObj.success = controller.randomCursorMoveStop();
			responseObj.message = 'Command Executed';
			responseObj.data = {};
			break;
	}

	return responseObj;
}

app.put('/Command', async function (req, res) {
	let responseObj = {success: false, message: 'Server Error'};
	let requestBody = req.body;

	if(!isValidRequest(requestBody)) {
		let errorMsg = "Invalid Request Body";
		console.log(errorMsg);
		res.status(401).send({message: errorMsg, success: false});
		return;
	}

	switch(requestBody.command) {
		case "VolumeControl":
			responseObj = await handleVolumeCommand(requestBody);
			break;
		case "MediaControl":
			responseObj = await handleMediaCommand(requestBody);
			break;
		case "MouseControl":
			responseObj = await handleMouseCommand(requestBody);
			break;
		case "KeyboardControl":
			responseObj = await handleKeyboardCommand(requestBody);
			break;
		case "MiscControl":
			responseObj = await handleMiscCommand(requestBody);
			break;
		default:
			break;
	}

	res.send(responseObj)
})

app.get('/Version', function (req, res) {
	let responseObj = {success: true, message: 'Version Fetched', data: {version: global.server.version, title: global.server.title}};
	res.send(responseObj);
})

app.get('/Config', function (req, res) {
	let responseObj = {success: true, message: 'Config Fetched', data: null};

	let hostname = require('os').hostname();

	let networkInterfaces = require('os').networkInterfaces();
	let hosts = [];
	for(let interfaceName in networkInterfaces) {
		let interface = networkInterfaces[interfaceName];
		for(let i of interface) {
			if(i.family === 'IPv4') {
				hosts.push(i.address);
			}
		}
	}

	responseObj.data = {secret: global.server.secret, hostname, hosts, title: global.server.title, port: global.server.port};

	res.send(responseObj);
})

app.put('/Config', function (req, res) {
	let requestBody = req.body;
	let aesKey = requestBody.secret;
	let title = requestBody.title;
    while(aesKey.length !== 32) {
        if(aesKey.length < 32) {
            aesKey = "f" + aesKey;
        } else {
            aesKey = aesKey.slice(0, aesKey.length - 1);
        }
    }

	global.server.secret = aesKey;
	global.server.title = title;

	storeConfig();

	let responseObj = {success: true, message: 'Config Updated', data: {secret: global.server.secret}};
	res.send(responseObj);
})

app.get('/favicon.ico', function (req, res) {
	let fileName = `${__dirname}/html/favicon.png`;
	res.sendFile(fileName);
})

/* '/' Default Route */
app.get('/', function (req, res) {
	let fileName = `${__dirname}/html/welcome.html`;
	res.sendFile(fileName);
})

/* '/' Default Route */
app.get('/setting', function (req, res) {
	let fileName = `${__dirname}/html/setting.html`;
	res.sendFile(fileName);
})

/* '404 Route' (ALWAYS Keep this as the last route) */
app.get('*', function(req, res){
	let fileName = `${__dirname}/html/404.html`;
	res.statusCode = 404;
	res.sendFile(fileName);
});

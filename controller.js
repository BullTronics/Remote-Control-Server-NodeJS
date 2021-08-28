var loudness = require('loudness');
var robot = require("robotjs");

function setVolume(volumeLevel) {
	if(volumeLevel >= 0 && volumeLevel <= 100) {
		loudness.setVolume(volumeLevel)
		console.error('Command Executed');
		return true;
	} else {
		console.error('Unsupported Range');
		return false;
	}
}

async function getVolumeStatus() {
	const volume = await loudness.getVolume();
	const isMute = await loudness.getMuted();

	let data = {volume, isMute};
	return data;
}

function setMute() {
	loudness.setMuted(true);
	return true;
}

function setUnmute() {
	loudness.setMuted(false);
	return true;
}

function mouseControl() {
}


function getMouse() {
	var screenSize = robot.getScreenSize()
	var cursorPos = robot.getMousePos()

	return {screenSize, cursorPos};
}

function setMouse(posX, posY, smoothMoveFlag) {
	if(smoothMoveFlag === true) {
		robot.moveMouseSmooth(posX, posY);
	} else {
		robot.moveMouse(posX, posY);
	}
	return true;
	/*
	robotjs doen't support secondary monitor: https://github.com/octalmage/robotjs/issues/470
	var screenSize = robot.getScreenSize();
	if(posX >= 0 && posX <= screenSize.width && posY >= 0 && posY <= screenSize.height) {
		robot.moveMouseSmooth(posX, posY);
		return true;
	} else {
		console.log(`Unsupported Range For posX & posY`);
		console.log(`posX: ${posX}, posY: ${posY} => screenSize.width: ${screenSize.width}, screenSize.height: ${screenSize.height}`);
		return false;
	}
	*/
}

function typeFromKeyboard(strToType) {
	robot.typeString(strToType);
	return true;
}

function keyPressFromKeyboard(keyToPress) {
	robot.keyTap(keyToPress);
	return true;
}

var intervalObj = null;
const CURSOR_MOVE_DIRECTION = ['RIGHT', 'DOWN', 'LEFT', 'UP', 'DELAY'];
const CURSOR_MOVE_STEP_SIZE = 5;
var currentCursorMoveDirectionIndex = 0;
const CURSOR_MOVE_DISTANCE = 50;
var cursorMoveDirectionCovered = 0;
var currentExpectedCursorPosition = null;

function randomCursorMoveStart(smoothMoveFlag) {
	if(intervalObj !== null) {
		console.log("randomCursorMoveStart already running");
		return false;
	}

	let mouse = getMouse();
	currentExpectedCursorPosition = mouse.cursorPos;

	intervalObj = setInterval(() => {
		if(cursorMoveDirectionCovered >= CURSOR_MOVE_DISTANCE) {
			currentCursorMoveDirectionIndex++;
			cursorMoveDirectionCovered = 0;
			return;
		}
		if(currentCursorMoveDirectionIndex >= CURSOR_MOVE_DIRECTION.length) {
			currentCursorMoveDirectionIndex = 0;
			cursorMoveDirectionCovered = 0;
			return;
		}
		let posX = currentExpectedCursorPosition.x;
		let posY = currentExpectedCursorPosition.y;
		switch(CURSOR_MOVE_DIRECTION[currentCursorMoveDirectionIndex]) {
			case 'RIGHT':
				posX += CURSOR_MOVE_STEP_SIZE;
				cursorMoveDirectionCovered += CURSOR_MOVE_STEP_SIZE;
				break;
			case 'DOWN':
				posY += CURSOR_MOVE_STEP_SIZE;
				cursorMoveDirectionCovered += CURSOR_MOVE_STEP_SIZE;
				break;
			case 'LEFT':
				posX -= CURSOR_MOVE_STEP_SIZE;
				cursorMoveDirectionCovered += CURSOR_MOVE_STEP_SIZE;
				break;
			case 'UP':
				posY -= CURSOR_MOVE_STEP_SIZE;
				cursorMoveDirectionCovered += CURSOR_MOVE_STEP_SIZE;
				break;
			case 'DELAY':
				cursorMoveDirectionCovered += CURSOR_MOVE_STEP_SIZE;
				break;
		}
		currentExpectedCursorPosition.x = posX;
		currentExpectedCursorPosition.y = posY;
		if(global.server.enable_debug_logs === true) {
			console.log(`Direction: ${CURSOR_MOVE_DIRECTION[currentCursorMoveDirectionIndex]}`);
			console.log(`mouse.cursorPos.x: ${mouse.cursorPos.x}, mouse.cursorPos.y: ${mouse.cursorPos.y}`);
			console.log(`posX: ${posX}, posY: ${posY}`);
			console.log();
		}
		setMouse(posX, posY, smoothMoveFlag);
	}, 500);

	return true;
}

function randomCursorMoveStop() {
	if(intervalObj === null) {
		console.log("randomCursorMoveStart already stopped");
		return false;
	}

	clearInterval(intervalObj);
	intervalObj = null;
	currentCursorMoveDirectionIndex = 0;
	cursorMoveDirectionCovered = 0;
	return true;
}

module.exports = {
					setVolume,
					getVolumeStatus,
					setMute,
					setUnmute,
					mouseControl,
					getMouse,
					setMouse,
					typeFromKeyboard,
					keyPressFromKeyboard,
					randomCursorMoveStart,
					randomCursorMoveStop
				};

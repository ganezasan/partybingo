"use strict";

const pingoNumber = $('#pingo-number');
const startButton = $('#start-button');
const resetButton = $('#reset-button');
const historiesDiv = $('#histories');
const drumAudio = $('#drum').get(0);

// init histories
const toBingoString = (n) => {
	if(n > 9) {
		return n.toString(10);
	} else if (n < 0) {
		return '00';
	} else {
		return '0' +  n.toString(10);
	}
};

const addHistory = (n) => {
	historiesDiv.append('<span class="history-number">' + toBingoString(n) + '</span>');
};

// init number list and storage
const numberListAll = Array.from(Array(75).keys()).map((i) => i+1);
const storage = localStorage;
const listKey = 'partybingo.numberlist';
const removedKey = 'partybingo.removedlist';
const setNumberList = (a) => storage.setItem(listKey, JSON.stringify(a));
const getNumberList = () => JSON.parse(storage.getItem(listKey));
const setRemovedList = (a) =>	storage.setItem(removedKey, JSON.stringify(a));
const getRemovedList = () => JSON.parse(storage.getItem(removedKey));
const resetLists = () => {
	setNumberList(numberListAll.concat());
	setRemovedList([]);
};

// create initial list or loadHistory
const loadedNumberList = getNumberList();
const loadedRemovedList = getRemovedList();
if(loadedNumberList && loadedRemovedList) {
	for (var i = 0; i < loadedRemovedList.length; i++) {
		addHistory(loadedRemovedList[i]);
	}
} else {
	resetLists();
}

// create util method
const getNumberRamdom = () => {
	const numberList = getNumberList();
	const i = Math.floor(Math.random() * numberList.length);
	return numberList[i];
};

const removeNumberRamdom = () => {
	const numberList = getNumberList();
	if(numberList.length === 0) {
		return -1;
	}
	const i = Math.floor(Math.random() * numberList.length);
	const removed = numberList[i];
	numberList.splice(i, 1);
	setNumberList(numberList);
	const removedList = getRemovedList();
	removedList.push(removed);
	setRemovedList(removedList);
	return removed;
};

// init start button
let isStarted = false;
function rourletto() {
	if(isStarted) {
		pingoNumber.text(toBingoString(getNumberRamdom()));
		setTimeout(rourletto, 60);
	}
}
const stop = () => {
	isStarted = false;
	startButton.text('Start');
	const n = removeNumberRamdom();
	pingoNumber.text(toBingoString(n));
	addHistory(n);
	drumAudio.pause();
};
const start = () => {
	isStarted = true;
	startButton.text('Stop');
	drumAudio.currentTime = 0;
	drumAudio.play();
	rourletto();
};
const startClicked = () => {
	if(isStarted) {
		stop(null);
	} else {
		start();
	}
};
startButton.click(startClicked); // button
startButton.focus();

// init reset button
const resetClicked = () => {
	if (window.confirm('Do you really want to reset?')) {
		resetLists();
		pingoNumber.text('00');
		historiesDiv.empty();
		drumAudio.pause();
		startButton.focus();
	}
};
resetButton.click(resetClicked);

const ipc = require('electron').ipcRenderer
const {
	dialog
} = require('electron').remote
const {
	spawn,
	exec
} = require('child_process')
const path = require('path')
const {
	StringDecoder
} = require('string_decoder')
const decoder = new StringDecoder('utf8')

var userOptions = {}

window.onload = function () {
	document.getElementById('messages').innerText += 'window loaded\n'
	ipc.send('init')
}

var bar = document.getElementById('hashProgress')
var files = document.getElementById('showFiles')
var pct = document.getElementById('showpct')
var showPIDS = document.getElementById('showPIDS')
var messages = document.getElementById('messages')
var shellOutput = document.getElementById('output')

ipc.on('app path', (event, message) => {
	userOptions.appPath = message
})


document.getElementById('getHashFile').addEventListener('click', () => {
	dialog.showOpenDialog({
		buttonLabel: 'Get Hash File',
		properties: ['openFile'],
		filters: [{
			name: 'Hash File',
			extensions: ['md5']
		}]
	}, (selection) => {
		if (selection) {
			userOptions.hashFile = selection[0]
			userOptions.baseDir = path.dirname(selection[0])
			messages.innerText = `hash file: ${userOptions.hashFile}`
		}
	})
}, false)

document.getElementById('setDestination').addEventListener('click', () => {
	dialog.showOpenDialog({
		buttonLabel: 'Set Destination',
		properties: ['openDirectory', 'createDirectory']
	}, (selection) => {
		if (selection) {
			userOptions.destination = selection[0]
			messages.innerText = `output file: ${userOptions.destination}`
		}
	})
}, false)


document.getElementById('verification1').addEventListener('click', () => {
	ipc.send('start hash gen', userOptions)
}, false)



document.getElementById('killJob').addEventListener('click', () => {
	ipc.send('killJob')
}, false)

ipc.on('taskPID', (event, message) => {
	messages.innerText = `PID for hash job: ${message}`
})

ipc.on('hashGen output', (event, arg) => {
	shellOutput.innerText += arg
})

ipc.on('hashGen max', (event, arg) => {
	bar.max = arg
	shellOutput.innerText += `file count: ${arg}`
})

ipc.on('hashGen count', (event, arg) => {
	bar.value = arg
	calc = bar.value / bar.max * 100
	pct.innerText = `Progress: ${calc.toFixed(0)}%`
})

ipc.on('hashGen lines', (event, arg) => {
	files.innerText = arg
})

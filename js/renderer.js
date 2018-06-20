const ipc = require('electron').ipcRenderer
const path = require('path')
const { StringDecoder } = require('string_decoder')
const decoder = new StringDecoder('utf8')
const $ = jQuery = require('jquery')

var userOptions = {}



window.onload = function () {
	document.getElementById('messages').innerText += 'window loaded\n'
	ipc.send('init')
}

ipc.on('app path', (event, message) => {
	document.getElementById('messages').innerText += 'app path event received. \n'
	userOptions.appPath = message
	document.getElementById('messages').innerText += message.toString() + '\n'
	document.getElementById('messages').innerText += userOptions.appPath + '\n'
})


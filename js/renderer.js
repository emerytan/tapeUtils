const ipc = require('electron').ipcRenderer
const {dialog} = require('electron').remote
const {spawn} = require('child_process')
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


document.getElementById('getHashFile').addEventListener('click', (element, event) => {
	dialog.showOpenDialog({
		buttonLabel: 'Get Hash File',
		properties: ['openFile']
	}, (selection) => {
		if (selection) {
			userOptions.hashFile = selection[0]
		}
	})
})


document.getElementById('runsort').addEventListener('click', () => {

	var scriptPath = path.join(userOptions.appPath, 'bin', 'formatHash.sh')

	const run = spawn(scriptPath, [userOptions.hashFile, 'test.txt'])
	
	run.on('error', (err) => {
		console.log(err)
	})
	
	run.stdout.on('data', (data) => {
		document.getElementById('output').innerText += decoder.write(data)
	})
	
	run.stderr.on('data', (data) => {
		var cmdOut = decoder.write(data)
		let pin = document.getElementById('output')
		pin.innerText = cmdOut
		pin.scrollTop = pin.scrollHeight
		document.getElementById('output').innerText = cmdOut
	})
	
	run.stderr.on('close', (code) => {
		document.getElementById('messages').innerText = `exit code: ${code}`
	})


})	





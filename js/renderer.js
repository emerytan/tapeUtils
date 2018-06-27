const ipc = require('electron').ipcRenderer
const {dialog} = require('electron').remote
const {spawn, exec} = require('child_process')
const path = require('path')
const { StringDecoder } = require('string_decoder')
const decoder = new StringDecoder('utf8')
const $ = jQuery = require('jquery')

var userOptions = {}

// add comment




window.onload = function () {
	document.getElementById('messages').innerText += 'window loaded\n'
	ipc.send('init')
}

ipc.on('app path', (event, message) => {
	userOptions.appPath = message
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
	const run = spawn(scriptPath, [userOptions.hashFile])
	
	run.on('error', (err) => {
		console.log(err)
	})
	
	run.stdout.on('data', (data) => {
		let bar = document.getElementById('hashProgress')
		let files = document.getElementById('showFiles')
		let pct = document.getElementById('showpct')

		var cmdOut = decoder.write(data)
		var countRegex = /(^count:)\s(\d{1,6})/
		var linesRegex = /(^lines:)\s(\d{1,6})/
		var hashRegex = /^hash:/


		var calc

		if (linesRegex.test(cmdOut)) {
			var max = linesRegex.exec(cmdOut)
			document.getElementById('messages').innerText += max[2]
			bar.max = max[2]
		}

		if (countRegex.test(cmdOut)) {
			var pluck = countRegex.exec(cmdOut)
			var progress = pluck[2]
			bar.value = progress
		} 

		if (hashRegex.test(cmdOut)) {
			calc = bar.value / bar.max * 100
			pct.innerText = calc.toFixed(0)
			files.innerText = decoder.write(cmdOut)
		}

	})

	run.stderr.on('data', (data) => {
		document.getElementById('output').innerText += decoder.write(data)
	})
		
	run.stderr.on('close', (code) => {
		document.getElementById('messages').innerText = `exit code: ${code}`
	})


})	





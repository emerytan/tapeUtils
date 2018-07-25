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
var ps = require('ps-node')



var userOptions = {}
var taskPID


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
			document.getElementById('messages').innerText = selection[0]
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
			document.getElementById('messages').innerText = selection[0]
		}
	})
}, false)


document.getElementById('verification1').addEventListener('click', () => {

	var scriptPath = path.join(userOptions.appPath, 'bin', 'liveCheck.sh')
	const run = spawn(scriptPath, [userOptions.hashFile, userOptions.baseDir, userOptions.destination])

	ps.lookup({
		arguments: 'liveCheck'
	}, (err, processes) => {
		if (err) {
			console.log(err)
		}
		if (processes) {
			taskPID = processes
			showPIDS.innerText = `PID: ${processes[0].pid}`
			ipc.send('taskPID', processes[0].pid)
		}
	})
	

	run.on('error', (err) => {
		shellOutput.innerText += decoder.write(err)
	})

	run.stdout.on('data', (data) => {
		var cmdOut = decoder.write(data)
		var countRegex = /(^count:)\s(\d{1,6})/
		var linesRegex = /(^lines:)\s(\d{1,6})/
		var hashRegex = /(^[a-f0-9]{32})\s{1,2}(\.\/.+)/

		var calc

		if (linesRegex.test(cmdOut)) {
			var max = linesRegex.exec(cmdOut)
			bar.max = max[2]
		}

		if (countRegex.test(cmdOut)) {
			var pluck = countRegex.exec(cmdOut)
			var progress = pluck[2]
			bar.value = progress
			calc = bar.value / bar.max * 100
			pct.innerText = `Progress: ${calc.toFixed(0)}%`
		}

		if (hashRegex.test(cmdOut)) {
			var showFiles = hashRegex.exec(cmdOut)
			files.innerText = decoder.write(showFiles[0])
		}

	})

	run.stderr.on('data', (data) => {
		shellOutput.innerText += decoder.write(data)
	})

	run.on('close', (code) => {
		ipc.send('taskPID', null)
		messages.innerText = `exit code: ${code}`
	})
}, false)


document.getElementById('killJob').addEventListener('click', () => {
	taskPID.forEach(proc => {
		if (proc) {
			ps.kill(proc.pid, (err) => {
				if (err) {
					throw err
				} else {
					messages.innerText = `process: ${proc.pid} killed`
				}
			})
		}
	});
}, false)

ipc.on('taskPID', (event, message) => {
	messages.innerText += decoder.write(message)
})

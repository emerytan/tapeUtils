const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron')
const path = require('path')
const spawn = require('child_process').spawn
const { StringDecoder} = require('string_decoder')
const decoder = new StringDecoder('utf8') 
const ps = require('ps-node')


var taskPID = null
var countRegex = /(^count:)\s(\d{1,6})/
var linesRegex = /(^lines:)\s(\d{1,6})/
var hashRegex = /(^[a-f0-9]{32})\s{1,2}(\.\/.+)/
let mainWindow
var cmdOut
var lines
var max
var progress = []

app.on('ready', function () {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 300,
        'min-width': 800,
        'min-height': 200,
        'accept-first-mouse': true,
        'title-bar-style': 'hidden'
    });
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
    // mainWindow.webContents.openDevTools()
});


ipcMain.on('init', (event, message) => {
    event.sender.send('app path', app.getAppPath())
})


ipcMain.on('start hash gen', (event, arg) => {
    var scriptPath = path.join(arg.appPath, 'bin', 'liveCheck.sh')
    const run = spawn(scriptPath, [arg.hashFile, arg.baseDir, arg.destination])
    getTaskPID(arg.hashFile)

    run.on('error', (err) => {
        mainWindow.webContents.send('hashGen output', decoder.write(err))
    })

    
    run.stdout.on('data', (data) => {
        cmdOut = decoder.write(data)
        if (linesRegex.test(cmdOut)) {
            max = linesRegex.exec(cmdOut)
            mainWindow.webContents.send('hashGen max', max[2])
        }
        if (countRegex.test(cmdOut)) {
            progress = countRegex.exec(cmdOut)
            mainWindow.webContents.send('hashGen count', progress[2])
        }
        if (hashRegex.test(cmdOut)) {
            lines = hashRegex.exec(cmdOut)
            mainWindow.webContents.send('hashGen lines', lines[0])
        }
    })


    run.stderr.on('data', (data) => {
        mainWindow.webContents.send('hashGen output', decoder.write(data))
    })


    run.on('close', (code) => {
        taskPID = null
    })
})

ipcMain.on('killJob', killIT)

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    killIT()
})

function getTaskPID(arguments) {
    ps.lookup({
        command: 'bin/bash',
	arguments: arguments
    }, (err, processes) => {
        if (err) {
            console.log(err)
        }
        if (processes) {
            taskPID = processes[0].pid
            mainWindow.webContents.send('taskPID', taskPID)
        }
    })
}

function killIT() {
    if (taskPID === null) {
        console.log('no jobs running');
    } else {
        console.log(`killing PID: ${taskPID}`);
        ps.kill(taskPID, (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log(`process: ${process.pid} killed`)
            }
        })
    }
}

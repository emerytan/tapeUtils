const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron')
var taskPID = null
var ps = require('ps-node')

let mainWindow

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

ipcMain.on('taskPID', (event, arg) => {
    taskPID = arg
    console.log(taskPID);
    event.sender.send('pong')
})

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    if (taskPID === null) {
        console.log('no jobs running');
    } else {
        console.log(`killing PID: ${taskPID}`);
        ps.kill(taskPID, (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log(`process: ${proc.pid} killed`)
            }
        })
    }
})

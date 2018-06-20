const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron')
const path = require('path')


let mainWindow

app.on('ready', function () {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        'min-width': 800,
        'min-height': 600,
        'accept-first-mouse': true,
        'title-bar-style': 'hidden'
    });
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
    mainWindow.webContents.openDevTools()
});


ipcMain.on('init', (event, message) => {
    console.log('init event received')
    console.log(`app path: ${app.getAppPath()}`)
    event.sender.send('app path', app.getAppPath())
    console.log(path.parse(app.getAppPath()));
})

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});



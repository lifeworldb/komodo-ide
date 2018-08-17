import { app, BrowserWindow } from 'electron'
import * as path from 'path'
import * as url from 'url'

let mainWindow: Electron.BrowserWindow

function createWindow() {

  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    center: true,
    fullscreenable: true,
    fullscreen: false,
    resizable: true,
    title: 'Komodo',
    autoHideMenuBar: true,
    titleBarStyle: 'hiddenInset',
    /*webPreferences: {
      devTools: true,
      sandbox: false,
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    },*/
    frame: true
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, './index.html'),
    protocol: 'file',
    slashes: true
  }))

  // Open the DevTools
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

/*const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
  if (mainWindow) {
    if (mainWindow.isMinimized())
      mainWindow.restore()
    mainWindow.focus()
  }
})*/

// Close instance window if isSecondInstance is true
// if (isSecondInstance) app.quit()

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin')
    app.quit()
})

app.on('activate', () => {
  if (mainWindow === null)
    createWindow()
})
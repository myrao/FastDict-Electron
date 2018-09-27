const {app, BrowserWindow} = require('electron')
const Menu = require('electron').Menu

let win

function createWindow () {
  // 创建浏览器窗口
  win = new BrowserWindow({width: 300, height: 500})

  // 然后加载应用的 index.html。
  win.loadURL('file://' + __dirname + '/index.html')
  // win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })
}
function initView () {
  createWindow()
  createMenu()
}

function createMenu () {
  const application = {
    label: 'Application',
    submenu: [ {
      label: 'About Application',
      selector: 'orderFrontStandardAboutPanel:'
    }, {
      type: 'separator'
    }, {
      label: 'Quit',
      accelerator: 'Command+Q',
      click: () => {
        app.quit()
      }
    }
    ]
  }
  const edit = {
    label: 'Edit',
    submenu: [ {
      label: 'Undo',
      accelerator: 'CmdOrCtrl+Z',
      selector: 'undo:'
    }, {
      label: 'Redo',
      accelerator: 'Shift+CmdOrCtrl+Z',
      selector: 'redo:'
    }, {
      type: 'separator'
    }, {
      label: 'Cut',
      accelerator: 'CmdOrCtrl+X',
      selector: 'cut:'
    }, {
      label: 'Copy',
      accelerator: 'CmdOrCtrl+C',
      selector: 'copy:'
    }, {
      label: 'Paste',
      accelerator: 'CmdOrCtrl+V',
      selector: 'paste:'
    }, {
      label: 'Select All',
      accelerator: 'CmdOrCtrl+A',
      selector: 'selectAll:'
    }
    ]
  }

  const template = [
    application,
    edit
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

app.on('ready', initView)

app.on('window-all-closed', () => {
  watcher.stop()
  app.quit()
})

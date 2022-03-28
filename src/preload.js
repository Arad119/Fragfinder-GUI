const { contextBridge, ipcRenderer } = require('electron')

process.once('loaded', () => {
  window.addEventListener('message', evt => {
    if (evt.data.type === 'select-dirs') {
      ipcRenderer.send('select-dirs')
    }
  })
})

contextBridge.exposeInMainWorld('electronAPI', {
  filePathInput: (callback) => ipcRenderer.on('updatefileLoc', callback),
  processDemos: (steamid) => ipcRenderer.send('setSteamId', steamid)
})
const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("api", {

    selectFolderPopup: () => ipcRenderer.invoke("select-folder-popup", true)

});
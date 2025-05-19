// electron/preload.js
console.log('[preload] loaded');   // <— adicione isto

const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('dockerAPI', {
  pullImage: (tag) => ipcRenderer.invoke('docker:pull-image', tag),
  listContainers: () => ipcRenderer.invoke('docker:list-containers'),
  createContainer: (opts) => ipcRenderer.invoke('docker:create-container', opts),
  startContainer: (id) => ipcRenderer.invoke('start-container', id), // ✅ Adicione esta linha
  removeContainer: (id) => ipcRenderer.invoke('remove-container', id), // ✅ E esta
  stopContainer: (id) => ipcRenderer.invoke('docker:stop-container', id),
  getAppPath: () => ipcRenderer.invoke('electron:get-app-path'),
});

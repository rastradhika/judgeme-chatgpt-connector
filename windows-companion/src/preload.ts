import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("judgeMeChatGPT", {
  getState: () => ipcRenderer.invoke("judgeme:state"),
  signIn: () => ipcRenderer.invoke("judgeme:sign-in"),
  disconnect: () => ipcRenderer.invoke("judgeme:disconnect"),
  refresh: () => ipcRenderer.invoke("judgeme:refresh"),
  openUsage: () => ipcRenderer.invoke("judgeme:open-usage"),
  onState: (callback: (state: unknown) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, state: unknown) => callback(state);
    ipcRenderer.on("judgeme:state-changed", listener);
    return () => ipcRenderer.removeListener("judgeme:state-changed", listener);
  },
});

import { app, BrowserWindow, ipcMain, safeStorage, shell } from "electron";
import { join } from "node:path";
import { createChatGPT, CHATGPT_USAGE_URL } from "@siwc/local";
import { createWindowsCredentialEncryption } from "./credential-encryption.js";

app.setName("Judge.Me ChatGPT Connector");
const userData = app.getPath("userData");
const chatgpt = createChatGPT({
  appName: "Judge.Me ChatGPT Connector",
  appId: "judgeme-chatgpt-connector",
  sendHostId: true,
  redirectPort: 8789,
  storageDir: join(userData, "chatgpt"),
  credentialEncryption: createWindowsCredentialEncryption(safeStorage, () => app.isReady()),
  openBrowser: async (url: string) => {
    const target = new URL(url);
    if (target.origin !== "https://auth.openai.com") throw new Error("Unexpected sign-in destination.");
    await shell.openExternal(target.href);
  },
});
let window: BrowserWindow | undefined;
let busy = false;

async function getSafeState() {
  const session = await chatgpt.getSession();
  const profiles = await chatgpt.listProfiles();
  let modelCount = 0;
  if (session.status === "connected" && session.sharing) {
    try { modelCount = (await chatgpt.listModels()).length; } catch { /* retry via refresh */ }
  }
  return {
    session: { status: session.status, sharing: session.sharing },
    profiles: profiles.map(p => ({ id: p.id, label: p.label })),
    modelCount, busy, storage: "Windows protected credential storage",
  };
}
async function publish() {
  if (window && !window.isDestroyed()) window.webContents.send("judgeme:state-changed", await getSafeState());
}
function installIpc() {
  ipcMain.handle("judgeme:state", getSafeState);
  ipcMain.handle("judgeme:sign-in", async () => {
    if (busy) throw new Error("An account operation is already in progress.");
    if (!safeStorage.isEncryptionAvailable()) throw new Error("Windows protected credential storage is unavailable.");
    busy = true; await publish();
    try { await chatgpt.signIn(); }
    finally { busy = false; await publish(); }
  });
  ipcMain.handle("judgeme:disconnect", async () => {
    if (busy) throw new Error("An account operation is already in progress.");
    busy = true; await publish();
    try { await chatgpt.disconnect(); }
    finally { busy = false; await publish(); }
  });
  ipcMain.handle("judgeme:refresh", publish);
  ipcMain.handle("judgeme:open-usage", () => shell.openExternal(CHATGPT_USAGE_URL));
}
app.whenReady().then(async () => {
  if (process.platform !== "win32") throw new Error("This companion build is Windows-only.");
  installIpc();
  window = new BrowserWindow({
    width: 560, height: 520, minWidth: 480, minHeight: 420,
    webPreferences: { preload: join(import.meta.dirname, "preload.js"), contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  await window.loadFile(join(import.meta.dirname, "../ui/index.html"));
  await publish();
});
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import electron from "electron";

const { app, BrowserWindow, globalShortcut, screen } = electron;

// __dirname fix for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let backendProcess;

function startBackend() {
  const exePath = path.join(process.resourcesPath, "Chemist_Backend.exe");

  backendProcess = spawn(exePath, [], {
    detached: true,
    stdio: "ignore", // hide logs; or use ['pipe', 'pipe', 'pipe'] to debug
  });

  backendProcess.unref(); // allow the Electron app to exit independently of the backend
  console.log("Django backend started...");
}

function stopBackend() {
  if (backendProcess) {
    backendProcess.kill();
    console.log("Django backend stopped...");
  }
}

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    width,
    height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
    icon: path.join(__dirname, "public", "icon.ico"),
  });

  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:5173"); // Vite dev server
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "dist", "index.html"));
  }

  globalShortcut.register("Alt+Left", () => {
    if (win.webContents.canGoBack()) {
      win.webContents.goBack();
    }
  });

  win.webContents.on("did-fail-load", () => {
    console.log("No previous page to go back to.");
  });
}

app.whenReady().then(() => {
  console.log("App is ready...");
  startBackend(); // Start backend server
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    stopBackend(); // Stop backend server on close
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

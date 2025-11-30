// Module to control the application lifecycle and the native browser window.
const { app, BrowserWindow, protocol, screen, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const url = require("url");
const { globalShortcut } = require("electron");

let driverWindow = null;
let tempTaskWindow = null;

// Create the native browser window.
function createWindow({ isNewTaskOnly } = { isNewTaskOnly: false }) {
  const primaryDisplay = screen.getPrimaryDisplay();

  const { width: displayWidth, height: displayHeight } =
    primaryDisplay.workAreaSize;

  const newWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: isNewTaskOnly ? 320 : displayWidth,
    height: isNewTaskOnly ? 450 : displayHeight,
    icon: path.join(__dirname, "public/icon.png"),

    // Set the path of an additional "preload" script that can be used to
    // communicate between node-land and browser-land.
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      additionalArguments: isNewTaskOnly ? ["--isnewtaskonly"] : [],
    },
  });

  // In development, set it to localhost to allow live/hot-reloading.
  // In production, load the local index.html file.
  if (app.isPackaged) {
    newWindow.loadFile(path.join(__dirname, "index.html"));
  } else {
    newWindow.loadURL("http://localhost:3000");
  }

  return newWindow;
}

// This method will be called when Electron has finished its initialization and
// is ready to create the browser windows.
// Some APIs can only beused after this event occurs.
app.whenReady().then(() => {
  autoUpdater.checkForUpdatesAndNotify();
  driverWindow = createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
// There, it's common for applications and their menu bar to stay active until
// the user quits  explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// If your app has no need to navigate or only needs to navigate to known pages,
// it is a good idea to limit navigation outright to that known scope,
// disallowing any other kinds of navigation.
const allowedNavigationDestinations = "https://my-electron-app.com";
app.on("web-contents-created", (event, contents) => {
  contents.on("will-navigate", (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    if (!allowedNavigationDestinations.includes(parsedUrl.origin)) {
      event.preventDefault();
    }
  });
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

app.on("ready", () => {
  ipcMain.on("closeAndRefreshTasks", () => {
    if (tempTaskWindow?.isDestroyed()) {
      return;
    }
    tempTaskWindow?.close();
    driverWindow.webContents.send("refreshTasks");
  });

  // Register a ctrl+. listener
  const ret = globalShortcut.register("CommandOrControl+G", () => {
    tempTaskWindow = createWindow({ isNewTaskOnly: true });
  });
  if (!ret) {
    console.log("registration failed");
  }

  console.log(
    "Has registered global shorctut",
    globalShortcut.isRegistered("CommandOrControl+G")
  );
});

app.on("will-quit", () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});

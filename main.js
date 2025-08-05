/**
 * Main process file for the Electron application.
 * Handles window creation and application lifecycle.
 */

// Import required Electron modules and Node.js path module
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { logActiveWindow } = require('./logger/activityLogger');
const { startServer } = require('./logger/browserLogger');

/**
 * Creates and configures the main application window.
 * Sets up window dimensions, preload script, and loads the HTML entry point.
 */
function createWindow() {
    // Create a new browser window instance

    // TODO: Add icon
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            // Load the preload script to safely expose Node.js features
            preload: path.join(__dirname, 'src/renderer.js'),
        },
        menu: null,
        autoHideMenuBar: true,
        frame: true,
    });

    // Remove the menu bar
    win.setMenu(null);

    // Load the main HTML file into the window
    win.loadFile(path.join('public/index.html'));
}

// Create window when Electron has finished initialization
app.whenReady().then(() => {
    createWindow();

    // Log active window every 15 secs
    setInterval(logActiveWindow, 15 * 1000);

    startServer();

    // On macOS, re-create window when dock icon is clicked and no windows are open
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit the application when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
    // On macOS, applications keep running unless explicitly quit with Cmd + Q
    if (process.platform !== 'darwin') app.quit();
});


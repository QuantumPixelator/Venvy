const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
    let disposable = vscode.commands.registerCommand('venvy.activateEnvironment', function () {
        // Create or get the active terminal
        let terminal = vscode.window.activeTerminal;
        if (!terminal) {
            terminal = vscode.window.createTerminal();
        }
        terminal.show();  // This line will focus the terminal

        const isWindows = process.platform === 'win32';
        const folderPath = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : '';
        const venvPath = path.join(folderPath, 'venv');

        if (isWindows) {
            const folderPathQuoted = `"${folderPath}"`;  // Quote the path to handle spaces
            if (fs.existsSync(venvPath)) {
                terminal.sendText(`cd ${folderPathQuoted}`);
                terminal.sendText('.\\venv\\Scripts\\Activate');
            } else {
                terminal.sendText(`cd ${folderPathQuoted}`);
                terminal.sendText('python -m venv venv');
                terminal.sendText('.\\venv\\Scripts\\Activate');
            }
        } else {
            if (fs.existsSync(venvPath)) {
                terminal.sendText(`cd "${folderPath}"`);
                terminal.sendText('source ./venv/bin/activate');
            } else {
                terminal.sendText(`cd "${folderPath}"`);
                terminal.sendText('python3 -m venv venv');
                terminal.sendText('source ./venv/bin/activate');
            }
        }
    });

    let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = "venvy.activateEnvironment";
    statusBarItem.text = "Activate Venv";
    statusBarItem.tooltip = "Click to activate Python virtual environment";
    statusBarItem.show();

    context.subscriptions.push(disposable, statusBarItem);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};

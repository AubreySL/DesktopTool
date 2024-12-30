const { app } = require('electron')

export function getAppDataPath(){
    return app.getPath('appData');
}

export function getAppName(){
    return app.getName();
}
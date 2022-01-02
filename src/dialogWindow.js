const { dialog } = require("electron");

async function userSelectFolder () {

    return new Promise((success, reject) => {
        const result = dialog.showOpenDialog({
            properties: ['openDirectory']
        });
    
        result.then((results) => {
            success(results);
        })
    
        result.catch((err) => {
            reject(err);
        })
    });



}

module.exports = {
    userSelectFolder: userSelectFolder
}
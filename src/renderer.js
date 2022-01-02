async function openDialogBox () {
    const result = await api.selectFolderPopup(); 

    console.log(result);
    if (result.canceled) return;

    const filePathInput = document.getElementById("folder-path");

    if (result.filePaths.length == 1){
        filePathInput.value = result.filePaths[0];
    }
}

async function demoProcess () {

    console.log("process");

    var getFrags = require('getfrags');
    const createFiles = require("../main/lib/create-files.js");
}
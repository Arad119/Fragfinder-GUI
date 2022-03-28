
document.getElementById('dirs').addEventListener('click', (evt) => {
  evt.preventDefault()
  window.postMessage({
    type: 'select-dirs',
  })
})


window.electronAPI.filePathInput((event, value) => {
$('#folder-path').val(value);
})


const setButton = $('#btn')[0];

setButton.addEventListener('click', () => {
  const steamid = $('#steamid').val();
  window.electronAPI.processDemos(steamid)
});

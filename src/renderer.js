
document.getElementById('dirs').addEventListener('click', (evt) => {
    evt.preventDefault()
    window.postMessage({
      type: 'select-dirs',
    })
  })


window.electronAPI.filePathInput((event, value) => {
  $('#folder-path').val(value);
})
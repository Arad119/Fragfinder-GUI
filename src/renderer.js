
document.getElementById('dirs').addEventListener('click', (evt) => {
    evt.preventDefault()
    window.postMessage({
      type: 'select-dirs',
    })
  })
  
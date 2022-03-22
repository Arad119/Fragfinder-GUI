
document.getElementById('dirs').addEventListener('click', (evt) => {
    evt.preventDefault()
    window.postMessage({
      type: 'select-dirs',
    })
  })


function checkValid () {
  var cbChecked = $("#steamIdCheck").is(':checked');  // check if at least one checked
  
  $("#steamId").prop("disabled", cbChecked);
}


$( function () {
  checkValid(); // run it for the first time
  $("#steamIdCheck").on("change", checkValid);  // bind checkboxesvia classname
});
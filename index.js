var $ = require('jquery')
var Landscape = require('./js/landscape')

var landscape = Landscape()

$(document).on('keypress', function (e) {
  e.preventDefault();
  landscape.addBot(null);
});

function update () {
  landscape.updateFrame();
  window.requestAnimationFrame(update);
}
window.requestAnimationFrame(update);

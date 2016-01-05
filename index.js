var $ = require('jquery')
var Landscape = require('./js/landscape')

var landscape = Landscape({width: 50, height: 50, densityPercent: 20, scale: 10})

$(document).on('keypress', function (e) {
  landscape.addBot()
});

function update () {
  landscape.updateFrame()
  window.requestAnimationFrame(update)
}
window.requestAnimationFrame(update)

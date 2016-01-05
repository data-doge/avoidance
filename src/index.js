var $ = require('jquery')
var Landscape = require('./landscape')

var landscape = Landscape({width: 50, height: 50, densityPercent: 20, scale: 10})

$(document).on('keypress', function () {
  landscape.addBot()
});

function update () {
  landscape.updateFrame()
  window.requestAnimationFrame(update)
}
window.requestAnimationFrame(update)

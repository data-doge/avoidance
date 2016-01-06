var $ = require('jquery')
var Landscape = require('./landscape')

var landscape = Landscape({width: 40, height: 40, densityPercent: 10, scale: 15})

$(document).on('keypress', function () { landscape.addBot() })

function update () {
  landscape.updateFrame()
  window.requestAnimationFrame(update)
}
window.requestAnimationFrame(update)

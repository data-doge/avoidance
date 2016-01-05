var $ = require('jquery')
var Landscape = require('./landscape')

var landscape = Landscape({width: 100, height: 100, densityPercent: 1, scale: 5})

$(document).on('keypress', function () { landscape.addBot() })

function update () {
  landscape.updateFrame()
  window.requestAnimationFrame(update)
}
window.requestAnimationFrame(update)

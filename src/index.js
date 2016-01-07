var $ = require('jquery')
var Landscape = require('./landscape')

var landscape = Landscape({width: 15, height: 15, densityPercent: 10, scale: 35})

$(document).on('keypress', function () { landscape.addBot() })

function update () {
  landscape.updateFrame()
  window.requestAnimationFrame(update)
}
window.requestAnimationFrame(update)

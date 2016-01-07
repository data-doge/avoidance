var $ = require('jquery')
var Landscape = require('./landscape')

var landscape = Landscape({width: 15, height: 15, densityPercent: 10, scale: 35})
landscape.animate()

$(document).on('keypress', function (e) {
  console.log('e.keyCode: ', e.keyCode)
  switch (e.keyCode) {
    case 97: landscape.addBot(); break // 'a'
    case 112: landscape.toggleAnimation(); break // 'p'
    case 116: landscape.toggleTrails(); break // 't'
  }
})

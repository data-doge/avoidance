var $ = require('jquery')
var Landscape = require('./landscape')
var _ = require('lodash')

var landscape = Landscape({width: 100, height: 100, densityPercent: 0, scale: 5})
landscape.animate()

$(document).on('keypress', function (e) {
  console.log('e.keyCode: ', e.keyCode)
  switch (e.keyCode) {
    case 97: _.times(5, function () {
      landscape.addBot()
    }); break // 'a'
    case 112: landscape.toggleAnimation(); break // 'p'
    case 116: landscape.switchTrailMode(); break // 't'
    case 100: landscape.toggleExistenceOfDeath(); break // 'd'
  }
})

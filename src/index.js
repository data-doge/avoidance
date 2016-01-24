var $ = require('jquery')
var Landscape = require('./landscape')

var landscape = Landscape()
landscape.animate()

$(document).on('keypress', function (e) {
  console.log('e.keyCode: ', e.keyCode)
  switch (e.keyCode) {
    case 97: landscape.addBot(1); break                       // 'a'
    case 112: landscape.toggleAnimation(); break              // 'p'
    case 116: landscape.switchTrailMode(); break              // 't'
    case 100: landscape.toggleExistenceOfDeath(); break       // 'd'
    case 101: landscape.empty(); break                        // 'e'
    case 99: landscape.switchBotAvoidanceAlgorithm(); break   // 'c'
    case 115: landscape.switchSpawnMode(); break              // 's'
  }
})

var $liveControlsPanel = $('#live-controls-panel')
var $simConstructorPanel = $('#sim-constructor-panel')
var $newSimBtn = $('#new-sim-btn')
var $exitSimConstructorBtn = $('#exit-sim-constructor-btn')

$newSimBtn.click(function (e) {
  $liveControlsPanel.hide()
  $simConstructorPanel.css('display', 'flex')
})

$exitSimConstructorBtn.click(function (e) {
  $simConstructorPanel.hide()
  $liveControlsPanel.css('display', 'flex')
})

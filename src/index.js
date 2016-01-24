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
var $redesignLandscapePanel = $('#redesign-landscape-panel')

var $newSimBtn = $('#redesign-landscape-btn')

var $redesignLandscapeSubmitBtns = $('#redesign-landscape-submit-btns')
var $startBtn = $('#start-btn')
var $stopBtn = $('#stop-btn')
var $clearBtn = $('#clear-btn')

var $exitRedesignLandscapeBtn = $('#cancel-redesign-landscape-btn')
var $completeRedesignLandscapeBtn = $('#complete-redesign-landscape-btn')

$newSimBtn.click(function (e) {
  $liveControlsPanel.hide()
  $redesignLandscapePanel.css('display', 'flex')
})

$redesignLandscapeSubmitBtns.click(function (e) {
  $redesignLandscapePanel.hide()
  $liveControlsPanel.css('display', 'flex')
})

$stopBtn.click(function (e) {
  landscape.toggleAnimation()
  $stopBtn.hide()
  $startBtn.show()
})

$startBtn.click(function (e) {
  landscape.toggleAnimation()
  $startBtn.hide()
  $stopBtn.show()
})

$clearBtn.click(function (e) {
  landscape.empty()
})

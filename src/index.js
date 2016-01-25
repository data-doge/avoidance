var $ = require('jquery')
var Landscape = require('./landscape')
var _ = require('lodash')

var landscape = Landscape()
landscape.animate()

$(document).on('keypress', function (e) {
  switch (e.keyCode) {
    case 112: landscape.toggleAnimation(); break              // 'p'
    case 101: landscape.empty(); break                        // 'e'
    case 99: landscape.switchBotAvoidanceAlgorithm(); break   // 'c'
    case 115: landscape.switchSpawnMode(); break              // 's'
  }
})

// jQuery objects

var $liveControlsPanel = $('#live-controls-panel')
var $redesignLandscapePanel = $('#redesign-landscape-panel')

var $newSimBtn = $('#redesign-landscape-btn')

var $redesignLandscapeSubmitBtns = $('#redesign-landscape-submit-btns')
var $startBtn = $('#start-btn')
var $stopBtn = $('#stop-btn')
var $clearBtn = $('#clear-btn')
var $restartBtn = $('#restart-btn')
var $spawnBotBtn = $('#spawn-bot-btn')

var $spawnRateField = $('#spawn-rate-field')
var $anxietyLevelField = $('#anxiety-level-field')
var $trailMode = $('#trail-mode')
var $spawnMode = $('#spawn-mode')
var $avoidanceAlgorithm = $('#avoidance-algorithm')

var $landscapeSizeField = $('#landscape-size-field')
var $landscapeDensityField = $('#landscape-density-field')
var $maxDensityIndicator = $('#max-density-indicator')

var $exitRedesignLandscapeBtn = $('#cancel-redesign-landscape-btn')
var $completeRedesignLandscapeBtn = $('#complete-redesign-landscape-btn')

// event listeners

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

$restartBtn.click(function (e) {
  landscape.restart()
})

bindSanitizerToNumberInput($landscapeSizeField, false, function (size) {
  var maxDensityPercent = landscape.maxDensityPercent(size).toFixed(2)
  $landscapeDensityField.attr('max', maxDensityPercent)
  $maxDensityIndicator.text(maxDensityPercent)
  $landscapeDensityField.val(maxDensityPercent)
})

bindSanitizerToNumberInput($landscapeDensityField, true)

$completeRedesignLandscapeBtn.click(function () {
  var size = parseInt($landscapeSizeField.val())
  if (!size) {
    size = +$landscapeSizeField.attr('min')
    $landscapeSizeField.val(size)
  }
  var densityPercent = parseFloat($landscapeDensityField.val()).toFixed(1)
  landscape.empty()
  landscape.initialize({ size: size, densityPercent: densityPercent })
})

var spawnInterval
$spawnBotBtn.mousedown(function () {
  spawnInterval = setInterval(function () {
    landscape.addBot()
  }, 5)
}).mouseup(function () {
  clearInterval(spawnInterval)
})

bindSanitizerToNumberInput($spawnRateField, false, function (spawnRate) {
  landscape.spawnRate = spawnRate || +$spawnRateField.attr('min')
})

bindSanitizerToNumberInput($anxietyLevelField, false, function (anxietyLevel) {
  anxietyLevel = anxietyLevel || +$anxietyLevelField.attr('min')
  landscape.setAnxietyLevel(anxietyLevel)
})

$trailMode.change(function () {
  landscape.trailMode = $(this).val()
})

$spawnMode.change(function () {
  landscape.setSpawnMode($(this).val())
})

$avoidanceAlgorithm.change(function () {
  landscape.setAvoidanceAlgorithm($(this).val())
})

// helper fxns

function bindSanitizerToNumberInput($input, isFloat, onChange) {
  $input.bind('propertychange change click keyup input paste', function () {
    var $this = $(this), val = $this.val()
    var min = +$this.attr('min'), max = +$this.attr('max')
    if (isFloat) {
      min = min.toFixed(2)
      max = max.toFixed(2)
    }

    if (val === "") {
      val = ""
    } else if (!_.inRange(val, min, max + 1)) {
      val = +val
      if (val < min) { val = min }
      if (val > max) { val = max }
      $this.val(val)
    }

    if ($this.data('oldVal') !== val) {
      $this.data('oldVal', val)
      if (onChange) { onChange(val) }
    }
  })
}

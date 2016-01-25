var stampit = require('stampit')
var Fixed2DArray = require('fixed-2d-array')
var _ = require('lodash')
var $ = require('jquery')
var Bot = require('./bot')
var randomInt = require('random-int')
var rotate = require('rotate-array')

var Landscape = stampit({
  refs: {
    trailMode: 'fade',
    spawnMode: 'random',
    isOn: true,
    collisionsAvoided: 0,
    overallBotAnxietyLevel: 20,
    bots: [],
    spawnRate: 1
  },
  init: function () {
    this.$botCounter = $('#bot-count')
    this.$collisionAvoidedCounter = $('#collisions-avoided-count')
    var initialSize = 100
    this.initialize({size: initialSize, densityPercent: this.maxDensityPercent(initialSize)})
  },
  methods: {
    initialize: function (params) {
      this.size = params.size
      this.initializeCanvas()
      this.initializeGrid()
      this.initializeSpawnParams()
      this.initializeBots(params.densityPercent)
    },
    addBot: function () {
      this.calculateNextSpawnCoords()
      var self = this
      _.times(this.spawnRate, function () {
        var bot = Bot(_.merge(self.spawnCoords, {landscape: self}))
        self.bots.push(bot)
        self.grid.set(bot.r, bot.c, bot)
        bot.render()
        self.updateBotCount()
      })
    },
    update: function () {
      switch (this.trailMode) {
        case 'none': this.clearCanvas(); break
        case 'fade':
          this.ctx.fillStyle = 'rgba(0,0,0,0.1)'
          this.ctx.fillRect(0, 0, this.size, this.size)
          break
      }
      this.removeTheDead()
      _.each(this.bots, this.updateBot.bind(this))
    },
    animate: function () {
      if (this.isOn) {
        this.update()
        requestAnimationFrame(this.animate.bind(this))
      }
    },
    toggleAnimation: function () {
      this.isOn = !this.isOn
      if (this.isOn) { this.animate() }
    },
    setSpawnMode: function (spawnMode) {
      this.initializeSpawnParams()
      this.spawnMode = spawnMode
    },
    empty: function () {
      this.initializeGrid()
      this.clearCanvas()
      this.bots = []
      this.updateBotCount()
    },
    switchBotAvoidanceAlgorithm: function () {
      Bot.fixed.refs.switchAvoidanceAlgorithm()
    },
    restart: function () {
      this.empty()
      this.initializeBots()
    },
    maxDensityPercent: function (size) {
      size = size || this.size
      var max = 800000 / Math.pow(size, 2)
      return max > 50 ? 50 : max
    },
    setAnxietyLevel: function (anxietyLevel) {
      _.each(this.bots, function (bot) {
        bot.anxietyLevel = anxietyLevel
      })
    },
    setAvoidanceAlgorithm: function (avoidanceAlgorithm) {
      _.each(this.bots, function (bot) {
        bot.avoidanceAlgorithm = avoidanceAlgorithm
      })
    },

    // private
    initializeBots: function (densityPercent) {
      this.densityPercent = densityPercent || this.maxDensityPercent()
      var numOfCells = this.size * this.size
      var numOfBots = parseInt(numOfCells * this.densityPercent / 100)
      var self = this
      _.times(numOfBots, function () { self.addBot() })
    },
    initializeCanvas: function () {
      $('#landscape').remove()
      var $canvas = $('<canvas id="landscape" width="500" height="500"></canvas>')
      $('#main-container').prepend($canvas)
      this.ctx = $canvas[0].getContext('2d')
      var scale = 500 / this.size
      this.ctx.scale(scale, scale)
    },
    initializeGrid: function () {
      this.grid = new Fixed2DArray(this.size, this.size, null)
    },
    initializeSpawnParams: function () {
      this.spawnCoords = {r: 0, c: 0}
      this.polarSpawnParams = {radius: 0, radians: 0, growing: true}
    },
    calculateNextSpawnCoords: function () {
      switch (this.spawnMode) {
        case 'random': this.spawnCoords = this.getRandCoords(); break
        case 'center': this.spawnCoords = this.getCenterCoords(); break
        case 'diagonal': this.spawnCoords = this.getNextDiagonalCoords(); break
        case 'spiral': this.spawnCoords = this.getNextSpiralCoords(); break
      }
    },
    getRandCoords: function () {
      return { r: randomInt(this.size - 1), c: randomInt(this.size - 1) }
    },
    getCenterCoords: function () {
      return { r: parseInt(this.size / 2 - 1), c: parseInt(this.size / 2 - 1) }
    },
    getNextDiagonalCoords: function () {
      var r = this.spawnCoords.r, c = this.spawnCoords.c, size = this.size
      return { r: (r + 1) % (size - 1), c: (c + 1) % (size - 1) }
    },
    getNextSpiralCoords: function () {
      var params = this.polarSpawnParams, centerCoords = this.getCenterCoords()
      var radius = params.radius, radians = params.radians, growing = params.growing

      growing ? radius += this.size / 1000 : radius -= this.size / 1000
      if (radius > (this.size / 2) - 1) { growing = false }
      if (radius < 1) { growing = true }
      radians = (radians + 0.1) % (Math.PI * 2)
      this.polarSpawnParams = { radius: radius, radians: radians, growing: growing }

      return {
        r: centerCoords.r + parseInt(radius * Math.sin(radians)),
        c: centerCoords.c + parseInt(radius * Math.cos(radians))
      }
    },
    updateBot: function (bot) {
      for (var i = 0; i < 4; i++) {
        if (bot.isAboutToCollide()) {
          bot.changeDirection()
          bot.dieSlowly()
          this.collisionsAvoided++
          this.$collisionAvoidedCounter.text(this.collisionsAvoided)
        } else {
          this.grid.set(bot.r, bot.c, null)
          bot.moveForward()
          this.grid.set(bot.r, bot.c, bot)
          break
        }
      }
      bot.render()
    },
    removeTheDead: function () {
      var deadBots = _.remove(this.bots, function (bot) { return !bot.isAlive() })
      var self = this
      _.each(deadBots, function (deadBot) {
        self.grid.set(deadBot.r, deadBot.c, null)
      })
      this.updateBotCount()
    },
    updateBotCount: function () {
      this.$botCounter.text(this.bots.length)
    },
    clearCanvas: function () {
      this.ctx.clearRect(0, 0, this.size, this.size)
    }
  }
})

module.exports = Landscape

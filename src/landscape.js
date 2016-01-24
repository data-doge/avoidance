var stampit = require('stampit')
var Fixed2DArray = require('fixed-2d-array')
var _ = require('lodash')
var $ = require('jquery')
var Bot = require('./bot')
var randomInt = require('random-int')
var rotate = require('rotate-array')

var Landscape = stampit({
  refs: {
    trailModes: ['fade', 'full', 'none'],
    ctx: $('#landscape')[0].getContext('2d'),
    isOn: true,
    thingsCanDie: true,
    collisionsAvoided: 0,
    size: 50,
    overallBotAnxietyLevel: 20,
    bots: [],
    spawnModes: ['random', 'diagonal', 'spiral'],
    spawnCoords: {r: 0, c: 0},
    polarSpawnParams: {radius: 0, radians: 0, growing: true}
  },
  init: function () {
    this.$botCounter = $('#bot-count')
    this.$collisionAvoidedCounter = $('#collisions-avoided-count')
    this.scale = 500 / this.size
    this.ctx.scale(this.scale, this.scale)
    this.grid = new Fixed2DArray(this.size, this.size, null)
    this.initializeBots()
  },
  methods: {
    addBot: function (num) {
      this.calculateNextSpawnCoords()
      var self = this
      _.times(num || 1, function () {
        var bot = Bot(_.merge(self.spawnCoords, {landscape: self}))
        self.bots.push(bot)
        self.grid.set(bot.r, bot.c, bot)
        bot.render()
        self.updateBotCount()
      })
    },
    update: function () {
      switch (this.trailMode()) {
        case 'none': this.clear(); break
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
    switchTrailMode: function () {
      this.trailModes = rotate(this.trailModes, 1)
    },
    switchSpawnMode: function () {
      this.spawnCoords = this.getCenterCoords()
      this.polarSpawnParams = {radius: 0, radians: 0}
      this.spawnModes = rotate(this.spawnModes, 1)
      console.log(this.spawnMode())
    },
    toggleExistenceOfDeath: function () {
      this.thingsCanDie = !this.thingsCanDie
    },
    empty: function () {
      this.grid = new Fixed2DArray(this.size, this.size, null)
      this.clear()
      this.bots = []
      this.updateBotCount()
    },
    switchBotAvoidanceAlgorithm: function () {
      Bot.fixed.refs.switchAvoidanceAlgorithm()
    },
    reset: function () {
      this.empty()
      this.initializeBots()
    },

    // private
    initializeBots: function () {
      this.densityPercent = this.maxDensityPercent()
      var numOfCells = this.size * this.size
      var numOfBots = parseInt(numOfCells * this.densityPercent / 100)
      Bot.fixed.refs.anxietyLevel = this.overallBotAnxietyLevel
      var self = this
      _.times(numOfBots, function () { self.addBot() })
    },
    calculateNextSpawnCoords: function () {
      switch (this.spawnMode()) {
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
          if (this.thingsCanDie) { bot.dieSlowly() }
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
    trailMode: function () {
      return this.trailModes[0]
    },
    spawnMode: function () {
      return this.spawnModes[0]
    },
    clear: function () {
      this.ctx.clearRect(0, 0, this.size, this.size)
    },
    maxDensityPercent: function () {
      var max = 800000 / Math.pow(this.size, 2)
      return max > 50 ? 50 : max
    }
  }
})

module.exports = Landscape

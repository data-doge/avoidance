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
    densityPercent: 20,
    bots: [],
    spawnModes: ['random', 'spiral', 'center', 'diagonal']
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
    addBot: function () {
      var bot = Bot(_.merge(this.getRandCoords(), {landscape: this}))
      this.bots.push(bot)
      this.grid.set(bot.r, bot.c, bot)
      bot.render()
      this.updateBotCount()
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
      this.spawnModes = rotate(this.spawnModes, 1)
    },
    toggleExistenceOfDeath: function () {
      this.thingsCanDie = !this.thingsCanDie
    },
    reset: function () {
      this.grid = new Fixed2DArray(this.size, this.size, null)
      this.clear()
      this.bots = []
      this.updateBotCount()
    },
    switchBotAvoidanceAlgorithm: function () {
      Bot.fixed.refs.switchAvoidanceAlgorithm()
    },

    // private
    initializeBots: function () {
      var numOfCells = this.size * this.size
      var numOfBots = parseInt(numOfCells * this.densityPercent / 100)
      _.times(numOfBots, this.addBot.bind(this))
    },
    getRandCoords: function () {
      return { r: randomInt(this.size - 1), c: randomInt(this.size - 1) }
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
    }
  }
})

module.exports = Landscape

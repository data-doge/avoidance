var stampit = require('stampit')
var Fixed2DArray = require('fixed-2d-array')
var _ = require('lodash')
var $ = require('jquery')
var Bot = require('./bot')
var randomInt = require('random-int')
var rotate = require('rotate-array')
var howClose = require('closeness');
var close = howClose(2.39996, 0.0174533)

var Landscape = stampit({
  init: function () {
    this.theta = 0
    this.radius = 0
    this.currentStep = 0
    this.radiusIsGrowing = true
    this.isOn = true
    this.trailModes = ['full', 'none', 'fade']
    this.thingsCanDie = true
    this.$canvas = $('<canvas></canvas>')
    this.ctx = this.$canvas[0].getContext('2d')
    this.prepareCanvas()
    this.$botCounter = $('#bot-count')
    this.$collisionAvoidedCounter = $('#collisions-avoided-count')
    this.collisionsAvoided = 0
    this.grid = new Fixed2DArray(this.height, this.width, null)
    this.bots = []
    this.initializeBots()
  },
  methods: {
    addBot: function () {
      var bot = Bot(_.merge(this.getNextSpiralCoords(), {landscape: this}))
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
          this.ctx.fillRect(0, 0, this.width * this.scale, this.height * this.scale)
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
    growSpiral: function () {
      this.updateSpiralParams()
      var newCoords = this.getNextSpiralCoords()
    },
    toggleAnimation: function () {
      this.isOn = !this.isOn
      if (this.isOn) { this.animate() }
    },
    switchTrailMode: function () {
      this.trailModes = rotate(this.trailModes, 1)
    },
    toggleExistenceOfDeath: function () {
      this.thingsCanDie = !this.thingsCanDie
    },

    // private
    prepareCanvas: function () {
      this.$canvas.attr('width', this.width * this.scale)
                  .attr('height', this.height * this.scale)
      $('body').prepend(this.$canvas)
    },
    initializeBots: function () {
      var numOfCells = this.width * this.height
      var numOfBots = parseInt(numOfCells * this.densityPercent / 100)
      _.times(numOfBots, this.addBot.bind(this))
    },
    getRandCoords: function () {
      return { r: randomInt(this.height - 1), c: randomInt(this.width - 1) }
    },
    getCenterCoords: function () {
      return {r: Math.floor(this.height / 2), c: Math.floor(this.width / 2)}
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
    clear: function () {
      this.ctx.clearRect(0,0,this.width * this.scale, this.height * this.scale)
    },
    updateSpiralParams: function () {
      this.theta += 0.0174533 * 5
      var currentStep = Math.floor(this.theta / 2.39996)
      if (currentStep !== this.currentStep) {
        this.currentStep = currentStep

        this.radiusIsGrowing ? this.radius += 2 : this.radius -= 2
        if (this.radius > this.height / 2 - 3) { this.radiusIsGrowing = false }
        if (this.radius < 3) { this.radiusIsGrowing = true }

        _.times(20, this.addBot.bind(this))
      }
    },
    getNextSpiralCoords: function () {
      var centerR = Math.floor(this.height / 2), centerC = Math.floor(this.width / 2)
      this.updateSpiralParams()
      var r = Math.floor(this.radius * Math.sin(this.theta)), c = Math.floor(this.radius * Math.cos(this.theta))
      return {r: centerR + r , c: centerC + c}
    }
  }
})

module.exports = Landscape

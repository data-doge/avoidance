var stampit = require('stampit')
var Fixed2DArray = require('fixed-2d-array')
var _ = require('lodash')
var $ = require('jquery')
var Bot = require('./bot')

var Landscape = stampit({
  init: function () {
    this.$element = $('#landscape')
    this.$botCounter = $('#bot-count')
    this.$collisionAvoidedCounter = $('#collisions-avoided-count')
    this.collisionsAvoided = 0
    this.initializeGrid()
    this.initializePotentialCoords()
    this.initializeBots()
    this.render()
  },
  methods: {
    initializeGrid: function () {
      this.grid = new Fixed2DArray(this.height, this.width, null)
    },
    initializePotentialCoords: function () {
      this.potentialCoords = []
      var self = this
      _.times(self.height, function (r) {
        _.times(self.width, function (c) {
          self.potentialCoords.push({r: r, c: c})
        })
      })
    },
    initializeBots: function () {
      var self = this;
      var numOfBots = parseInt(self.potentialCoords.length * this.densityPercent / 100);
      var activeCoords = _.take(_.shuffle(self.potentialCoords), numOfBots);
      this.bots = []
      _.each(activeCoords, function (coord) {
        self.addBot({c: coord.c, r: coord.r});
      });
    },
    addBot: function (params) {
      var self = this;
      params = params || _.sample(this.potentialCoords);
      var bot = new Bot(_.merge(params, {scale: this.scale}));
      bot.landscape = this;
      this.bots.push(bot)
      this.grid.set(bot.r, bot.c, bot)
      bot.render();
      this.$botCounter.text(this.bots.length);
    },
    updatePositionFor: function (bot) {
      for (var i = 0; i < 4; i++) {
        if (bot.isAboutToCollide()) {
          bot.changeDirection();
          if (bot.isAlive()) {
            bot.dieSlowly();
          }
          this.collisionsAvoided++;
          this.$collisionAvoidedCounter.text(this.collisionsAvoided);
        } else {
          this.grid.set(bot.r, bot.c, null)
          bot.moveForward();
          this.grid.set(bot.r, bot.c, bot)
          break;
        }
      }
    },
    render: function () {
      this.$element.css({
        width: this.width * this.scale,
        height: this.height * this.scale,
      });
    },
    updateFrame: function () {
      var self = this;
      _.each(this.bots, function (bot) {
        self.updatePositionFor(bot);
      });
    }
  }
})

module.exports = Landscape

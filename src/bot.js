var stampit = require('stampit')
var _ = require('lodash')
var $ = require('jquery')
var rotate = require('rotate-array')
var randomInt = require('random-int')

var Bot = stampit({
  refs: {
    avoidanceAlgorithm: 'right',
    anxietyLevel: 20,
    colors: ["#F6F792", "#77C4D3", "#DAEDE2", "#EA2E49", "#FFFFFF"]
  },
  init: function () {
    this.directions = rotate(['up', 'right', 'down', 'left'], randomInt(3))
    this.radius = 0.5
    this.color = _.sample(this.colors)
  },
  methods: {
    render: function () {
      var ctx = this.landscape.ctx
      var x = this.r + 0.5
      var y = this.c + 0.5
      ctx.fillStyle = this.color
      ctx.beginPath()
      ctx.arc(x, y, this.radius, 0, 2 * Math.PI)
      ctx.fill()
    },
    isAboutToCollide: function () {
      var coords = this.nextCoords(), landscape = this.landscape
      return !_.inRange(coords.r, landscape.size) ||
             !_.inRange(coords.c, landscape.size)  ||
             landscape.grid.get(coords.r, coords.c)
    },
    changeDirection: function () {
      switch (this.avoidanceAlgorithm) {
        case 'right': this.directions = rotate(this.directions, 3); break;
        case 'left': this.directions = rotate(this.directions, 1); break;
        case 'back': this.directions = rotate(this.directions, 2); break;
        case 'random': this.directions = _.shuffle(this.directions); break;
      }
    },
    isAlive: function () {
      return this.radius > 0.1
    },
    dieSlowly: function () {
      this.radius -= 0.0002 * this.anxietyLevel
    },
    moveForward: function () {
      var coords = this.nextCoords()
      this.c = coords.c
      this.r = coords.r
    },

    // private
    currentDirection: function () {
      return this.directions[0]
    },
    nextCoords: function () {
      var dc = 0, dr = 0
      switch (this.currentDirection()) {
        case 'up':    dr = -1; break
        case 'right': dc =  1; break
        case 'down':  dr =  1; break
        case 'left':  dc = -1; break
      }
      return {c: this.c + dc, r: this.r + dr}
    }
  }
})

module.exports = Bot

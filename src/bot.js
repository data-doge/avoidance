var stampit = require('stampit')
var _ = require('lodash')
var $ = require('jquery')
var rotate = require('rotate-array')
var randomInt = require('random-int')

var Bot = stampit({
  refs: {
    colors: ["#F6F792", "#77C4D3", "#DAEDE2", "#EA2E49", "#FFFFFF"]
  },
  init: function () {
    this.directions = rotate(['up', 'right', 'down', 'left'], randomInt(3))
    this.scale = this.landscape.scale
    this.radius = this.scale / 2
    this.color = _.sample(this.colors)
  },
  methods: {
    render: function () {
      var ctx = this.landscape.ctx
      var x = this.r * this.scale + this.scale / 2
      var y = this.c * this.scale + this.scale / 2
      ctx.fillStyle = this.color
      ctx.beginPath()
      ctx.arc(x, y, this.radius, 0, 2 * Math.PI)
      ctx.fill()
    },
    isAboutToCollide: function () {
      var coords = this.nextCoords(), landscape = this.landscape
      return !_.inRange(coords.r, landscape.height) ||
             !_.inRange(coords.c, landscape.width)  ||
             landscape.grid.get(coords.r, coords.c)
    },
    changeDirection: function () {
      // this.directions = rotate(this.directions, 1)
      // this.directions = rotate(this.directions, 2)
      // this.directions = rotate(this.directions, 3)
      this.directions = _.shuffle(this.directions)
    },
    isAlive: function () {
      return this.radius > 0.5
    },
    dieSlowly: function () {
      this.radius -= 0.1
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

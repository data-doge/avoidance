var stampit = require('stampit')
var _ = require('lodash')
var $ = require('jquery')
var rotate = require('rotate-array')
var randomInt = require('random-int')

var Bot = stampit({
  init: function () {
    this.directions = rotate(['up', 'right', 'down', 'left'], randomInt(3))
    this.size = this.scale
    this.$element = $('<div class="bot"></div>').css({
      width: this.size,
      height: this.size,
      top: this.r * this.scale,
      left: this.c * this.scale,
      background: _.sample(["#F6F792", "#77C4D3", "#DAEDE2", "#EA2E49", "#FFFFFF"])
    })
  },
  methods: {
    render: function () {
      this.landscape.$element.append(this.$element)
    },
    currentDirection: function () {
      return this.directions[0]
    },
    changeDirection: function () {
      this.directions = rotate(this.directions, 1)
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
    },
    isAboutToCollide: function () {
      var coords = this.nextCoords(), landscape = this.landscape
      return !_.inRange(coords.r, landscape.height) ||
             !_.inRange(coords.c, landscape.width)  ||
             landscape.grid.get(coords.r, coords.c)
    },
    dieSlowly: function () {
      this.size -= 0.01
      this.$element.css({
        width: this.size,
        height: this.size,
        "border-width": this.scale - this.size
      })
    },
    isAlive: function () {
      return this.size > 3.0
    },
    moveForward: function () {
      var coords = this.nextCoords()
      this.c = coords.c
      this.r = coords.r
      this.$element.css({
        top: this.r * this.scale,
        left: this.c * this.scale
      })
    },
  }
})

module.exports = Bot

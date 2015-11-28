function Bot (params) {
  this.c = params.c;
  this.r = params.r;
  this.directions = ['up', 'right', 'down', 'left'];
  this.initializeDirection(params.direction || _.sample(this.directions));
  this.scale = params.scale || 2;
  this.$element = $('<div class="bot"></div>').css({
    width: this.scale,
    height: this.scale,
    top: this.r,
    left: this.c,
    background: _.sample(["#F6F792", "#77C4D3", "#DAEDE2", "#EA2E49", "#FFFFFF"])
  });
}

Bot.prototype.initializeDirection = function (direction) {
  while (this.currentDirection() !== direction) {
    this.changeDirection();
  }
};

Bot.prototype.currentDirection = function () {
  return this.directions[0];
};

Bot.prototype.changeDirection = function () {
  this.directions.rotate();
};

Bot.prototype.nextCoords = function () {
  var dc = 0;
  var dr = 0;
  switch (this.currentDirection()) {
    case 'up':    dr = -1; break;
    case 'right': dc =  1; break;
    case 'down':  dr =  1; break;
    case 'left':  dc = -1; break;
  }
  return {c: this.c + dc, r: this.r + dr};
};

Bot.prototype.isAboutToCollide = function () {
  var coords = this.nextCoords();
  return !_.inRange(coords.r, this.landscape.height) ||
         !_.inRange(coords.c, this.landscape.width)  ||
         this.landscape.grid[coords.r][coords.c]
};

Bot.prototype.moveForward = function () {
  var coords = this.nextCoords();
  this.c = coords.c;
  this.r = coords.r;
  this.$element.css({
    top: this.r * this.scale,
    left: this.c * this.scale
  });
};

Bot.prototype.render = function () {
  this.landscape.$element.append(this.$element);
};

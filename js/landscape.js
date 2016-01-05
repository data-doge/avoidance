function Landscape (params) {
  this.height = params.height;
  this.width = params.width;
  this.densityPercent = params.densityPercent;
  this.scale = params.scale || 1;
  this.$element = $('#landscape');
  this.$botCounter = $('#bot-count');
  this.$collisionAvoidedCounter = $('#collisions-avoided-count');
  this.collisionsAvoided = 0;
  this.initializeGrid();
  this.initializePotentialCoords();
  this.initializeBots();
  this.render();
}

Landscape.prototype.initializeGrid = function () {
  this.grid = _.map(new Array(this.height), function () {
    return new Array(this.width);
  });
};

Landscape.prototype.initializePotentialCoords = function () {
  this.potentialCoords = [];
  var self = this;
  _.times(self.height, function (r) {
    _.times(self.width, function (c) {
      self.potentialCoords.push({r: r, c: c});
    });
  });
};

Landscape.prototype.initializeBots = function () {
  var self = this;
  var numOfBots = parseInt(self.potentialCoords.length * this.densityPercent / 100);
  var activeCoords = _.take(_.shuffle(self.potentialCoords), numOfBots);
  this.bots = []
  _.each(activeCoords, function (coord) {
    self.addBot({c: coord.c, r: coord.r});
  });
};

Landscape.prototype.addBot = function (params) {
  var self = this;
  params = params || _.sample(this.potentialCoords);
  var bot = new Bot(_.merge(params, {scale: this.scale}));
  bot.landscape = this;
  this.bots.push(bot)
  this.grid[bot.r][bot.c] = bot
  bot.render();
  this.$botCounter.text(this.bots.length);
};

Landscape.prototype.updatePositionFor = function (bot) {
  for (var i = 0; i < 4; i++) {
    if (bot.isAboutToCollide()) {
      bot.changeDirection();
      if (bot.isAlive()) {
        console.log('callled')
        bot.dieSlowly();
      }
      this.collisionsAvoided++;
      this.$collisionAvoidedCounter.text(this.collisionsAvoided);
    } else {
      this.grid[bot.r][bot.c] = null;
      bot.moveForward();
      this.grid[bot.r][bot.c] = bot;
      break;
    }
  }
};

Landscape.prototype.render = function () {
  this.$element.css({
    width: this.width * this.scale,
    height: this.height * this.scale,
  });
};

Landscape.prototype.updateFrame = function () {
  var self = this;
  _.each(this.bots, function (bot) {
    self.updatePositionFor(bot);
  });
};

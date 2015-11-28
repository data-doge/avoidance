function Landscape (params) {
  this.height = params.height;
  this.width = params.width;
  this.densityPercent = params.densityPercent;
  this.$element = $('#landscape');
  this.initializeGrid();
  this.initializeBots();
  this.render();
}

Landscape.prototype.initializeGrid = function () {
  this.grid = _.map(new Array(this.height), function () {
    return new Array(this.width);
  });
};

Landscape.prototype.initializeBots = function () {
  var allCoords = [];
  var self = this;
  _.times(self.height, function (r) {
    _.times(self.width, function (c) {
      allCoords.push({r: r, c: c});
    });
  });

  var numOfBots = parseInt(allCoords.length * this.densityPercent / 100);
  var activeCoords = _.take(_.shuffle(allCoords), numOfBots);

  this.bots = []
  var self = this;
  _.each(activeCoords, function (coord) {
    self.addBot({c: coord.c, r: coord.r});
  });
};

Landscape.prototype.addBot = function (params) {
  var bot = new Bot(params);
  bot.landscape = this;
  this.bots.push(bot)
  this.grid[bot.r][bot.c] = bot
};

Landscape.prototype.updatePositionFor = function (bot) {
  for (var i = 0; i < 4; i++) {
    if (bot.isAboutToCollide()) {
      bot.changeDirection();
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
    width: this.width,
    height: this.height
  });
  _.each(this.bots, function (bot) {
    bot.render();
  });
};

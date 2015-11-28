require 'byebug'

class Landscape
  attr_reader :height, :width, :bots
  attr_accessor :grid

  def initialize(width:, height:)
    @width = width
    @height = height
    @bots = []
    @grid = Array.new(height) { Array.new(width) }
  end

  def add_bot(bot)
    @bots << bot
    @grid[bot.y][bot.x] = bot
  end

  def update_position_for(bot)
    4.times do
      if bot.is_about_to_collide?
        bot.change_direction!
      else
        @grid[bot.y][bot.x] = nil
        bot.move_forward!
        @grid[bot.y][bot.x] = bot
        break
      end
    end
  end

  def prepare_frame
    @bots.each do |bot|
      update_position_for(bot)
    end
  end

  def render_frame
    system('clear')
    @grid.each do |row|
      print "|"
      row.each { |bot| print (bot ? "X|" : " |") }
      puts
    end
  end
end

class Bot
  attr_reader :x, :y, :landscape

  def initialize(direction: "right", x: 0, y: 0, landscape:)
    @speed = 1
    @x = x
    @y = y
    @landscape = landscape
    @directions = ["up", "right", "down", "left"]
  end

  def next_coords
    dx, dy = 0, 0
    case current_direction
      when "up" then dy = -1
      when "right" then dx = 1
      when "down" then dy = 1
      when "left" then dx = -1
    end
    {x: @x + dx, y: @y + dy}
  end

  def change_direction!
    @directions.rotate!
  end

  def current_direction
    @directions.first
  end

  def is_about_to_collide?
    x = next_coords[:x]
    y = next_coords[:y]
    y > @landscape.height - 1 || y < 0 || x > @landscape.width - 1 || x < 0
  end

  def move_forward!
    @x = next_coords[:x]
    @y = next_coords[:y]
  end
end

landscape = Landscape.new(width: 50, height: 50)
bot = Bot.new(x: 5, y: 5, landscape: landscape)
landscape.add_bot(bot)
bot = Bot.new(x: 4, y: 2, landscape: landscape)
landscape.add_bot(bot)

while true
  # byebug
  landscape.render_frame
  landscape.prepare_frame
  sleep(0.05)
end

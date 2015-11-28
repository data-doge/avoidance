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
    @grid[bot.r][bot.c] = bot
  end

  def update_position_for(bot)
    4.times do
      if bot.is_about_to_collide?
        bot.change_direction!
      else
        @grid[bot.r][bot.c] = nil
        bot.move_forward!
        @grid[bot.r][bot.c] = bot
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
      row.each { |bot| print (bot ? "#{bot.marker}|" : " |") }
      puts
    end
  end
end

class Bot
  attr_reader :c, :r, :landscape, :marker

  def initialize(params = {})
    @speed = 1
    @c = params[:c] || 0
    @r = params[:r] || 0
    @landscape = params[:landscape]
    @marker = params[:marker] || "X"
    @directions = ["up", "right", "down", "left"]
    direction = params[:direction] || @directions.sample
    change_direction! until current_direction == direction
  end

  def next_coords
    dc, dr = 0, 0
    case current_direction
      when "up" then dr = -1
      when "right" then dc = 1
      when "down" then dr = 1
      when "left" then dc = -1
    end
    {c: @c + dc, r: @r + dr}
  end

  def change_direction!
    @directions.rotate!
  end

  def current_direction
    @directions.first
  end

  def is_about_to_collide?
    c = next_coords[:c]
    r = next_coords[:r]
    r > @landscape.height - 1 || r < 0 || c > @landscape.width - 1 || c < 0 || @landscape.grid[r][c]
  end

  def move_forward!
    @c = next_coords[:c]
    @r = next_coords[:r]
  end
end

landscape = Landscape.new(width: 50, height: 50)
coords = []
landscape.height.times do |r|
  landscape.width.times do |c|
    coords << {r: r, c: c}
  end
end

markers = ("A".."Z").to_a
coords.shuffle.first(500).each do |coord|
  bot = Bot.new(c: coord[:c], r: coord[:r], marker: markers.sample, landscape: landscape)
  landscape.add_bot(bot)
end

while true
  # byebug
  landscape.render_frame
  landscape.prepare_frame
  sleep(0.05)
end

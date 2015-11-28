require_relative "bot.rb"

class Landscape
  attr_reader :height, :width, :bots
  attr_accessor :grid

  def initialize(width:, height:, density_percent: 20)
    @width = width
    @height = height
    @density_percent = density_percent
    initialize_grid
  end

  def initialize_grid
    @bots = []
    @grid = Array.new(@height) { Array.new(@width) }
    coords = []
    markers = ("A".."Z").to_a
    @height.times { |r| @width.times { |c| coords << {r: r, c: c} } }
    num_of_bots = (coords.length * @density_percent / 100.0).to_i
    coords.shuffle.first(num_of_bots).each do |coord|
      add_bot(c: coord[:c], r: coord[:r], marker: markers.sample, algorithm: "right")
    end
  end

  def add_bot(params)
    bot = Bot.new(params)
    bot.landscape = self
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
    @bots.each { |bot| update_position_for(bot) }
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

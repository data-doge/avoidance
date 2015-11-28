class Bot
  attr_reader :c, :r, :marker
  attr_accessor :landscape

  def initialize(params = {})
    @c = params[:c] || 0
    @r = params[:r] || 0
    @marker = params[:marker] || "X"
    @directions = ["up", "right", "down", "left"]
    @algorithm = params[:algorithm] || "right"
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
    case @algorithm
    when "right" then @directions.rotate!
    when "random" then @directions.shuffle!
    end
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

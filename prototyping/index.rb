require_relative "landscape.rb"

landscape = Landscape.new(width: 50, height: 50, density_percent: 10)

loop do
  landscape.render_frame
  landscape.prepare_frame
  sleep(0.04)
end

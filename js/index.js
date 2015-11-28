$(document).ready(function () {

  var landscape = new Landscape({width: 200, height: 200, densityPercent: 0});

  $(document).on('keypress', function (e) {
    e.preventDefault();
    landscape.addBot(null);
  });

  function update () {
    landscape.updateFrame();
    window.requestAnimationFrame(update);
  }
  window.requestAnimationFrame(update);
});

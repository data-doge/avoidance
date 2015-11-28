$(document).ready(function () {

  var landscape = new Landscape({width: 50, height: 50, densityPercent: 5, scale: 10});

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

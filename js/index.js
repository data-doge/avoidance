$(document).ready(function () {

  var landscape = new Landscape({width: 300, height: 300, densityPercent: 3});

  function update () {
    landscape.updateFrame();
    window.requestAnimationFrame(update);
  }
  window.requestAnimationFrame(update);
});

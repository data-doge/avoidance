$(document).ready(function () {
  function update () {
    window.requestAnimationFrame(update);
  }
  window.requestAnimationFrame(update);
});

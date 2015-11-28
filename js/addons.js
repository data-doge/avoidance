Array.prototype.rotate = (function() {
  var unshift = Array.prototype.unshift,
  splice = Array.prototype.splice;

  return function() {
    var len = this.length >>> 0,
    count = 1;

    unshift.apply(this, splice.call(this, count % len, len));
    return this;
  };
})();

var degtorad = Math.PI/180;
var timeCount = 0;

window.onload = function() {
  // view stuff
  var container = $(".vine-sketch-container");
  var vine = new VineRenderer({
    container: container,
    pointCount: 100
  });
  requestAnimationFrame(animate);

  // svg stuff
  var path = Snap("#vine-path");
  var pathLength = Snap.path.getTotalLength(path);

  var offset = path.getPointAtLength(pathLength);
  var maxTime = pathLength / vine.ropeLength;
  
  function animate() {
    timeCount += 0.01;
    if (timeCount > maxTime) {
      timeCount = maxTime;
      return;
    }
    vine.updatePoints(function(points) {
      for (var i = 0; i < vine.pointCount; i++) {
        var pos = (vine.ropeLength / vine.pointCount * (i * timeCount));
        if (pos < pathLength) {
          var point = path.getPointAtLength(pathLength - pos);
          TweenLite.to(points[i], 0, {x: vine.width / 2 + (point.x - offset.x), y: vine.height - (point.y - offset.y)});
        }
      }
    });
    vine.render();
    requestAnimationFrame(animate);
  }
}

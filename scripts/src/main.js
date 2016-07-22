$(document).ready(function() {
  // vine stuff
  var container = $(".vine-container");
  var vine = new VineRenderer({
    container: container,
    pointCount: 100
  });

  // svg stuff
  var path = Snap("#vine-path");
  var pathLength = Snap.path.getTotalLength(path);
  var offset = path.getPointAtLength(pathLength);

  // animation stuff
  var maxTime = pathLength / vine.ropeLength;
  var tweenState = { time: 0 };
  
  var tween = TweenMax.to(tweenState, 3, {time: maxTime, onUpdate: onUpdate});

  function onUpdate() {
    vine.updatePoints(function(points) {
      for (var i = 0; i < vine.pointCount; i++) {
        var pos = (vine.ropeLength / vine.pointCount * (i * tweenState.time));
        if (pos < pathLength) {
          var point = path.getPointAtLength(pathLength - pos);
          points[i].x = vine.width / 2 + (point.x - offset.x);
          points[i].y = vine.height - (point.y - offset.y);
        }
      }
    });
    vine.render();
  }

  // scrollmagic
  var controller = new ScrollMagic.Controller({
    globalSceneOptions: {
      triggerHook: 'onLeave'
    }
  });
  var firstRow = document.querySelector(".row");
  var scene = new ScrollMagic.Scene({
      triggerElement: firstRow,
      duration: $(firstRow).height()
    })
    .setTween(tween)
    .setPin($(firstRow).find('.pinnable').get(0))
    .addTo(controller);
});

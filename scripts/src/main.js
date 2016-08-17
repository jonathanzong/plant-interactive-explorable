$(document).ready(function() {

  /***** scrollmagic *****/
  var controller = new ScrollMagic.Controller();
  // pin text
  $('.layer--content__text p, .js-content-pinnable').each(function(i, d) {
    new ScrollMagic.Scene({
      triggerElement: d,
      offset: 100,
      duration: i == 0 ? '35%' : '70%'
    })
    .setPin(d)
    .addTo(controller);
  });
  // pin overlays
  $('.layer--overlay').each(function(i, d) {
    new ScrollMagic.Scene({
      triggerElement: d,
      triggerHook: 'onLeave'
    })
    .setPin(d)
    .addTo(controller);
  });
  // trigger scene changes
  $('.js-scene-trigger').each(function(i, d) {
    new ScrollMagic.Scene({
      triggerElement: d,
      triggerHook: 'onLeave'
    })
    .setClassToggle(d, 'active')
    .on('enter leave', function() {
      var elem = $('.js-scene-trigger.active').last().get(0) || $('.js-scene-trigger').first().get(0);
      var idx = $(elem).data('index');
      $('.layer--overlay').removeClass('active');
      $('.js-layer-' + idx).addClass('active');
    })
    .addTo(controller);
  });
  
  /***** vine things *****/
  var container = $(".vine-container").get(0);
  var vine = new VineRenderer({
    container: container,
    pointCount: 100
  });

  var maxPathLength = 0;

  var snakeStates = [];

  $('.vine-path-scene2').each(function(i, elem) {
    var path = Snap(elem);
    var pathLength = Snap.path.getTotalLength(path);
    var offset = path.getPointAtLength(pathLength);

    snakeStates.push({
      path: path,
      pathLength: pathLength,
      offset: offset
    });

    vine.addSnake();

    if (pathLength > maxPathLength) maxPathLength = pathLength;
  });

  // animation stuff
  var maxTime = maxPathLength / vine.ropeLength;
  var tweenState = { time: 0 };
  
  var tween = TweenMax.to(tweenState, 3, {time: maxTime, onUpdate: onUpdate});

  new ScrollMagic.Scene({
      triggerElement: $('.vine-trigger').get(0),
      triggerHook: 'onLeave',
      duration: $('.vine-trigger').closest('section').height()
    })
    .setTween(tween)
    .setClassToggle(container, 'active')
    .addTo(controller);

  function onUpdate() {
    for (var i = 0; i < snakeStates.length; i++) {
      var state = snakeStates[i];
      vine.updatePoints(i, function(points) {
        for (var i = 0; i < vine.pointCount; i++) {
          var pos = (vine.ropeLength / vine.pointCount * (i * tweenState.time));
          if (pos < state.pathLength) {
            var point = state.path.getPointAtLength(pos);
            points[i].x = vine.width / 2 + (point.x - state.offset.x);
            points[i].y = vine.height - (point.y - state.offset.y);
          }
        }
      });  
    }
    
    vine.render();
  }
});

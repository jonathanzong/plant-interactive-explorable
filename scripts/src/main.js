$(document).ready(function() {

  /***** scrollmagic *****/
  var controller = new ScrollMagic.Controller();
  // pin text
  $('.layer--content__text p, .js-content-pinnable').each(function(i, d) {
    new ScrollMagic.Scene({
      triggerElement: d,
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
      $('.js-layer').removeClass('active');
      $('.js-layer--' + idx).addClass('active');
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

  var vineStates = [];

  $('.vine-path-scene2').each(function(i, elem) {
    var path = Snap(elem);
    var pathLength = Snap.path.getTotalLength(path);
    var offset = path.getPointAtLength(pathLength);

    vineStates.push({
      path: path,
      pathLength: pathLength,
      offset: offset
    });

    vine.addVine();

    if (pathLength > maxPathLength) maxPathLength = pathLength;
  });

  // animation stuff
  var maxTime = maxPathLength / vine.ropeLength;
  var tweenState = { time: 0 };

  var tween = TweenMax.to(tweenState, 3, {time: maxTime, onUpdate: onUpdate});

  new ScrollMagic.Scene({
      triggerElement: $('.js-vine-trigger').get(0),
      triggerHook: 'onEnter',
      duration: $('.js-vine-trigger').closest('animate').height()
    })
    .setTween(tween)
    .on('enter', function() {
      $(container).addClass('active');
    })
    /*.setClassToggle(container, 'active')*/
    .addTo(controller);


  new ScrollMagic.Scene({
      triggerElement: $('.js-vine-kill').get(0),
      triggerHook: 'onEnter',
      duration: 0
    })
    .on('enter', function() {
      $(container).removeClass('active');
    })
    .addTo(controller);



  function onUpdate() {
    if (!$(container).hasClass('active')) return;

    for (var i = 0; i < vineStates.length; i++) {
      var state = vineStates[i];
      vine.updatePoints(i, function(points) {
        for (var i = 0; i < vine.pointCount; i++) {
          var pos = (vine.ropeLength / vine.pointCount * (i * tweenState.time * state.pathLength/maxPathLength));
          if (pos < state.pathLength) {
            var point = state.path.getPointAtLength(pos);
            points[i].x = point.x/0.5;
            points[i].y = point.y/0.5;
          }
        }
      });
    }

    vine.render();
  }


});

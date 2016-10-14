$(document).ready(function() {

  /***** scrollmagic *****/
  var controller = new ScrollMagic.Controller();
  // pin text
  $('.layer--content__text p, .js-content-pinnable').each(function(i, d) {
    new ScrollMagic.Scene({
      triggerElement: d,
      triggerHook: 0.2,
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
  var vineStates = {};
  var tweenState = {};

  function initializeVine(sceneID){

    if(vineStates[sceneID]) return;

    vineStates[sceneID] = [];
    $('.vine-path-scene'+sceneID).each(function(i, elem) {
      var path = Snap(elem);
      var pathLength = Snap.path.getTotalLength(path);

      vineStates[sceneID].push({
        path: elem,
        pathLength: pathLength,
      });
    });

    tweenState[sceneID] = { time: 0 };
  }

  var durationValue = 0;
  function getDuration () {
    return durationValue;
  }
  function updateDuration () {
    durationValue = $('.js-vine-trigger').closest('animate').height();
  }

  $('.js-vine-trigger').each(function(i, d) {

    var sceneID = $(d).data('scene');
    var scene_duration = $(d).data('time');

    initializeVine(sceneID);

    new ScrollMagic.Scene({
        triggerElement: d,
        triggerHook: 'onEnter',
        duration: getDuration
      })
      .setTween(tweenState[sceneID], {time: scene_duration})
      .on('enter', function() {
        $('.vine-container').addClass('active');
        $('[class$="'+sceneID+'"]').addClass('active');
        updateDuration();
      })
      .on('progress', function(){
        onUpdate(sceneID);
      })
      .addTo(controller);
 });


  // this kills the vine, while retaining reverse behavior
  // so if you scroll up, it shows you the previous vine scene
  $('.js-vine-kill').each(function(i, d) {

    var sceneID = $(d).data('scene');

    new ScrollMagic.Scene({
        triggerElement: d,
        triggerHook: 'onCenter',
        duration: 0.1
      })
      .on('enter', function() {
        $('.vine-container').toggleClass('active');

        // when leaving a scene, remember to set lengths of objects to zero
        for (var i = 0; i < vineStates[sceneID].length; i++) {
          var state = vineStates[sceneID][i];
          state.path.style.strokeDasharray = [0, state.pathLength].join(' ');
        }

        $('.leaf-scene'+sceneID).each(function(i, d) {
          TweenLite.set(d, {
            scaleX: 0,
            scaleY: 0,
          });
        });

      })
      .addTo(controller);
  });

  function onUpdate(sceneID) {
    if (!$('.vine-container').hasClass('active')) return;

    var tween = tweenState[sceneID];

    // loop over all vines in scene
    for (var i = 0; i < vineStates[sceneID].length; i++) {
      var state = vineStates[sceneID][i];
      // setting the length of the vine
      state.path.style.strokeDasharray = [state.pathLength * tween.time, state.pathLength].join(' ');

      // leaf stuff
      var numLeaves = $('.leaf-scene'+sceneID).length;
      var step = 1 / numLeaves;
      $('.leaf-scene'+sceneID).each(function(i, d) {
        if (tween.time > step * i) {
          var point = state.path.getPointAtLength(state.pathLength * step * i);
          var point2 = state.path.getPointAtLength(state.pathLength * step * i - 1);
          TweenLite.set(d, {
            x: point.x,
            y: point.y,
            scaleX: tween.time * 6 + 3,
            scaleY: tween.time * 6 + 3,
            // scaleX: 1,
            // scaleY: 1,
            rotation: (i % 2 == 0 ? 1 : -1) * 60 + Math.atan2(point.y - point2.y, point.x - point2.x) * 180 / Math.PI,
            fill: `rgb(0, ${(110 + 50 * step * i)}, 0)`
          });
        } else {
          TweenLite.set(d, {
            scaleX: 0,
            scaleY: 0,
          });
        }
      });
    }


  }

});

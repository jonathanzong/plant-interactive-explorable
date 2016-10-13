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
  var container = $('.vine-container').get(0);
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
        $(container).addClass('active')
        $(container).children().removeClass('active');
        $('[class$="'+sceneID+'"]').addClass('active');
        updateDuration();
      })
      .on('progress', function(){
        onUpdate(sceneID);
      })
      /*.setClassToggle(container, 'active')*/
      .addTo(controller);
 });


  // this kills the vine, while retaining reverse behavior
  // so if you scroll up, it shows you the previous vine scene
  $('.js-vine-kill').each(function(i, d) {

    new ScrollMagic.Scene({
        triggerElement: d,
        triggerHook: 'onCenter',
        duration: 0.1
      })
      .on('enter', function() {
        $(container).toggleClass('active');
        $(container).children().removeClass('active');
      })
      .addTo(controller);
  });

  function onUpdate(sceneID) {
    if (!$(container).hasClass('active')) return;

    var tween = tweenState[sceneID];

    for (var i = 0; i < vineStates[sceneID].length; i++) {
      var state = vineStates[sceneID][i];
      state.path.style.strokeDasharray = [state.pathLength * tween.time, state.pathLength].join(' ');
    }

    TweenLite.set($('.leaf-scene'+sceneID), {
      x: 500,
      y: 500,
      scaleX: tween.time * 2,
      scaleY: tween.time * 2,
      // rotation: Math.random() * 180 - 180,
    });
  }

});

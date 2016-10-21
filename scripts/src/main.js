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

  function initializeScene(sceneID){

    if(vineStates[sceneID]) return;

    vineStates[sceneID] = [];
    $('.vine-scene'+sceneID).each(function(i, scene) {
      $(scene).children('.vine-path').each(function(i, vine) {
        var path = Snap(vine);
        var pathLength = Snap.path.getTotalLength(path);
        var leaves = [];
        $(scene).children('.leaf').each(function(i, leaf) {
          var t = $(leaf).data('time') || 1;
          var point = vine.getPointAtLength(pathLength * t);
          var point2 = vine.getPointAtLength(pathLength * t);
          var leafState = {
            elem: leaf,
            x: point.x,
            y: point.y,
            t: t,
            scaleX: 0,
            scaleY: 0,
            rotation: (i % 2 == 0 ? 1 : -1) * 60 + Math.atan2(point.y - point2.y, point.x - point2.x) * 180 / Math.PI,
            fill: `rgb(0, ${Math.random() * 100 + 110}, 0)`
          };
          leaves.push(leafState);
          TweenLite.set(leaf, {
            x: leafState.x,
            y: leafState.y,
            rotation: leafState.rotation,
            fill: leafState.fill
          });
        });
        vineStates[sceneID].push({
          elem: vine,
          pathLength: pathLength,
          leaves: leaves
        });
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

    initializeScene(sceneID);

    new ScrollMagic.Scene({
        triggerElement: d,
        triggerHook: 'onEnter',
        duration: getDuration
      })
      .setTween(tweenState[sceneID], {time: scene_duration})
      .on('enter', function() {
        $(container).addClass('active');
        
        $(container).removeClass(function(i, classes) {
          // remove classes prefixed by 'scene'
          var matches = classes.match(/\bscene\S+/ig);
          return (matches) ? matches.join(' ') : '';
        });
        $(container).addClass('scene'+sceneID);

        $(container).children().removeClass('active');
        $('.vine-scene'+sceneID).addClass('active');

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

    // loop over all vines in scene
    for (var i = 0; i < vineStates[sceneID].length; i++) {
      var vineState = vineStates[sceneID][i];
      // setting the length of the vine
      vineState.elem.style.strokeDasharray = [vineState.pathLength * tween.time, vineState.pathLength].join(' ');

      // PATH TWEEN EXPERIMENTS
      TweenMax.fromTo(vineState.elem, 3, {
        attr: {d: $(vineState.elem).data('d')}
      }, {
        attr: {d: $(vineState.elem).data('d2')},
        onComplete: function(o) {
          o.style.strokeDasharray = [vineState.pathLength * tween.time, vineState.pathLength].join(' ');
        },
        yoyo:true,
        repeat: -1
      });

      // loop over all leaves of a vine
      for (var j = 0; j < vineState.leaves.length; j++) {
        var leafState = vineState.leaves[j];
        if (tween.time > leafState.t) {
          TweenLite.set(leafState.elem, {
            scaleX: tween.time * 3 + 3,
            scaleY: tween.time * 3 + 3,
          });
        } else {
          TweenLite.set(leafState.elem, {
            scaleX: 0,
            scaleY: 0,
          });
        }
      }
    }
    
  }

});

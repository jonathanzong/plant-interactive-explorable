// $(document).ready(function() {
//   // vine stuff
//   var container = $(".vine-container");
//   var vine = new VineRenderer({
//     container: container,
//     pointCount: 100
//   });

//   // svg stuff
//   var path = Snap("#vine-path");
//   var pathLength = Snap.path.getTotalLength(path);
//   var offset = path.getPointAtLength(pathLength);

//   // animation stuff
//   var maxTime = pathLength / vine.ropeLength;
//   var tweenState = { time: 0 };
  
//   var tween = TweenMax.to(tweenState, 3, {time: maxTime, onUpdate: onUpdate});

//   function onUpdate() {
//     vine.updatePoints(function(points) {
//       for (var i = 0; i < vine.pointCount; i++) {
//         var pos = (vine.ropeLength / vine.pointCount * (i * tweenState.time));
//         if (pos < pathLength) {
//           var point = path.getPointAtLength(pathLength - pos);
//           points[i].x = vine.width / 2 + (point.x - offset.x);
//           points[i].y = vine.height - (point.y - offset.y);
//         }
//       }
//     });
//     vine.render();
//   }

//   // scrollmagic
//   var controller = new ScrollMagic.Controller({
//     globalSceneOptions: {
//       triggerHook: 'onLeave'
//     }
//   });
//   var firstRow = document.querySelector(".row");
//   var contentScene = new ScrollMagic.Scene({
//       triggerElement: firstRow,
//       duration: $(firstRow).height()
//     })
//     .setTween(tween)
//     .setPin($(firstRow).find('.pinnable').get(0))
//     .addTo(controller);

//   function resizeHandler() {
//     var rowHeight = $(firstRow).height();
//     $('.overlay').height(rowHeight); // lol ffs
//     $('.text-content').height(rowHeight);
//   }
//   $(window).resize(resizeHandler);
//   $(document).ready(resizeHandler);
// });

$(document).ready(function() {
  var controller = new ScrollMagic.Controller();
  $('.layer--content__text p').each(function(i, d) {
    new ScrollMagic.Scene({
      triggerElement: d,
      duration: 200,
      offset: 100
    })
    .setPin(d)
    .setClassToggle(d, 'js-scrollmagic-active')
    .on('enter leave', function (event) {
      applyActiveBgFgLayers();
    })
    .addTo(controller);
  });

  applyActiveBgFgLayers();
});

function applyActiveBgFgLayers() {
  var activeSection = $('.js-scrollmagic-active').last().closest('section').get(0) || $('section').first().get(0);
  $('.layer--overlay').removeClass('active');
  $('.js-layer-' + $(activeSection).data('index')).addClass('active');
}

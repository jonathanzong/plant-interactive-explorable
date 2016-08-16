$(document).ready(function() {
  // scrollmagic
  var controller = new ScrollMagic.Controller({
    globalSceneOptions: {
      offset: 100 // TODO this might need adjusting based on vh
    }
  });
  // pin text
  $('.layer--content__text p').each(function(i, d) {
    new ScrollMagic.Scene({
      triggerElement: d,
      duration: 200
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
  
});

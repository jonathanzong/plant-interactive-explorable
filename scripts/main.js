$(function () {
  // init
  var controller = new ScrollMagic.Controller({
    globalSceneOptions: {
      triggerHook: 'onLeave'
    }
  });

  // get all rows
  var rows = document.querySelectorAll(".row");

  // create scene for every slide
  for (var i=0; i<rows.length; i++) {
    // new ScrollMagic.Scene({
    //     triggerElement: rows[i]
    //   })
    //   .setPin(rows[i])
    //   .addTo(controller);
    //

    new ScrollMagic.Scene({
        triggerElement: rows[i],
        duration: $(rows[i]).height()
      })
      .setPin($(rows[i]).find('.pinnable').get(0))
      .addTo(controller);

  }

  $('.pinnable p').hover(function() {
    $(this).text("THANK YOU");
  }, function() {
    $(this).text("HELLO PLEASE HOVER OVER ME");
  });
});
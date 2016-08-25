/**
opts =
{
  container: dom element to be parent of view
  pointCount: number (points in the skeleton),
  ropeLength: number (length of the skeleton),
  textureImage: string (file path)
}
*/
var VineRenderer = function(opts) {
  opts = opts || {};

  // setup renderer
  var renderer = PIXI.autoDetectRenderer(
    $(opts.container).width() || 800,
    $(opts.container).height() || 600,
    { transparent: true });
  var stage = new PIXI.Container();

  // state
  var pointCount = opts.pointCount || 20;
  var ropeLength = opts.ropeLength || 300;
  var vines = [];

  var vineTexture = PIXI.Texture.fromImage(opts.textureImage || 'images/vine.png');

  function addVine() {
    var points = [];
    for (var i = 0; i < pointCount; i++) {
      points.push(new PIXI.Point(i * ropeLength / pointCount, 0));
    }
    var vine = new PIXI.mesh.Rope(vineTexture, points);
    vine.scale.x = 0.5;
    vine.scale.y = 0.5;
    vines.push({
      vine: vine,
      points: points
    })
    stage.addChild(vine);
  }

  // functions
  function render() {
    renderer.render(stage);
  }

  function updatePoints(i, fun) {
    fun(vines[i].points);
  }

  $(opts.container).append(renderer.view);

  // expose public properties
  return {
    width: renderer.width,
    height: renderer.height,
    pointCount: pointCount,
    ropeLength: ropeLength,
    updatePoints: updatePoints,
    render: render,
    addVine: addVine
  };

}
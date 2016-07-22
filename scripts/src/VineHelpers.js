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
    $(opts.container).height() || 600, {
    transparent: true
  });
  var stage = new PIXI.Container();

  // state
  var pointCount = opts.pointCount || 20;
  var ropeLength = opts.ropeLength || 300;
  var points = [];

  // initialize
  for (var i = 0; i < pointCount; i++) {
    points.push(new PIXI.Point(i * ropeLength / pointCount, 0));
  }

  var snakeTexture = PIXI.Texture.fromImage(opts.textureImage || 'images/vine.png');
  var snake = new PIXI.mesh.Rope(snakeTexture, points);

  stage.addChild(snake);

  // functions
  function render() {
    renderer.render(stage);
  }

  function updatePoints(fun) {
    fun(points);
  }

  $(opts.container).append(renderer.view);

  // expose public properties
  return {
    width: renderer.width,
    height: renderer.height,
    pointCount: pointCount,
    ropeLength: ropeLength,
    updatePoints: updatePoints,
    render: render
  };

}

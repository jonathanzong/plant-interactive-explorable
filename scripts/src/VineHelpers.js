/**
opts =
{
  container: dom element to be parent of view
  pointCount: number (points in the skeleton),
  ropeLength: number (length of the skeleton),
  textureImage: string (file path)
}
*/
var VineScene = function(opts) {
  opts = opts || {};

  var stage = new PIXI.Container();

  // state
  var pointCount = opts.pointCount || 20;
  var ropeLength = opts.ropeLength || 300;
  var vines = [];

  var vineTexture = PIXI.Texture.fromImage(opts.textureImage || 'images/vine.png');
  var shadowTexture = PIXI.Texture.fromImage('images/vine-shadow.png');

  function addVine() {
    var points = [];
    var points2 = [];
    for (var i = 0; i < pointCount; i++) {
      points.push(new PIXI.Point(i * ropeLength / pointCount, 0));
      points2.push(new PIXI.Point(i * ropeLength / pointCount, 0));
    }
    var vine = new PIXI.mesh.Rope(vineTexture, points);
    vine.scale.x = 0.5;
    vine.scale.y = 0.5;
    var shadow = new PIXI.mesh.Rope(shadowTexture, points2);
    shadow.scale.x = 0.5;
    shadow.scale.y = 0.5;
    vines.push({
      vine: vine,
      shadow: shadow,
      points: points,
      points2: points2,
    })
    stage.addChild(shadow);
    stage.addChild(vine);
  }

  // functions
  function render() {
    opts.renderer.render(stage);
  }

  function updatePoints(i, fun) {
    fun(vines[i].points);
    fun(vines[i].points2);
    for (var j = 0; j < vines[i].points2.length; j++) {
      vines[i].points2[j].x = vines[i].points2[j].x + 5;
      vines[i].points2[j].y = vines[i].points2[j].y + 5;
    };
  }


  // expose public properties
  return {
    pointCount: pointCount,
    ropeLength: ropeLength,
    addVine: addVine,
    render: render,
    updatePoints: updatePoints
  };

}
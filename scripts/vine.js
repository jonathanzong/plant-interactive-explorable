// based on http://animateddata.co.uk/lab/d3-tree/

$(document).ready(function() {
  $('svg').height($('.container-fluid').height());

  var Vine = function(svg) {
    // Tree configuration
    var branches = [];
    var seed = {i: 0, x: $(svg).width() / 4, y: $(svg).height(), a: 0, l: 130, d:0}; // a = angle, l = length, d = depth
    var da = 0.5; // Angle delta
    var dl = 0.8; // Length delta (factor)
    var ar = 0.7; // Randomness
    var maxDepth = 10;
    var leftRightProbability = 1; // 1 means always branch right, 0.5 means equal each direction

    // Tree creation functions
    function branch(b) {
      var end = endPt(b), daR, newB;

      branches.push(b);

      if (b.d === maxDepth)
        return;

      // Left branch
      if (Math.random() >= leftRightProbability) {
        daR = ar * Math.random() - ar * 0.5;
        newB = {
          i: branches.length,
          x: end.x,
          y: end.y,
          a: b.a - da + daR,
          l: b.l * dl,
          d: b.d + 1,
          parent: b.i
        };
        branch(newB);
      }
      else {
        // Right branch
        daR = ar * Math.random() - ar * 0.5;
        newB = {
          i: branches.length,
          x: end.x, 
          y: end.y, 
          a: b.a + da + daR, 
          l: b.l * dl, 
          d: b.d + 1,
          parent: b.i
        };
        branch(newB);
      }
    }

    function endPt(b) {
      // Return endpoint of branch
      var x = b.x + b.l * Math.sin( b.a );
      var y = b.y - b.l * Math.cos( b.a );
      return {x: x, y: y};
    }

    // D3 functions
    function x1(d) {return d.x;}
    function y1(d) {return d.y;}
    function x2(d) {return endPt(d).x;}
    function y2(d) {return endPt(d).y;}

    function create() {
      d3.select(svg)
        .selectAll('line')
        .data(branches)
        .enter()
        .append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .style('stroke-width', function(d) {return parseInt(maxDepth + 1 - d.d) + 'px';})
        .attr('id', function(d) {return 'id-'+d.i;});
    }

    function update() {
      d3.select(svg)
        .selectAll('line')
        .data(branches)
        .transition()
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2);
    }

    return {
      setSeedX: function(x) {
        seed.x = x;
      },
      setLeftRightProbability: function(p) {
        // assert p in [0, 1]
        leftRightProbability = p;
      },
      regenerate: function(initialise) {
        branches = [];
        branch(seed);
        initialise ? create() : update();
      }
    };
  };

  // do the stuff
  var svg0 = $('svg').get(0);
  var v0 = new Vine(svg0);
  v0.setSeedX($(svg0).width() / 4);
  v0.setLeftRightProbability(1);
  v0.regenerate(true);
  setInterval(v0.regenerate, 1000);

  var svg1 = $('svg').get(1);
  var v1 = new Vine(svg1);
  v1.setSeedX($(svg1).width() / 2);
  v1.setLeftRightProbability(0.5);
  v1.regenerate(true);
  setInterval(v1.regenerate, 1000);
});
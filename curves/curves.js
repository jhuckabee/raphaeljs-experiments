$(function() {

  CURVE.setup();

  $('input').change(function() {
    CURVE.drawCurve();
  });
});

var CURVE = {
  paper: null,
  circleRadius: 5,
  start: null,
  end: null,
  control1: null,
  control2: null,

  // Setup and initialize the points
  setup: function() {
    this.paper = Raphael('drawing', $(window).width(), $(window).height())
    this.drawCurve();
  },

  drawPoints: function() {
    $.each(['start', 'end', 'control1', 'control2'], function(idx, item) {
      if(CURVE.showControlLines() || (!CURVE.showControlLines() && !item.match(/control/))) {
        CURVE[item] = CURVE.point(item);
      }
    });
  },

  // Creates a basic point
  point: function(name) {
    var p = this.paper.circle(this[name+'X'].call(),this[name+'Y'].call(),this.circleRadius)
    $(p.node).attr('id', name);

    if(name.match(/control/)) {
      p.attr({'stroke': '#DDD', fill: 'red'})
      p.hover(function() {
        this.animate({fill: '#DDD', 'stroke-width': 2}, 500, '>');
      }, function() {
        this.animate({fill: 'red', 'stroke-width': 1}, 500, '<');
      });
    }
    else {
      p.attr({fill: '#000'})
      p.hover(function() {
        this.animate({fill: '#CCC', 'stroke-width': 2}, 500, '>');
      }, function() {
        this.animate({fill: '#000', 'stroke-width': 1}, 500, '<');
      });
    }

    p.drag(this.pointMove, this.pointMoveStart, this.pointMoveEnd);
    return p;
  },

  // Draw the curve and control paths if necessary
  drawCurve: function() {
    this.paper.clear();
    this.drawPoints();
    this.paper.path(this.connectPath()).toBack();
    if(this.showControlLines()) {
      this.paper.path(this.control1Path()).attr({stroke: '#DDD'}).toBack();
      this.paper.path(this.control2Path()).attr({stroke: '#DDD'}).toBack();
    }
  },

  // Return the path options for the curve between the two points
  connectPath: function() {
    var p = [], path = '';
    p.push("M"+this.startX()+" "+this.startY()+" ");
    p.push("C"+this.control1X()+" "+this.control1Y());
    p.push(" "+this.control2X()+" "+this.control2Y());
    p.push(" "+this.endX()+" "+this.endY());
    path = p.join('');
    $('#pathString').html(path);
    return path;
  },

  control1Path: function() {
    var p = [];
    p.push("M"+this.startX()+" "+this.startY()+" ");
    p.push("L"+this.control1X()+" "+this.control1Y());
    return p.join('');
  },

  control2Path: function() {
    var p = [];
    p.push("M"+this.endX()+" "+this.endY()+" ");
    p.push("L"+this.control2X()+" "+this.control2Y());
    return p.join('');
  },

  movingEl: null, pointX: 0, pointY: 0,

  pointMoveStart: function(x, y, event) {
    CURVE.movingEl = $('#'+event.target.id);
    CURVE.pointX = event.offsetX;
    CURVE.pointY = event.offsetY;
  },

  pointMoveEnd: function() {
  },

  pointMove: function(dx, dy) {
    var elId = CURVE.movingEl.attr('id');
    $('#'+elId+'X').val(CURVE.pointX+dx);
    $('#'+elId+'Y').val(CURVE.pointY+dy);
    CURVE.drawCurve();
  },

  // Helper methods
  startX: function() {
    return parseInt($('#startX').val(), 10);
  },
  startY: function() {
    return parseInt($('#startY').val(), 10);
  },
  control1X: function() {
    return parseInt($('#control1X').val(), 10);
  },
  control1Y: function() {
    return parseInt($('#control1Y').val(), 10);
  },
  control2X: function() {
    return parseInt($('#control2X').val(), 10);
  },
  control2Y: function() {
    return parseInt($('#control2Y').val(), 10);
  },
  endX: function() {
    return parseInt($('#endX').val(), 10);
  },
  endY: function() {
    return parseInt($('#endY').val(), 10);
  },
  showControlLines: function() {
    return $('#showControlLines').attr('checked');
  }
}


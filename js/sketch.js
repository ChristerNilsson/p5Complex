// Generated by CoffeeScript 1.12.7
var Game, autolevel, g, ids, keyPressed, mousePressed, mouseReleased, released, setup, touchStarted, xdraw;

g = 0;

ids = {};

released = true;

Game = (function() {
  function Game(x1, y1, a1, s, stack) {
    var h, w;
    this.x = x1 != null ? x1 : 0;
    this.y = y1 != null ? y1 : 0;
    this.a = a1 != null ? a1 : 0;
    this.s = s != null ? s : 1;
    this.stack = stack != null ? stack : [];
    this.players = [];
    this.level = 1;
    w = width;
    h = height;
    this.mode = 0;
    this.bitmap = true;
    this.players.push(new Player([87, 65, 83, 68, 16], 30, 30, 60, 60));
    this.players.push(new Player([38, 37, 40, 39, 17], 90, 30, 60, 60));
    this.display = new Button(1, 1, 1, this, 0.2, 0, -24, 6, 12, "", "");
  }

  Game.prototype.push = function() {
    this.stack.push([this.x, this.y, this.a, this.s]);
    return push();
  };

  Game.prototype.pop = function() {
    var ref;
    ref = this.stack.pop(), this.x = ref[0], this.y = ref[1], this.a = ref[2], this.s = ref[3];
    return pop();
  };

  Game.prototype.rotate = function(d) {
    rotate(radians(d));
    return this.a += d;
  };

  Game.prototype.scale = function(ds) {
    scale(ds);
    return this.s *= ds;
  };

  Game.prototype.translate = function(dx, dy) {
    var v;
    v = radians(this.a);
    this.x += this.s * dx * cos(v) - this.s * dy * sin(v);
    this.y += this.s * dy * cos(v) + this.s * dx * sin(v);
    return translate(dx, dy);
  };

  Game.prototype.dump = function(txt) {
    return print(txt, this.x, this.y);
  };

  Game.prototype.process = function() {
    this.mode = 1 - this.mode;
    if (this.mode === 0) {
      autolevel();
      return this.createProblem();
    }
  };

  Game.prototype.result = function() {
    var k, len, player, ref;
    fill(127);
    rect(0, 0, width, height);
    if (this.players[0].stopp === 0) {
      this.players[0].color = color(127);
    } else if (this.players[0].score() < this.players[1].score() || this.players[1].stopp === 0) {
      this.players[0].color = color(0, 255, 0);
    } else {
      this.players[0].color = color(255, 0, 0);
    }
    if (this.players[1].stopp === 0) {
      this.players[1].color = color(127);
    } else if (this.players[1].score() < this.players[0].score() || this.players[0].stopp === 0) {
      this.players[1].color = color(0, 255, 0);
    } else {
      this.players[1].color = color(255, 0, 0);
    }
    ref = this.players;
    for (k = 0, len = ref.length; k < len; k++) {
      player = ref[k];
      player.result();
    }
    return this.solve_result();
  };

  Game.prototype.solve_result = function() {
    var H, i, k, len, n, number, ref, results, x, y;
    fill(0);
    n = 20;
    H = height / n;
    textSize(H);
    ref = this.solution;
    results = [];
    for (i = k = 0, len = ref.length; k < len; i = ++k) {
      number = ref[i];
      x = int(i / n);
      y = int(i % n);
      results.push(text(number.toString(), x * 100, -8.5 * H + y * H));
    }
    return results;
  };

  Game.prototype.createProblem = function() {
    var a, b, c1, c2, c3, d, item, j, k, l, len, len1, len2, lst, lst2, m, ms, player, ref, ref1, results, save, tree, x, y;
    x = int(random(-5, 6));
    y = int(random(-5, 6));
    a = new Complex(x, y);
    lst = [a];
    tree = {};
    tree[a.toString()] = null;
    lst2 = [];
    c1 = new Complex(0, 1);
    c2 = new Complex(2, 0);
    c3 = new Complex(1, 0);
    save = function(item1, item2) {
      if (!(item2 in tree)) {
        lst2.push(item2);
        return tree[item2] = item1;
      }
    };
    ref = range(this.level);
    for (k = 0, len = ref.length; k < len; k++) {
      j = ref[k];
      lst2 = [];
      for (l = 0, len1 = lst.length; l < len1; l++) {
        item = lst[l];
        save(item, item.mul(c1));
        save(item, item.mul(c2));
        save(item, item.add(c3));
        save(item, item.mir());
      }
      lst = lst2;
    }
    b = this.selectTarget(lst);
    this.solution = this.path(b, tree);
    d = new Date();
    ms = int(d.getTime());
    ref1 = this.players;
    results = [];
    for (m = 0, len2 = ref1.length; m < len2; m++) {
      player = ref1[m];
      player.history = [a];
      player.target = b;
      player.count = 0;
      player.start = ms;
      player.stopp = 0;
      results.push(player.level = this.level);
    }
    return results;
  };

  Game.prototype.path = function(b, tree) {
    if (b === null) {
      return [];
    }
    return this.path(tree[b], tree).concat([b]);
  };

  Game.prototype.selectTarget = function(lst) {
    var bs, item;
    bs = (function() {
      var k, len, ref, ref1, results;
      results = [];
      for (k = 0, len = lst.length; k < len; k++) {
        item = lst[k];
        if ((-10 < (ref = item.x) && ref <= 10) && (-10 < (ref1 = item.y) && ref1 <= 10)) {
          results.push(item);
        }
      }
      return results;
    })();
    if (bs.length > 0) {
      return _.sample(bs);
    }
    return _.min(lst, function(item) {
      return dist(0, 0, item.x, item.y);
    });
  };

  return Game;

})();

setup = function() {
  createCanvas(windowWidth, windowHeight);
  frameRate(15);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  g = new Game();
  g.createProblem();
  return xdraw();
};

xdraw = function() {
  var i, k, len, player, ref;
  bg(0.5);
  g.push();
  g.translate(int(width / 2), int(height / 2));
  ref = g.players;
  for (i = k = 0, len = ref.length; k < len; i = ++k) {
    player = ref[i];
    g.push();
    g.translate((2 * i - 1) * width / 4, 0);
    if (g.mode === 0) {
      player.draw();
    } else {
      player.result();
    }
    g.pop();
  }
  g.display.draw();
  return g.pop();
};

mouseReleased = function() {
  released = true;
  return false;
};

touchStarted = function() {
  var k, len, player, ref;
  ref = g.players;
  for (k = 0, len = ref.length; k < len; k++) {
    player = ref[k];
    player.mousePressed();
  }
  g.display.mousePressed();
  return xdraw();
};

mousePressed = function() {
  var k, len, player, ref;
  if (!released) {
    return;
  }
  released = false;
  ref = g.players;
  for (k = 0, len = ref.length; k < len; k++) {
    player = ref[k];
    player.mousePressed();
  }
  g.display.mousePressed();
  return xdraw();
};

keyPressed = function() {
  var k, len, player, ref;
  if (key === ' ') {
    g.display.keyPressed(key);
  } else if (key === 'B') {
    g.bitmap = !g.bitmap;
  } else {
    ref = g.players;
    for (k = 0, len = ref.length; k < len; k++) {
      player = ref[k];
      player.keyPressed(key);
    }
  }
  return xdraw();
};

autolevel = function() {
  var finished, k, len, perfect, player, ref;
  finished = 0;
  perfect = 0;
  ref = g.players;
  for (k = 0, len = ref.length; k < len; k++) {
    player = ref[k];
    if (player.finished()) {
      finished++;
    }
    if (player.perfect(g.level)) {
      perfect++;
    }
  }
  if (perfect > 0) {
    g.level++;
  } else {
    g.level--;
  }
  if (g.level === 0) {
    return g.level = 1;
  }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tldGNoLmpzIiwic291cmNlUm9vdCI6Ii4uIiwic291cmNlcyI6WyJjb2ZmZWVcXHNrZXRjaC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUE7O0FBQUEsQ0FBQSxHQUFJOztBQUNKLEdBQUEsR0FBTTs7QUFDTixRQUFBLEdBQVc7O0FBRUw7RUFDUyxjQUFDLEVBQUQsRUFBTyxFQUFQLEVBQWEsRUFBYixFQUFtQixDQUFuQixFQUF5QixLQUF6QjtBQUNiLFFBQUE7SUFEYyxJQUFDLENBQUEsaUJBQUQsS0FBRztJQUFHLElBQUMsQ0FBQSxpQkFBRCxLQUFHO0lBQUcsSUFBQyxDQUFBLGlCQUFELEtBQUc7SUFBRyxJQUFDLENBQUEsZ0JBQUQsSUFBRztJQUFHLElBQUMsQ0FBQSx3QkFBRCxRQUFPO0lBQzdDLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFDWCxJQUFDLENBQUEsS0FBRCxHQUFTO0lBQ1QsQ0FBQSxHQUFJO0lBQ0osQ0FBQSxHQUFJO0lBQ0osSUFBQyxDQUFBLElBQUQsR0FBUTtJQUNSLElBQUMsQ0FBQSxNQUFELEdBQVU7SUFFVixJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxJQUFJLE1BQUosQ0FBVyxDQUFDLEVBQUQsRUFBSSxFQUFKLEVBQU8sRUFBUCxFQUFVLEVBQVYsRUFBYSxFQUFiLENBQVgsRUFBNEIsRUFBNUIsRUFBK0IsRUFBL0IsRUFBbUMsRUFBbkMsRUFBc0MsRUFBdEMsQ0FBZDtJQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLElBQUksTUFBSixDQUFXLENBQUMsRUFBRCxFQUFJLEVBQUosRUFBTyxFQUFQLEVBQVUsRUFBVixFQUFhLEVBQWIsQ0FBWCxFQUE0QixFQUE1QixFQUErQixFQUEvQixFQUFtQyxFQUFuQyxFQUFzQyxFQUF0QyxDQUFkO0lBQ0EsSUFBQyxDQUFBLE9BQUQsR0FBWSxJQUFJLE1BQUosQ0FBVyxDQUFYLEVBQWEsQ0FBYixFQUFlLENBQWYsRUFBa0IsSUFBbEIsRUFB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LENBQWQ7V0FDQyxDQUFDLENBQUMsS0FBRixHQUFVLEVBRFg7O0FBWlciLCJzb3VyY2VzQ29udGVudCI6WyJnID0gMFxyXG5pZHMgPSB7fVxyXG5yZWxlYXNlZCA9IHRydWVcclxuXHJcbmNsYXNzIEdhbWVcclxuXHRjb25zdHJ1Y3RvciA6IChAeD0wLCBAeT0wLCBAYT0wLCBAcz0xLCBAc3RhY2s9W10pIC0+XHJcblx0XHRAcGxheWVycyA9IFtdXHJcblx0XHRAbGV2ZWwgPSAxXHJcblx0XHR3ID0gd2lkdGhcclxuXHRcdGggPSBoZWlnaHQgICBcclxuXHRcdEBtb2RlID0gMCAgICAgXHJcblx0XHRAYml0bWFwID0gdHJ1ZSBcclxuXHJcblx0XHRAcGxheWVycy5wdXNoIG5ldyBQbGF5ZXIgWzg3LDY1LDgzLDY4LDE2XSwzMCwzMCwgNjAsNjBcclxuXHRcdEBwbGF5ZXJzLnB1c2ggbmV3IFBsYXllciBbMzgsMzcsNDAsMzksMTddLDkwLDMwLCA2MCw2MFxyXG5cdFx0QGRpc3BsYXkgPSAgbmV3IEJ1dHRvbiAxLDEsMSwgQCwgMC4yLCAwLCAtMjQsIDYsIDEyLCBcIlwiLFwiXCJcclxuXHJcblx0cHVzaCA6IC0+XHJcblx0XHRAc3RhY2sucHVzaCBbQHgsQHksQGEsQHNdXHJcblx0XHRwdXNoKClcclxuXHRwb3AgOiAtPlxyXG5cdFx0W0B4LEB5LEBhLEBzXSA9IEBzdGFjay5wb3AoKVxyXG5cdFx0cG9wKClcclxuXHRyb3RhdGUgOiAoZCkgLT5cclxuXHRcdHJvdGF0ZSByYWRpYW5zIGRcclxuXHRcdEBhICs9IGRcclxuXHRzY2FsZSA6IChkcykgLT5cclxuXHRcdHNjYWxlIGRzXHJcblx0XHRAcyAqPSBkc1xyXG5cdHRyYW5zbGF0ZSA6IChkeCxkeSkgLT5cclxuXHRcdHYgPSByYWRpYW5zIEBhXHJcblx0XHRAeCArPSBAcyAqIGR4ICogY29zKHYpIC0gQHMgKiBkeSAqIHNpbih2KVxyXG5cdFx0QHkgKz0gQHMgKiBkeSAqIGNvcyh2KSArIEBzICogZHggKiBzaW4odilcclxuXHRcdHRyYW5zbGF0ZSBkeCxkeVxyXG5cdGR1bXAgOiAodHh0KSAtPlxyXG5cdFx0cHJpbnQgdHh0LCBAeCxAeVxyXG5cclxuXHRwcm9jZXNzIDogLT5cclxuXHRcdEBtb2RlID0gMSAtIEBtb2RlXHJcblx0XHRpZiBAbW9kZSA9PSAwXHJcblx0XHRcdGF1dG9sZXZlbCgpXHJcblx0XHRcdEBjcmVhdGVQcm9ibGVtKClcclxuXHJcblx0cmVzdWx0IDogLT5cclxuXHRcdGZpbGwgMTI3XHJcblx0XHRyZWN0IDAsMCx3aWR0aCxoZWlnaHRcclxuXHJcblx0XHRpZiBAcGxheWVyc1swXS5zdG9wcCA9PSAwXHJcblx0XHRcdEBwbGF5ZXJzWzBdLmNvbG9yID0gY29sb3IgMTI3XHJcblx0XHRlbHNlIGlmIEBwbGF5ZXJzWzBdLnNjb3JlKCkgPCBAcGxheWVyc1sxXS5zY29yZSgpIG9yIEBwbGF5ZXJzWzFdLnN0b3BwID09IDAgIFxyXG5cdFx0XHRAcGxheWVyc1swXS5jb2xvciA9IGNvbG9yIDAsMjU1LDBcclxuXHRcdGVsc2VcclxuXHRcdFx0QHBsYXllcnNbMF0uY29sb3IgPSBjb2xvciAyNTUsMCwwXHJcblxyXG5cdFx0aWYgQHBsYXllcnNbMV0uc3RvcHAgPT0gMFxyXG5cdFx0XHRAcGxheWVyc1sxXS5jb2xvciA9IGNvbG9yIDEyN1xyXG5cdFx0ZWxzZSBpZiBAcGxheWVyc1sxXS5zY29yZSgpIDwgQHBsYXllcnNbMF0uc2NvcmUoKSBvciBAcGxheWVyc1swXS5zdG9wcCA9PSAwICBcclxuXHRcdFx0QHBsYXllcnNbMV0uY29sb3IgPSBjb2xvciAwLDI1NSwwXHJcblx0XHRlbHNlXHJcblx0XHRcdEBwbGF5ZXJzWzFdLmNvbG9yID0gY29sb3IgMjU1LDAsMFxyXG5cclxuXHRcdGZvciBwbGF5ZXIgaW4gQHBsYXllcnNcclxuXHRcdFx0cGxheWVyLnJlc3VsdCgpXHJcblxyXG5cdFx0QHNvbHZlX3Jlc3VsdCgpXHRcclxuXHJcblx0c29sdmVfcmVzdWx0IDogLT5cclxuXHRcdGZpbGwgMFxyXG5cdFx0biA9IDIwIFxyXG5cdFx0SCA9IGhlaWdodCAvIG5cclxuXHRcdHRleHRTaXplIEhcclxuXHJcblx0XHRmb3IgbnVtYmVyLGkgaW4gQHNvbHV0aW9uXHJcblx0XHRcdHggPSBpbnQgaSAvIG5cclxuXHRcdFx0eSA9IGludCBpICUgblxyXG5cdFx0XHR0ZXh0IG51bWJlci50b1N0cmluZygpLCB4KjEwMCwgLTguNSpIICsgeSpIXHRcdFxyXG5cclxuXHRjcmVhdGVQcm9ibGVtIDogLT5cclxuXHRcdHggPSBpbnQgcmFuZG9tIC01LDZcclxuXHRcdHkgPSBpbnQgcmFuZG9tIC01LDZcclxuXHRcdGEgPSBuZXcgQ29tcGxleCB4LHlcclxuXHRcdGxzdCA9IFthXVxyXG5cdFx0dHJlZSA9IHt9XHJcblx0XHR0cmVlW2EudG9TdHJpbmcoKV0gPSBudWxsIFxyXG5cdFx0bHN0MiA9IFtdXHJcblxyXG5cdFx0YzEgPSBuZXcgQ29tcGxleCAwLDFcclxuXHRcdGMyID0gbmV3IENvbXBsZXggMiwwXHJcblx0XHRjMyA9IG5ldyBDb21wbGV4IDEsMFxyXG5cclxuXHRcdHNhdmUgPSAoaXRlbTEsIGl0ZW0yKSAtPlxyXG5cdFx0XHRpZiBpdGVtMiBub3Qgb2YgdHJlZVxyXG5cdFx0XHRcdGxzdDIucHVzaCBpdGVtMlxyXG5cdFx0XHRcdHRyZWVbaXRlbTJdID0gaXRlbTFcclxuXHJcblx0XHRmb3IgaiBpbiByYW5nZSBAbGV2ZWxcclxuXHRcdFx0bHN0MiA9IFtdXHJcblx0XHRcdGZvciBpdGVtIGluIGxzdFxyXG5cdFx0XHRcdHNhdmUgaXRlbSwgaXRlbS5tdWwgYzFcclxuXHRcdFx0XHRzYXZlIGl0ZW0sIGl0ZW0ubXVsIGMyXHJcblx0XHRcdFx0c2F2ZSBpdGVtLCBpdGVtLmFkZCBjM1xyXG5cdFx0XHRcdHNhdmUgaXRlbSwgaXRlbS5taXIoKVxyXG5cdFx0XHRsc3QgPSBsc3QyXHJcblx0XHRcdFxyXG5cdFx0YiA9IEBzZWxlY3RUYXJnZXQgbHN0XHJcblx0XHRAc29sdXRpb24gPSBAcGF0aCBiLHRyZWVcclxuXHJcblx0XHRkID0gbmV3IERhdGUoKVxyXG5cdFx0bXMgPSBpbnQgZC5nZXRUaW1lKClcclxuXHRcdGZvciBwbGF5ZXIgaW4gQHBsYXllcnNcclxuXHRcdFx0cGxheWVyLmhpc3RvcnkgPSBbYV1cclxuXHRcdFx0cGxheWVyLnRhcmdldCA9IGJcclxuXHRcdFx0cGxheWVyLmNvdW50ID0gMFxyXG5cdFx0XHRwbGF5ZXIuc3RhcnQgPSBtcyBcclxuXHRcdFx0cGxheWVyLnN0b3BwID0gMFxyXG5cdFx0XHRwbGF5ZXIubGV2ZWwgPSBAbGV2ZWxcclxuXHJcblx0cGF0aCA6IChiLHRyZWUpIC0+XHJcblx0XHRyZXR1cm4gW10gaWYgYiA9PSBudWxsXHJcblx0XHRAcGF0aCh0cmVlW2JdLCB0cmVlKS5jb25jYXQgW2JdXHJcblxyXG5cdHNlbGVjdFRhcmdldCA6IChsc3QpIC0+ICMgd2l0aGluIDIxeDIxIHdpbmRvdywgaWYgcG9zc2libGVcclxuXHRcdGJzID0gKGl0ZW0gZm9yIGl0ZW0gaW4gbHN0IHdoZW4gLTEwIDwgaXRlbS54IDw9IDEwIGFuZCAtMTAgPCBpdGVtLnkgPD0gMTApXHJcblx0XHRyZXR1cm4gXy5zYW1wbGUgYnMgaWYgYnMubGVuZ3RoID4gMFxyXG5cdFx0Xy5taW4gbHN0LCAoaXRlbSkgLT4gZGlzdCAwLDAsaXRlbS54LGl0ZW0ueVxyXG5cclxuc2V0dXAgPSAtPlxyXG5cdGNyZWF0ZUNhbnZhcyB3aW5kb3dXaWR0aCwgd2luZG93SGVpZ2h0XHJcblx0ZnJhbWVSYXRlIDE1XHJcblx0dGV4dEFsaWduIENFTlRFUixDRU5URVJcclxuXHRyZWN0TW9kZSBDRU5URVJcclxuXHRnID0gbmV3IEdhbWUoKVxyXG5cdGcuY3JlYXRlUHJvYmxlbSgpXHRcdFxyXG5cdHhkcmF3KClcclxuXHJcbnhkcmF3ID0gLT5cclxuXHRiZyAwLjVcclxuXHRnLnB1c2goKVxyXG5cdGcudHJhbnNsYXRlIGludCh3aWR0aC8yKSwgaW50KGhlaWdodC8yKVx0IyBpbnRlZ2VycyBuZWVkZWQgaGVyZSBvciBibHVycnkgZ3JpZCBsaW5lc1xyXG5cclxuXHRmb3IgcGxheWVyLGkgaW4gZy5wbGF5ZXJzXHJcblx0XHRnLnB1c2goKVxyXG5cdFx0Zy50cmFuc2xhdGUgKDIqaS0xKSAqIHdpZHRoLzQsIDBcclxuXHRcdGlmIGcubW9kZT09MFxyXG5cdFx0XHRwbGF5ZXIuZHJhdygpXHJcblx0XHRlbHNlXHJcblx0XHRcdHBsYXllci5yZXN1bHQoKSBcclxuXHRcdGcucG9wKClcclxuXHRnLmRpc3BsYXkuZHJhdygpXHRcclxuXHRnLnBvcCgpXHJcblxyXG5tb3VzZVJlbGVhc2VkID0gLT4gIyB0byBtYWtlIEFuZHJvaWQgd29yayBcclxuXHRyZWxlYXNlZCA9IHRydWUgXHJcblx0ZmFsc2VcclxuXHJcbnRvdWNoU3RhcnRlZCA9IC0+IFxyXG5cdHBsYXllci5tb3VzZVByZXNzZWQoKSBmb3IgcGxheWVyIGluIGcucGxheWVyc1xyXG5cdGcuZGlzcGxheS5tb3VzZVByZXNzZWQoKVxyXG5cdHhkcmF3KClcclxuXHJcbm1vdXNlUHJlc3NlZCA9IC0+XHJcblx0aWYgIXJlbGVhc2VkIHRoZW4gcmV0dXJuICMgdG8gbWFrZSBBbmRyb2lkIHdvcmsgXHJcblx0cmVsZWFzZWQgPSBmYWxzZVxyXG5cdHBsYXllci5tb3VzZVByZXNzZWQoKSBmb3IgcGxheWVyIGluIGcucGxheWVyc1xyXG5cdGcuZGlzcGxheS5tb3VzZVByZXNzZWQoKVxyXG5cdHhkcmF3KClcdFxyXG5cclxuIyB0b3VjaFN0YXJ0ZWQgPSAtPiBcclxuIyBcdGZvciB0b3VjaCBpbiB0b3VjaGVzXHJcbiMgXHRcdGlmIHRvdWNoLmlkIG5vdCBvZiBpZHMgXHJcbiMgXHRcdFx0aWRzW3RvdWNoLmlkXSA9IHRvdWNoXHJcbiMgXHRcdFx0Zm9yIHBsYXllciBpbiBnLnBsYXllcnNcclxuIyBcdFx0XHRcdHBsYXllci50b3VjaFN0YXJ0ZWQgdG91Y2gueCx0b3VjaC55XHJcbiMgXHRpZHMgPSB7fSBpZiB0b3VjaC5sZW5ndGggPT0gMFxyXG4jIFx0Zy5kaXNwbGF5LnRvdWNoU3RhcnRlZCB0b3VjaC54LHRvdWNoLnlcclxuIyBcdHhkcmF3KClcclxuXHJcbiMgbW91c2VQcmVzc2VkID0gLT5cclxuIyBcdHBsYXllci5tb3VzZVByZXNzZWQoKSBmb3IgcGxheWVyIGluIGcucGxheWVyc1xyXG4jIFx0Zy5kaXNwbGF5Lm1vdXNlUHJlc3NlZCgpXHJcbiMgXHR4ZHJhdygpXHJcblxyXG5rZXlQcmVzc2VkID0gLT5cclxuXHRpZiBrZXkgPT0gJyAnIFxyXG5cdFx0Zy5kaXNwbGF5LmtleVByZXNzZWQga2V5XHJcblx0ZWxzZSBpZiBrZXkgPT0gJ0InXHJcblx0XHRnLmJpdG1hcCA9IG5vdCBnLmJpdG1hcFxyXG5cdGVsc2VcclxuXHRcdHBsYXllci5rZXlQcmVzc2VkIGtleSBmb3IgcGxheWVyIGluIGcucGxheWVyc1xyXG5cdHhkcmF3KClcclxuXHJcbmF1dG9sZXZlbCA9IC0+XHJcblx0ZmluaXNoZWQgPSAwXHJcblx0cGVyZmVjdCA9IDBcclxuXHRmb3IgcGxheWVyIGluIGcucGxheWVyc1xyXG5cdFx0aWYgcGxheWVyLmZpbmlzaGVkKClcclxuXHRcdFx0ZmluaXNoZWQrK1xyXG5cdFx0aWYgcGxheWVyLnBlcmZlY3QgZy5sZXZlbFxyXG5cdFx0XHRwZXJmZWN0KytcdFxyXG5cdGlmIHBlcmZlY3QgPiAwXHJcblx0XHRnLmxldmVsKytcclxuXHRlbHNlIFxyXG5cdFx0Zy5sZXZlbC0tXHJcblx0aWYgZy5sZXZlbCA9PSAwXHJcblx0XHRnLmxldmVsID0gMVxyXG4iXX0=
//# sourceURL=C:\github\p5Complex\coffee\sketch.coffee
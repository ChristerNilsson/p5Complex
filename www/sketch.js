// Generated by CoffeeScript 1.11.1
var Game, autolevel, g, ids, keyPressed, mousePressed, setup, touchStarted, xdraw;

g = 0;

ids = {};

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

touchStarted = function() {
  var k, l, len, len1, player, ref, touch;
  for (k = 0, len = touches.length; k < len; k++) {
    touch = touches[k];
    if (!(touch.id in ids)) {
      ids[touch.id] = touch;
      ref = g.players;
      for (l = 0, len1 = ref.length; l < len1; l++) {
        player = ref[l];
        player.touchStarted(touch.x, touch.y);
      }
    }
  }
  if (touch.length === 0) {
    ids = {};
  }
  g.display.touchStarted(touch.x, touch.y);
  return xdraw();
};

mousePressed = function() {
  var k, len, player, ref;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tldGNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2tldGNoLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQTs7QUFBQSxDQUFBLEdBQUk7O0FBQ0osR0FBQSxHQUFNOztBQUVBO0VBQ1MsY0FBQyxFQUFELEVBQU8sRUFBUCxFQUFhLEVBQWIsRUFBbUIsQ0FBbkIsRUFBeUIsS0FBekI7QUFDYixRQUFBO0lBRGMsSUFBQyxDQUFBLGlCQUFELEtBQUc7SUFBRyxJQUFDLENBQUEsaUJBQUQsS0FBRztJQUFHLElBQUMsQ0FBQSxpQkFBRCxLQUFHO0lBQUcsSUFBQyxDQUFBLGdCQUFELElBQUc7SUFBRyxJQUFDLENBQUEsd0JBQUQsUUFBTztJQUM3QyxJQUFDLENBQUEsT0FBRCxHQUFXO0lBQ1gsSUFBQyxDQUFBLEtBQUQsR0FBUztJQUNULENBQUEsR0FBSTtJQUNKLENBQUEsR0FBSTtJQUNKLElBQUMsQ0FBQSxJQUFELEdBQVE7SUFDUixJQUFDLENBQUEsTUFBRCxHQUFVO0lBRVYsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWtCLElBQUEsTUFBQSxDQUFPLENBQUMsRUFBRCxFQUFJLEVBQUosRUFBTyxFQUFQLEVBQVUsRUFBVixFQUFhLEVBQWIsQ0FBUCxFQUF3QixFQUF4QixFQUEyQixFQUEzQixFQUErQixFQUEvQixFQUFrQyxFQUFsQyxDQUFsQjtJQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFrQixJQUFBLE1BQUEsQ0FBTyxDQUFDLEVBQUQsRUFBSSxFQUFKLEVBQU8sRUFBUCxFQUFVLEVBQVYsRUFBYSxFQUFiLENBQVAsRUFBd0IsRUFBeEIsRUFBMkIsRUFBM0IsRUFBK0IsRUFBL0IsRUFBa0MsRUFBbEMsQ0FBbEI7SUFDQSxJQUFDLENBQUEsT0FBRCxHQUFnQixJQUFBLE1BQUEsQ0FBTyxDQUFQLEVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYyxJQUFkLEVBQWlCLEdBQWpCLEVBQXNCLENBQXRCLEVB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SDtNQUNDLE9BQUEsR0FERDs7QUFIRDtFQUtBLElBQUcsT0FBQSxHQUFVLENBQWI7SUFDQyxDQUFDLENBQUMsS0FBRixHQUREO0dBQUEsTUFBQTtJQUdDLENBQUMsQ0FBQyxLQUFGLEdBSEQ7O0VBSUEsSUFBRyxDQUFDLENBQUMsS0FBRixLQUFXLENBQWQ7V0FDQyxDQUFDLENBQUMsS0FBRixHQUFVLEVBRFg7O0FBWlciLCJzb3VyY2VzQ29udGVudCI6WyJnID0gMFxyXG5pZHMgPSB7fVxyXG5cclxuY2xhc3MgR2FtZVxyXG5cdGNvbnN0cnVjdG9yIDogKEB4PTAsIEB5PTAsIEBhPTAsIEBzPTEsIEBzdGFjaz1bXSkgLT5cclxuXHRcdEBwbGF5ZXJzID0gW11cclxuXHRcdEBsZXZlbCA9IDFcclxuXHRcdHcgPSB3aWR0aFxyXG5cdFx0aCA9IGhlaWdodCAgIFxyXG5cdFx0QG1vZGUgPSAwICAgICBcclxuXHRcdEBiaXRtYXAgPSB0cnVlIFxyXG5cclxuXHRcdEBwbGF5ZXJzLnB1c2ggbmV3IFBsYXllciBbODcsNjUsODMsNjgsMTZdLDMwLDMwLCA2MCw2MFxyXG5cdFx0QHBsYXllcnMucHVzaCBuZXcgUGxheWVyIFszOCwzNyw0MCwzOSwxN10sOTAsMzAsIDYwLDYwXHJcblx0XHRAZGlzcGxheSA9ICBuZXcgQnV0dG9uIDEsMSwxLCBALCAwLjIsIDAsIC0yNCwgNiwgMTIsIFwiXCIsXCJcIlxyXG5cclxuXHRwdXNoIDogLT5cclxuXHRcdEBzdGFjay5wdXNoIFtAeCxAeSxAYSxAc11cclxuXHRcdHB1c2goKVxyXG5cdHBvcCA6IC0+XHJcblx0XHRbQHgsQHksQGEsQHNdID0gQHN0YWNrLnBvcCgpXHJcblx0XHRwb3AoKVxyXG5cdHJvdGF0ZSA6IChkKSAtPlxyXG5cdFx0cm90YXRlIHJhZGlhbnMgZFxyXG5cdFx0QGEgKz0gZFxyXG5cdHNjYWxlIDogKGRzKSAtPlxyXG5cdFx0c2NhbGUgZHNcclxuXHRcdEBzICo9IGRzXHJcblx0dHJhbnNsYXRlIDogKGR4LGR5KSAtPlxyXG5cdFx0diA9IHJhZGlhbnMgQGFcclxuXHRcdEB4ICs9IEBzICogZHggKiBjb3ModikgLSBAcyAqIGR5ICogc2luKHYpXHJcblx0XHRAeSArPSBAcyAqIGR5ICogY29zKHYpICsgQHMgKiBkeCAqIHNpbih2KVxyXG5cdFx0dHJhbnNsYXRlIGR4LGR5XHJcblx0ZHVtcCA6ICh0eHQpIC0+XHJcblx0XHRwcmludCB0eHQsIEB4LEB5XHJcblxyXG5cdHByb2Nlc3MgOiAtPlxyXG5cdFx0QG1vZGUgPSAxIC0gQG1vZGVcclxuXHRcdGlmIEBtb2RlID09IDBcclxuXHRcdFx0YXV0b2xldmVsKClcclxuXHRcdFx0QGNyZWF0ZVByb2JsZW0oKVxyXG5cclxuXHRyZXN1bHQgOiAtPlxyXG5cdFx0ZmlsbCAxMjdcclxuXHRcdHJlY3QgMCwwLHdpZHRoLGhlaWdodFxyXG5cclxuXHRcdGlmIEBwbGF5ZXJzWzBdLnN0b3BwID09IDBcclxuXHRcdFx0QHBsYXllcnNbMF0uY29sb3IgPSBjb2xvciAxMjdcclxuXHRcdGVsc2UgaWYgQHBsYXllcnNbMF0uc2NvcmUoKSA8IEBwbGF5ZXJzWzFdLnNjb3JlKCkgb3IgQHBsYXllcnNbMV0uc3RvcHAgPT0gMCAgXHJcblx0XHRcdEBwbGF5ZXJzWzBdLmNvbG9yID0gY29sb3IgMCwyNTUsMFxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRAcGxheWVyc1swXS5jb2xvciA9IGNvbG9yIDI1NSwwLDBcclxuXHJcblx0XHRpZiBAcGxheWVyc1sxXS5zdG9wcCA9PSAwXHJcblx0XHRcdEBwbGF5ZXJzWzFdLmNvbG9yID0gY29sb3IgMTI3XHJcblx0XHRlbHNlIGlmIEBwbGF5ZXJzWzFdLnNjb3JlKCkgPCBAcGxheWVyc1swXS5zY29yZSgpIG9yIEBwbGF5ZXJzWzBdLnN0b3BwID09IDAgIFxyXG5cdFx0XHRAcGxheWVyc1sxXS5jb2xvciA9IGNvbG9yIDAsMjU1LDBcclxuXHRcdGVsc2VcclxuXHRcdFx0QHBsYXllcnNbMV0uY29sb3IgPSBjb2xvciAyNTUsMCwwXHJcblxyXG5cdFx0Zm9yIHBsYXllciBpbiBAcGxheWVyc1xyXG5cdFx0XHRwbGF5ZXIucmVzdWx0KClcclxuXHJcblx0XHRAc29sdmVfcmVzdWx0KClcdFxyXG5cclxuXHRzb2x2ZV9yZXN1bHQgOiAtPlxyXG5cdFx0ZmlsbCAwXHJcblx0XHRuID0gMjAgXHJcblx0XHRIID0gaGVpZ2h0IC8gblxyXG5cdFx0dGV4dFNpemUgSFxyXG5cclxuXHRcdGZvciBudW1iZXIsaSBpbiBAc29sdXRpb25cclxuXHRcdFx0eCA9IGludCBpIC8gblxyXG5cdFx0XHR5ID0gaW50IGkgJSBuXHJcblx0XHRcdHRleHQgbnVtYmVyLnRvU3RyaW5nKCksIHgqMTAwLCAtOC41KkggKyB5KkhcdFx0XHJcblxyXG5cdGNyZWF0ZVByb2JsZW0gOiAtPlxyXG5cdFx0eCA9IGludCByYW5kb20gLTUsNlxyXG5cdFx0eSA9IGludCByYW5kb20gLTUsNlxyXG5cdFx0YSA9IG5ldyBDb21wbGV4IHgseVxyXG5cdFx0bHN0ID0gW2FdXHJcblx0XHR0cmVlID0ge31cclxuXHRcdHRyZWVbYS50b1N0cmluZygpXSA9IG51bGwgXHJcblx0XHRsc3QyID0gW11cclxuXHJcblx0XHRjMSA9IG5ldyBDb21wbGV4IDAsMVxyXG5cdFx0YzIgPSBuZXcgQ29tcGxleCAyLDBcclxuXHRcdGMzID0gbmV3IENvbXBsZXggMSwwXHJcblxyXG5cdFx0c2F2ZSA9IChpdGVtMSwgaXRlbTIpIC0+XHJcblx0XHRcdGlmIGl0ZW0yIG5vdCBvZiB0cmVlXHJcblx0XHRcdFx0bHN0Mi5wdXNoIGl0ZW0yXHJcblx0XHRcdFx0dHJlZVtpdGVtMl0gPSBpdGVtMVxyXG5cclxuXHRcdGZvciBqIGluIHJhbmdlIEBsZXZlbFxyXG5cdFx0XHRsc3QyID0gW11cclxuXHRcdFx0Zm9yIGl0ZW0gaW4gbHN0XHJcblx0XHRcdFx0c2F2ZSBpdGVtLCBpdGVtLm11bCBjMVxyXG5cdFx0XHRcdHNhdmUgaXRlbSwgaXRlbS5tdWwgYzJcclxuXHRcdFx0XHRzYXZlIGl0ZW0sIGl0ZW0uYWRkIGMzXHJcblx0XHRcdFx0c2F2ZSBpdGVtLCBpdGVtLm1pcigpXHJcblx0XHRcdGxzdCA9IGxzdDJcclxuXHRcdFx0XHJcblx0XHRiID0gQHNlbGVjdFRhcmdldCBsc3RcclxuXHRcdEBzb2x1dGlvbiA9IEBwYXRoIGIsdHJlZVxyXG5cclxuXHRcdGQgPSBuZXcgRGF0ZSgpXHJcblx0XHRtcyA9IGludCBkLmdldFRpbWUoKVxyXG5cdFx0Zm9yIHBsYXllciBpbiBAcGxheWVyc1xyXG5cdFx0XHRwbGF5ZXIuaGlzdG9yeSA9IFthXVxyXG5cdFx0XHRwbGF5ZXIudGFyZ2V0ID0gYlxyXG5cdFx0XHRwbGF5ZXIuY291bnQgPSAwXHJcblx0XHRcdHBsYXllci5zdGFydCA9IG1zIFxyXG5cdFx0XHRwbGF5ZXIuc3RvcHAgPSAwXHJcblx0XHRcdHBsYXllci5sZXZlbCA9IEBsZXZlbFxyXG5cclxuXHRwYXRoIDogKGIsdHJlZSkgLT5cclxuXHRcdHJldHVybiBbXSBpZiBiID09IG51bGxcclxuXHRcdEBwYXRoKHRyZWVbYl0sIHRyZWUpLmNvbmNhdCBbYl1cclxuXHJcblx0c2VsZWN0VGFyZ2V0IDogKGxzdCkgLT4gIyB3aXRoaW4gMjF4MjEgd2luZG93LCBpZiBwb3NzaWJsZVxyXG5cdFx0YnMgPSAoaXRlbSBmb3IgaXRlbSBpbiBsc3Qgd2hlbiAtMTAgPCBpdGVtLnggPD0gMTAgYW5kIC0xMCA8IGl0ZW0ueSA8PSAxMClcclxuXHRcdHJldHVybiBfLnNhbXBsZSBicyBpZiBicy5sZW5ndGggPiAwXHJcblx0XHRfLm1pbiBsc3QsIChpdGVtKSAtPiBkaXN0IDAsMCxpdGVtLngsaXRlbS55XHJcblxyXG5zZXR1cCA9IC0+XHJcblx0Y3JlYXRlQ2FudmFzIHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHRcclxuXHRmcmFtZVJhdGUgMTVcclxuXHR0ZXh0QWxpZ24gQ0VOVEVSLENFTlRFUlxyXG5cdHJlY3RNb2RlIENFTlRFUlxyXG5cdGcgPSBuZXcgR2FtZSgpXHJcblx0Zy5jcmVhdGVQcm9ibGVtKClcdFx0XHJcblx0eGRyYXcoKVxyXG5cclxueGRyYXcgPSAtPlxyXG5cdGJnIDAuNVxyXG5cdGcucHVzaCgpXHJcblx0Zy50cmFuc2xhdGUgaW50KHdpZHRoLzIpLCBpbnQoaGVpZ2h0LzIpXHQjIGludGVnZXJzIG5lZWRlZCBoZXJlIG9yIGJsdXJyeSBncmlkIGxpbmVzXHJcblxyXG5cdGZvciBwbGF5ZXIsaSBpbiBnLnBsYXllcnNcclxuXHRcdGcucHVzaCgpXHJcblx0XHRnLnRyYW5zbGF0ZSAoMippLTEpICogd2lkdGgvNCwgMFxyXG5cdFx0aWYgZy5tb2RlPT0wXHJcblx0XHRcdHBsYXllci5kcmF3KClcclxuXHRcdGVsc2VcclxuXHRcdFx0cGxheWVyLnJlc3VsdCgpIFxyXG5cdFx0Zy5wb3AoKVxyXG5cdGcuZGlzcGxheS5kcmF3KClcdFxyXG5cdGcucG9wKClcclxuXHJcbnRvdWNoU3RhcnRlZCA9IC0+IFxyXG5cdGZvciB0b3VjaCBpbiB0b3VjaGVzXHJcblx0XHRpZiB0b3VjaC5pZCBub3Qgb2YgaWRzIFxyXG5cdFx0XHRpZHNbdG91Y2guaWRdID0gdG91Y2hcclxuXHRcdFx0Zm9yIHBsYXllciBpbiBnLnBsYXllcnNcclxuXHRcdFx0XHRwbGF5ZXIudG91Y2hTdGFydGVkIHRvdWNoLngsdG91Y2gueVxyXG5cdGlkcyA9IHt9IGlmIHRvdWNoLmxlbmd0aCA9PSAwXHJcblx0Zy5kaXNwbGF5LnRvdWNoU3RhcnRlZCB0b3VjaC54LHRvdWNoLnlcclxuXHR4ZHJhdygpXHJcblxyXG5tb3VzZVByZXNzZWQgPSAtPlxyXG5cdHBsYXllci5tb3VzZVByZXNzZWQoKSBmb3IgcGxheWVyIGluIGcucGxheWVyc1xyXG5cdGcuZGlzcGxheS5tb3VzZVByZXNzZWQoKVxyXG5cdHhkcmF3KClcclxuXHJcbmtleVByZXNzZWQgPSAtPlxyXG5cdGlmIGtleSA9PSAnICcgXHJcblx0XHRnLmRpc3BsYXkua2V5UHJlc3NlZCBrZXlcclxuXHRlbHNlIGlmIGtleSA9PSAnQidcclxuXHRcdGcuYml0bWFwID0gbm90IGcuYml0bWFwXHJcblx0ZWxzZVxyXG5cdFx0cGxheWVyLmtleVByZXNzZWQga2V5IGZvciBwbGF5ZXIgaW4gZy5wbGF5ZXJzXHJcblx0eGRyYXcoKVxyXG5cclxuYXV0b2xldmVsID0gLT5cclxuXHRmaW5pc2hlZCA9IDBcclxuXHRwZXJmZWN0ID0gMFxyXG5cdGZvciBwbGF5ZXIgaW4gZy5wbGF5ZXJzXHJcblx0XHRpZiBwbGF5ZXIuZmluaXNoZWQoKVxyXG5cdFx0XHRmaW5pc2hlZCsrXHJcblx0XHRpZiBwbGF5ZXIucGVyZmVjdCBnLmxldmVsXHJcblx0XHRcdHBlcmZlY3QrK1x0XHJcblx0aWYgcGVyZmVjdCA+IDBcclxuXHRcdGcubGV2ZWwrK1xyXG5cdGVsc2UgXHJcblx0XHRnLmxldmVsLS1cclxuXHRpZiBnLmxldmVsID09IDBcclxuXHRcdGcubGV2ZWwgPSAxXHJcbiJdfQ==
//# sourceURL=C:\github\p5Complex\www\sketch.coffee
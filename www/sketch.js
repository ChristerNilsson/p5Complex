// Generated by CoffeeScript 1.12.2
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
    print(this.solution.join(' '));
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
  print("h");
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tldGNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2tldGNoLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQTs7QUFBQSxDQUFBLEdBQUk7O0FBQ0osR0FBQSxHQUFNOztBQUVBO0VBQ1MsY0FBQyxFQUFELEVBQU8sRUFBUCxFQUFhLEVBQWIsRUFBbUIsQ0FBbkIsRUFBeUIsS0FBekI7QUFDYixRQUFBO0lBRGMsSUFBQyxDQUFBLGlCQUFELEtBQUc7SUFBRyxJQUFDLENBQUEsaUJBQUQsS0FBRztJQUFHLElBQUMsQ0FBQSxpQkFBRCxLQUFHO0lBQUcsSUFBQyxDQUFBLGdCQUFELElBQUc7SUFBRyxJQUFDLENBQUEsd0JBQUQsUUFBTztJQUM3QyxJQUFDLENBQUEsT0FBRCxHQUFXO0lBQ1gsSUFBQyxDQUFBLEtBQUQsR0FBUztJQUNULENBQUEsR0FBSTtJQUNKLENBQUEsR0FBSTtJQUNKLElBQUMsQ0FBQSxJQUFELEdBQVE7SUFDUixJQUFDLENBQUEsTUFBRCxHQUFVO0lBRVYsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWtCLElBQUEsTUFBQSxDQUFPLENBQUMsRUFBRCxFQUFJLEVBQUosRUFBTyxFQUFQLEVBQVUsRUFBVixFQUFhLEVBQWIsQ0FBUCxFQUF3QixFQUF4QixFQUEyQixFQUEzQixFQUErQixFQUEvQixFQUFrQyxFQUFsQyxDQUFsQjtJQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFrQixJQUFBLE1BQUEsQ0FBTyxDQUFDLEVBQUQsRUFBSSxFQUFKLEVBQU8sRUFBUCxFQUFVLEVBQVYsRUFBYSxFQUFiLENBQVAsRUFBd0IsRUFBeEIsRUFBMkIsRUFBM0IsRUFBK0IsRUFBL0IsRUFBa0MsRUFBbEMsQ0FBbEI7SUFDQSxJQUFDLENBQUEsT0FBRCxHQUFnQixJQUFBLE1BQUEsQ0FBTyxDQUFQLEVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYyxJQUFkLEVBQWlCLEdBQWpCLEVBQXNCLENBQXRCLEVB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Q0FBQSxDQUFIO01BQ0MsUUFBQSxHQUREOztJQUVBLElBQUcsTUFBTSxDQUFDLE9BQVAsQ0FBZSxDQUFDLENBQUMsS0FBakIsQ0FBSDtNQUNDLE9BQUEsR0FERDs7QUFIRDtFQUtBLElBQUcsT0FBQSxHQUFVLENBQWI7SUFDQyxDQUFDLENBQUMsS0FBRixHQUREO0dBQUEsTUFBQTtJQUdDLENBQUMsQ0FBQyxLQUFGLEdBSEQ7O0VBSUEsSUFBRyxDQUFDLENBQUMsS0FBRixLQUFXLENBQWQ7V0FDQyxDQUFDLENBQUMsS0FBRixHQUFVLEVBRFg7O0FBWlciLCJzb3VyY2VzQ29udGVudCI6WyJnID0gMFxuaWRzID0ge31cblxuY2xhc3MgR2FtZVxuXHRjb25zdHJ1Y3RvciA6IChAeD0wLCBAeT0wLCBAYT0wLCBAcz0xLCBAc3RhY2s9W10pIC0+XG5cdFx0QHBsYXllcnMgPSBbXVxuXHRcdEBsZXZlbCA9IDFcblx0XHR3ID0gd2lkdGhcblx0XHRoID0gaGVpZ2h0ICAgXG5cdFx0QG1vZGUgPSAwICAgICBcblx0XHRAYml0bWFwID0gdHJ1ZSBcblxuXHRcdEBwbGF5ZXJzLnB1c2ggbmV3IFBsYXllciBbODcsNjUsODMsNjgsMTZdLDMwLDMwLCA2MCw2MFxuXHRcdEBwbGF5ZXJzLnB1c2ggbmV3IFBsYXllciBbMzgsMzcsNDAsMzksMTddLDkwLDMwLCA2MCw2MFxuXHRcdEBkaXNwbGF5ID0gIG5ldyBCdXR0b24gMSwxLDEsIEAsIDAuMiwgMCwgLTI0LCA2LCAxMiwgXCJcIixcIlwiXG5cblx0cHVzaCA6IC0+XG5cdFx0QHN0YWNrLnB1c2ggW0B4LEB5LEBhLEBzXVxuXHRcdHB1c2goKVxuXHRwb3AgOiAtPlxuXHRcdFtAeCxAeSxAYSxAc10gPSBAc3RhY2sucG9wKClcblx0XHRwb3AoKVxuXHRyb3RhdGUgOiAoZCkgLT5cblx0XHRyb3RhdGUgcmFkaWFucyBkXG5cdFx0QGEgKz0gZFxuXHRzY2FsZSA6IChkcykgLT5cblx0XHRzY2FsZSBkc1xuXHRcdEBzICo9IGRzXG5cdHRyYW5zbGF0ZSA6IChkeCxkeSkgLT5cblx0XHR2ID0gcmFkaWFucyBAYVxuXHRcdEB4ICs9IEBzICogZHggKiBjb3ModikgLSBAcyAqIGR5ICogc2luKHYpXG5cdFx0QHkgKz0gQHMgKiBkeSAqIGNvcyh2KSArIEBzICogZHggKiBzaW4odilcblx0XHR0cmFuc2xhdGUgZHgsZHlcblx0ZHVtcCA6ICh0eHQpIC0+XG5cdFx0cHJpbnQgdHh0LCBAeCxAeVxuXG5cdHByb2Nlc3MgOiAtPlxuXHRcdEBtb2RlID0gMSAtIEBtb2RlXG5cdFx0aWYgQG1vZGUgPT0gMFxuXHRcdFx0YXV0b2xldmVsKClcblx0XHRcdEBjcmVhdGVQcm9ibGVtKClcblxuXHRyZXN1bHQgOiAtPlxuXHRcdGZpbGwgMTI3XG5cdFx0cmVjdCAwLDAsd2lkdGgsaGVpZ2h0XG5cblx0XHRpZiBAcGxheWVyc1swXS5zdG9wcCA9PSAwXG5cdFx0XHRAcGxheWVyc1swXS5jb2xvciA9IGNvbG9yIDEyN1xuXHRcdGVsc2UgaWYgQHBsYXllcnNbMF0uc2NvcmUoKSA8IEBwbGF5ZXJzWzFdLnNjb3JlKCkgb3IgQHBsYXllcnNbMV0uc3RvcHAgPT0gMCAgXG5cdFx0XHRAcGxheWVyc1swXS5jb2xvciA9IGNvbG9yIDAsMjU1LDBcblx0XHRlbHNlXG5cdFx0XHRAcGxheWVyc1swXS5jb2xvciA9IGNvbG9yIDI1NSwwLDBcblxuXHRcdGlmIEBwbGF5ZXJzWzFdLnN0b3BwID09IDBcblx0XHRcdEBwbGF5ZXJzWzFdLmNvbG9yID0gY29sb3IgMTI3XG5cdFx0ZWxzZSBpZiBAcGxheWVyc1sxXS5zY29yZSgpIDwgQHBsYXllcnNbMF0uc2NvcmUoKSBvciBAcGxheWVyc1swXS5zdG9wcCA9PSAwICBcblx0XHRcdEBwbGF5ZXJzWzFdLmNvbG9yID0gY29sb3IgMCwyNTUsMFxuXHRcdGVsc2Vcblx0XHRcdEBwbGF5ZXJzWzFdLmNvbG9yID0gY29sb3IgMjU1LDAsMFxuXG5cdFx0Zm9yIHBsYXllciBpbiBAcGxheWVyc1xuXHRcdFx0cGxheWVyLnJlc3VsdCgpXG5cblx0XHRAc29sdmVfcmVzdWx0KClcdFxuXG5cdHNvbHZlX3Jlc3VsdCA6IC0+XG5cdFx0ZmlsbCAwXG5cdFx0biA9IDIwIFxuXHRcdEggPSBoZWlnaHQgLyBuXG5cdFx0dGV4dFNpemUgSFxuXG5cdFx0Zm9yIG51bWJlcixpIGluIEBzb2x1dGlvblxuXHRcdFx0eCA9IGludCBpIC8gblxuXHRcdFx0eSA9IGludCBpICUgblxuXHRcdFx0dGV4dCBudW1iZXIudG9TdHJpbmcoKSwgeCoxMDAsIC04LjUqSCArIHkqSFx0XHRcblxuXHRjcmVhdGVQcm9ibGVtIDogLT5cblx0XHR4ID0gaW50IHJhbmRvbSAtNSw2XG5cdFx0eSA9IGludCByYW5kb20gLTUsNlxuXHRcdGEgPSBuZXcgQ29tcGxleCB4LHlcblx0XHRsc3QgPSBbYV1cblx0XHR0cmVlID0ge31cblx0XHR0cmVlW2EudG9TdHJpbmcoKV0gPSBudWxsIFxuXHRcdGxzdDIgPSBbXVxuXG5cdFx0YzEgPSBuZXcgQ29tcGxleCAwLDFcblx0XHRjMiA9IG5ldyBDb21wbGV4IDIsMFxuXHRcdGMzID0gbmV3IENvbXBsZXggMSwwXG5cblx0XHRzYXZlID0gKGl0ZW0xLCBpdGVtMikgLT5cblx0XHRcdGlmIGl0ZW0yIG5vdCBvZiB0cmVlXG5cdFx0XHRcdGxzdDIucHVzaCBpdGVtMlxuXHRcdFx0XHR0cmVlW2l0ZW0yXSA9IGl0ZW0xXG5cblx0XHRmb3IgaiBpbiByYW5nZSBAbGV2ZWxcblx0XHRcdGxzdDIgPSBbXVxuXHRcdFx0Zm9yIGl0ZW0gaW4gbHN0XG5cdFx0XHRcdHNhdmUgaXRlbSwgaXRlbS5tdWwgYzFcblx0XHRcdFx0c2F2ZSBpdGVtLCBpdGVtLm11bCBjMlxuXHRcdFx0XHRzYXZlIGl0ZW0sIGl0ZW0uYWRkIGMzXG5cdFx0XHRcdHNhdmUgaXRlbSwgaXRlbS5taXIoKVxuXHRcdFx0bHN0ID0gbHN0MlxuXHRcdFx0XG5cdFx0YiA9IEBzZWxlY3RUYXJnZXQgbHN0XG5cdFx0QHNvbHV0aW9uID0gQHBhdGggYix0cmVlXG5cdFx0I2EgPSBuZXcgQ29tcGxleCgwLDMpXG5cdFx0I2IgPSBuZXcgQ29tcGxleCgwLC01KVxuXHRcdCNAc29sdXRpb24gPSBbbmV3IENvbXBsZXgoMCwzKSwgbmV3IENvbXBsZXgoLTMsMCksbmV3IENvbXBsZXgoLTYsMCksbmV3IENvbXBsZXgoLTUsMCksbmV3IENvbXBsZXgoMCwtNSldXG5cdFx0cHJpbnQgQHNvbHV0aW9uLmpvaW4oJyAnKVxuXG5cdFx0ZCA9IG5ldyBEYXRlKClcblx0XHRtcyA9IGludCBkLmdldFRpbWUoKVxuXHRcdGZvciBwbGF5ZXIgaW4gQHBsYXllcnNcblx0XHRcdHBsYXllci5oaXN0b3J5ID0gW2FdXG5cdFx0XHRwbGF5ZXIudGFyZ2V0ID0gYlxuXHRcdFx0cGxheWVyLmNvdW50ID0gMFxuXHRcdFx0cGxheWVyLnN0YXJ0ID0gbXMgXG5cdFx0XHRwbGF5ZXIuc3RvcHAgPSAwXG5cdFx0XHRwbGF5ZXIubGV2ZWwgPSBAbGV2ZWxcblxuXHRwYXRoIDogKGIsdHJlZSkgLT5cblx0XHRyZXR1cm4gW10gaWYgYiA9PSBudWxsXG5cdFx0QHBhdGgodHJlZVtiXSwgdHJlZSkuY29uY2F0IFtiXVxuXG5cdHNlbGVjdFRhcmdldCA6IChsc3QpIC0+ICMgd2l0aGluIDIxeDIxIHdpbmRvdywgaWYgcG9zc2libGVcblx0XHRicyA9IChpdGVtIGZvciBpdGVtIGluIGxzdCB3aGVuIC0xMCA8IGl0ZW0ueCA8PSAxMCBhbmQgLTEwIDwgaXRlbS55IDw9IDEwKVxuXHRcdHJldHVybiBfLnNhbXBsZSBicyBpZiBicy5sZW5ndGggPiAwXG5cdFx0Xy5taW4gbHN0LCAoaXRlbSkgLT4gZGlzdCAwLDAsaXRlbS54LGl0ZW0ueVxuXG5zZXR1cCA9IC0+XG5cdGNyZWF0ZUNhbnZhcyB3aW5kb3dXaWR0aCwgd2luZG93SGVpZ2h0XG5cdGZyYW1lUmF0ZSAxNVxuXHR0ZXh0QWxpZ24gQ0VOVEVSLENFTlRFUlxuXHRyZWN0TW9kZSBDRU5URVJcblx0I25vU21vb3RoKClcblx0ZyA9IG5ldyBHYW1lKClcblx0Zy5jcmVhdGVQcm9ibGVtKClcdFx0XG5cdHhkcmF3KClcblxueGRyYXcgPSAtPlxuXHRiZyAwLjVcblx0Zy5wdXNoKClcblx0Zy50cmFuc2xhdGUgaW50KHdpZHRoLzIpLCBpbnQoaGVpZ2h0LzIpXHQjIGludGVnZXJzIG5lZWRlZCBoZXJlIG9yIGJsdXJyeSBncmlkIGxpbmVzXG5cblx0Zm9yIHBsYXllcixpIGluIGcucGxheWVyc1xuXHRcdGcucHVzaCgpXG5cdFx0Zy50cmFuc2xhdGUgKDIqaS0xKSAqIHdpZHRoLzQsIDBcblx0XHRpZiBnLm1vZGU9PTBcblx0XHRcdHBsYXllci5kcmF3KClcblx0XHRlbHNlXG5cdFx0XHRwbGF5ZXIucmVzdWx0KCkgXG5cdFx0Zy5wb3AoKVxuXHRnLmRpc3BsYXkuZHJhdygpXHRcblx0Zy5wb3AoKVxuXG50b3VjaFN0YXJ0ZWQgPSAtPiBcblx0Zm9yIHRvdWNoIGluIHRvdWNoZXNcblx0XHRpZiB0b3VjaC5pZCBub3Qgb2YgaWRzIFxuXHRcdFx0aWRzW3RvdWNoLmlkXSA9IHRvdWNoXG5cdFx0XHRmb3IgcGxheWVyIGluIGcucGxheWVyc1xuXHRcdFx0XHRwbGF5ZXIudG91Y2hTdGFydGVkIHRvdWNoLngsdG91Y2gueVxuXHRpZHMgPSB7fSBpZiB0b3VjaC5sZW5ndGggPT0gMFxuXHRnLmRpc3BsYXkudG91Y2hTdGFydGVkIHRvdWNoLngsdG91Y2gueVxuXHR4ZHJhdygpXG5cbm1vdXNlUHJlc3NlZCA9IC0+XG5cdHByaW50IFwiaFwiXG5cdHBsYXllci5tb3VzZVByZXNzZWQoKSBmb3IgcGxheWVyIGluIGcucGxheWVyc1xuXHRnLmRpc3BsYXkubW91c2VQcmVzc2VkKClcblx0eGRyYXcoKVxuXG5rZXlQcmVzc2VkID0gLT5cblx0I3ByaW50IGtleSwga2V5Q29kZVxuXHRpZiBrZXkgPT0gJyAnIFxuXHRcdGcuZGlzcGxheS5rZXlQcmVzc2VkIGtleVxuXHRlbHNlIGlmIGtleSA9PSAnQidcblx0XHRnLmJpdG1hcCA9IG5vdCBnLmJpdG1hcFxuXHRlbHNlXG5cdFx0cGxheWVyLmtleVByZXNzZWQga2V5IGZvciBwbGF5ZXIgaW4gZy5wbGF5ZXJzXG5cdHhkcmF3KClcblxuYXV0b2xldmVsID0gLT5cblx0ZmluaXNoZWQgPSAwXG5cdHBlcmZlY3QgPSAwXG5cdGZvciBwbGF5ZXIgaW4gZy5wbGF5ZXJzXG5cdFx0aWYgcGxheWVyLmZpbmlzaGVkKClcblx0XHRcdGZpbmlzaGVkKytcblx0XHRpZiBwbGF5ZXIucGVyZmVjdCBnLmxldmVsXG5cdFx0XHRwZXJmZWN0KytcdFxuXHRpZiBwZXJmZWN0ID4gMFxuXHRcdGcubGV2ZWwrK1xuXHRlbHNlIFxuXHRcdGcubGV2ZWwtLVxuXHRpZiBnLmxldmVsID09IDBcblx0XHRnLmxldmVsID0gMVxuIl19
//# sourceURL=C:\github\p5Complex\www\sketch.coffee
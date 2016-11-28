// Generated by CoffeeScript 1.11.1
var Button;

Button = (function() {
  function Button(r, g1, b, parent, x1, y1, w, h, key1, txt) {
    this.r = r;
    this.g = g1;
    this.b = b;
    this.parent = parent;
    this.x = x1;
    this.y = y1;
    this.w = w;
    this.h = h;
    this.key = key1;
    this.txt = txt;
    this.w0 = 99;
    this.h0 = 99;
  }

  Button.prototype.draw = function() {
    g.push();
    g.translate(width * this.x / 60, height * this.y / 60);
    this.x0 = g.x;
    this.y0 = g.y;
    this.w0 = g.s * width * this.w / 60;
    this.h0 = g.s * height * this.h / 60;
    fc(1, 1, 1, 0.5);
    rect(0, 0, width * this.w / 60, height * this.h / 60);
    fc(this.r, this.g, this.b);
    textSize((this.h0 + this.w0) / 6);
    text(this.txt, 0, 0);
    return g.pop();
  };

  Button.prototype.mousePressed = function() {
    if ((this.x0 - this.w0 / 2 <= mouseX && mouseX <= this.x0 + this.w0 / 2) && (this.y0 - this.h0 / 2 <= mouseY && mouseY <= this.y0 + this.h0 / 2)) {
      return this.parent.process(this.key);
    }
  };

  Button.prototype.touchStarted = function(x, y) {
    if ((this.x0 - this.w0 / 2 <= x && x <= this.x0 + this.w0 / 2) && (this.y0 - this.h0 / 2 <= y && y <= this.y0 + this.h0 / 2)) {
      return this.parent.process(this.key);
    }
  };

  Button.prototype.keyPressed = function(key) {
    if (this.key === key) {
      return this.parent.process(this.key);
    }
  };

  return Button;

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnV0dG9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQnV0dG9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQTs7QUFBTTtFQUNRLGdCQUFDLENBQUQsRUFBSSxFQUFKLEVBQU8sQ0FBUCxFQUFXLE1BQVgsRUFBbUIsRUFBbkIsRUFBc0IsRUFBdEIsRUFBeUIsQ0FBekIsRUFBNEIsQ0FBNUIsRUFBK0IsSUFBL0IsRUFBb0MsR0FBcEM7SUFBQyxJQUFDLENBQUEsSUFBRDtJQUFHLElBQUMsQ0FBQSxJQUFEO0lBQUcsSUFBQyxDQUFBLElBQUQ7SUFBSSxJQUFDLENBQUEsU0FBRDtJQUFRLElBQUMsQ0FBQSxJQUFEO0lBQUcsSUFBQyxDQUFBLElBQUQ7SUFBRyxJQUFDLENBQUEsSUFBRDtJQUFHLElBQUMsQ0FBQSxJQUFEO0lBQUcsSUFBQyxDQUFBLE1BQUQ7SUFBSyxJQUFDLENBQUEsTUFBRDtJQUNoRCxJQUFDLENBQUEsRUFBRCxHQUFJO0lBQ0osSUFBQyxDQUFBLEVBQUQsR0FBSTtFQUZROzttQkFJYixJQUFBLEdBQU8sU0FBQTtJQUNOLENBQUMsQ0FBQyxJQUFGLENBQUE7SUFDQSxDQUFDLENBQUMsU0FBRixDQUFZLEtBQUEsR0FBTSxJQUFDLENBQUEsQ0FBUCxHQUFTLEVBQXJCLEVBQXlCLE1BQUEsR0FBTyxJQUFDLENBQUEsQ0FBUixHQUFVLEVBQW5DO0lBRUEsSUFBQyxDQUFBLEVBQUQsR0FBTSxDQUFDLENBQUM7SUFDUixJQUFDLENBQUEsRUFBRCxHQUFNLENBQUMsQ0FBQztJQUVSLElBQUMsQ0FBQSxFQUFELEdBQU0sQ0FBQyxDQUFDLENBQUYsR0FBSSxLQUFKLEdBQVUsSUFBQyxDQUFBLENBQVgsR0FBYTtJQUNuQixJQUFDLENBQUEsRUFBRCxHQUFNLENBQUMsQ0FBQyxDQUFGLEdBQUksTUFBSixHQUFXLElBQUMsQ0FBQSxDQUFaLEdBQWM7SUFFcEIsRUFBQSxDQUFHLENBQUgsRUFBSyxDQUFMLEVBQU8sQ0FBUCxFQUFTLEdBQVQ7SUFDQSxJQUFBLENBQUssQ0FBTCxFQUFRLENBQVIsRUFBWSxLQUFBLEdBQU0sSUFBQyxDQUFBLENBQVAsR0FBUyxFQUFyQixFQUF5QixNQUFBLEdBQU8sSUFBQyxDQUFBLENBQVIsR0FBVSxFQUFuQztJQUVBLEVBQUEsQ0FBRyxJQUFDLENBQUEsQ0FBSixFQUFNLElBQUMsQ0FBQSxDQUFQLEVBQVMsSUFBQyxDQUFBLENBQVY7SUFDQSxRQUFBLENBQVMsQ0FBQyxJQUFDLENBQUEsRUFBRCxHQUFJLElBQUMsQ0FBQSxFQUFOLENBQUEsR0FBVSxDQUFuQjtJQUNBLElBQUEsQ0FBSyxJQUFDLENBQUEsR0FBTixFQUFVLENBQVYsRUFBWSxDQUFaO1dBQ0EsQ0FBQyxDQUFDLEdBQUYsQ0FBQTtFQWhCTTs7bUJBa0JQLFlBQUEsR0FBZSxTQUFBO0lBQUcsSUFBeUIsQ0FBQSxJQUFDLENBQUEsRUFBRCxHQUFJLElBQUMsQ0FBQSxFQUFELEdBQUksQ0FBUixJQUFhLE1BQWIsSUFBYSxNQUFiLElBQXVCLElBQUMsQ0FBQSxFQUFELEdBQUksSUFBQyxDQUFBLEVBQUQsR0FBSSxDQUEvQixDQUFBLElBQXFDLENBQUEsSUFBQyxDQUFBLEVBQUQsR0FBSSxJQUFDLENBQUEsRUFBRCxHQUFJLENBQVIsSUFBYSxNQUFiLElBQWEsTUFBYixJQUF1QixJQUFDLENBQUEsRUFBRCxHQUFJLElBQUMsQ0FBQSxFQUFELEdBQUksQ0FBL0IsQ0FBOUQ7YUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBZ0IsSUFBQyxDQUFBLEdBQWpCLEVBQUE7O0VBQUg7O21CQUNmLFlBQUEsR0FBZSxTQUFDLENBQUQsRUFBRyxDQUFIO0lBQVMsSUFBeUIsQ0FBQSxJQUFDLENBQUEsRUFBRCxHQUFJLElBQUMsQ0FBQSxFQUFELEdBQUksQ0FBUixJQUFhLENBQWIsSUFBYSxDQUFiLElBQWtCLElBQUMsQ0FBQSxFQUFELEdBQUksSUFBQyxDQUFBLEVBQUQsR0FBSSxDQUExQixDQUFBLElBQWdDLENBQUEsSUFBQyxDQUFBLEVBQUQsR0FBSSxJQUFDLENBQUEsRUFBRCxHQUFJLENBQVIsSUFBYSxDQUFiLElBQWEsQ0FBYixJQUFrQixJQUFDLENBQUEsRUFBRCxHQUFJLElBQUMsQ0FBQSxFQUFELEdBQUksQ0FBMUIsQ0FBekQ7YUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBZ0IsSUFBQyxDQUFBLEdBQWpCLEVBQUE7O0VBQVQ7O21CQUNmLFVBQUEsR0FBYSxTQUFDLEdBQUQ7SUFBUyxJQUF5QixJQUFDLENBQUEsR0FBRCxLQUFRLEdBQWpDO2FBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENBQWdCLElBQUMsQ0FBQSxHQUFqQixFQUFBOztFQUFUIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQnV0dG9uXG5cdGNvbnN0cnVjdG9yOiAoQHIsQGcsQGIsIEBwYXJlbnQsQHgsQHksQHcsQGgsQGtleSxAdHh0KSAtPiAjIHNpeHRpZXNcblx0XHRAdzA9OTlcblx0XHRAaDA9OTlcblxuXHRkcmF3IDogLT5cblx0XHRnLnB1c2goKVxuXHRcdGcudHJhbnNsYXRlIHdpZHRoKkB4LzYwLCBoZWlnaHQqQHkvNjBcblxuXHRcdEB4MCA9IGcueFxuXHRcdEB5MCA9IGcueVxuXG5cdFx0QHcwID0gZy5zKndpZHRoKkB3LzYwXG5cdFx0QGgwID0gZy5zKmhlaWdodCpAaC82MFxuXG5cdFx0ZmMgMSwxLDEsMC41XG5cdFx0cmVjdCAwLCAwLCAgd2lkdGgqQHcvNjAsIGhlaWdodCpAaC82MFxuXG5cdFx0ZmMgQHIsQGcsQGJcblx0XHR0ZXh0U2l6ZSAoQGgwK0B3MCkvNlxuXHRcdHRleHQgQHR4dCwwLDAgXG5cdFx0Zy5wb3AoKVxuXG5cdG1vdXNlUHJlc3NlZCA6IC0+IEBwYXJlbnQucHJvY2VzcyhAa2V5KSBpZiBAeDAtQHcwLzIgPD0gbW91c2VYIDw9IEB4MCtAdzAvMiBhbmQgQHkwLUBoMC8yIDw9IG1vdXNlWSA8PSBAeTArQGgwLzIgXG5cdHRvdWNoU3RhcnRlZCA6ICh4LHkpIC0+IEBwYXJlbnQucHJvY2VzcyhAa2V5KSBpZiBAeDAtQHcwLzIgPD0geCA8PSBAeDArQHcwLzIgYW5kIEB5MC1AaDAvMiA8PSB5IDw9IEB5MCtAaDAvMiBcblx0a2V5UHJlc3NlZCA6IChrZXkpIC0+IEBwYXJlbnQucHJvY2VzcyhAa2V5KSBpZiBAa2V5ID09IGtleVxuXHRcdFx0Il19
//# sourceURL=C:\github\p5Complex\www\Button.coffee
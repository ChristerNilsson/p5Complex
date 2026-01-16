class Complex 
	constructor : (@x,@y) ->
	add : (other) ->
		new Complex @x+other.x, @y+other.y
	mul : (other) ->
		a = @x
		b = @y
		c = other.x
		d = other.y
		new Complex a*c-b*d, b*c+a*d
	mir : ->
		new Complex @y, @x
	toString : ->
		sx = "" if @x == 0
		sx = "#{@x}" if @x > 0
		sx = "#{@x}" if @x < 0

		sy = "" if @y == 0
		sy = "-i" if @y == -1
		sy = "i" if @y == 1
		sy = "#{@y}i" if @y > 1
		sy = "#{@y}i" if @y < -1

		if sx!="" and sy!=""
			if @y < 0
				s = sx+sy
			else if @y==0
				s = sx
			else
				s = sx + "+" + sy
		else if @x==0 and @y==0
			s = "0"
		else 
			s = sx + sy
		s
assert "-1", new Complex(-1,0).toString()
assert "-1-i", new Complex(-1,-1).toString()
assert "-i", new Complex(0,-1).toString()
assert "0", new Complex(0,0).toString()
assert "i", new Complex(0,1).toString()
assert "1-2i", new Complex(1,-2).toString()
assert "1-i", new Complex(1,-1).toString()
assert "1", new Complex(1,0).toString()
assert "1+i", new Complex(1,1).toString()
assert "1+2i", new Complex(1,2).toString()


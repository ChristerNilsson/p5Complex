class Button
	constructor: (@parent,@x,@y,@w,@h,@key,@txt) -> # sixties
		@w0=99
		@h0=99

	draw : ->
		g.push()
		g.translate width*@x/60, height*@y/60

		@x0 = g.x
		@y0 = g.y

		@w0 = g.s*width*@w/60
		@h0 = g.s*height*@h/60

		fc 1,1,1,0.5
		rect 0, 0,  width*@w/60, height*@h/60

		fc 0
		textSize (@h0+@w0)/6
		text @txt,0,0 
		g.pop()

	mousePressed : -> @parent.process(@key) if @x0-@w0/2 <= mouseX <= @x0+@w0/2 and @y0-@h0/2 <= mouseY <= @y0+@h0/2 
	touchStarted : (x,y) -> @parent.process(@key) if @x0-@w0/2 <= x <= @x0+@w0/2 and @y0-@h0/2 <= y <= @y0+@h0/2 
	keyPressed : (key) -> @parent.process(@key) if @key == key
			
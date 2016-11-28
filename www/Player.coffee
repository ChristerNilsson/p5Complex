class Player

	constructor: (keys,x,y,@w,@h) ->  # sixties
		@M = 120
		@N = 60
		@keys = keys
		@history = [3]
		@target = 2
		@count = 0
		@level = 0

		@buttons = []                             # x     y    w   h (relativt centrum)
		@buttons.push new Button 0,0.5,0, @, 0,   -7.5, -24, 6, 12, "","a"
		@buttons.push new Button 1,0,0,   @, 0,    7.5, -24, 6, 12, "","b"
		@buttons.push new Button 0,0,0,   @, 0.2,   0,  -24, 6, 12, keys[0],"1" # undo
		@buttons.push new Button 1,1,0,   @, 0.2, -10.5, 24, 6, 12, keys[1],"*i"
		@buttons.push new Button 1,1,0,   @, 0.2,   0.0, 24, 6, 12, keys[2],"*2"
		@buttons.push new Button 1,1,0,   @, 0.2,  10.5, 24, 6, 12, keys[3],"+1"

	draw : ->
		@complexBitmap()
		if @finished()
			fc 0,1,0,0.1
		else
			fc 0.5,0.5,0.5,0.5

		rect 0,0, width * @w / @M, height * @h / @N 
		print @history
		@buttons[2].alpha = if @history.length == 1 then 0 else 0.2
		@buttons[0].txt = @top().toString()
		@buttons[1].txt = @target.toString()
		@buttons[2].txt = @level - @history.length + 1

		for button in @buttons
			button.draw()

	complexBitmap : ->
		n = int width/40

		fc 0
		rect 0,0,20*n,20*n
		sc 1,1,0
		sw 1
		for i in range 21

			# hor Lines
			x1 = -10*n
			y = lerp -10*n, -9*n, i
			x2 = 10*n
			line x1,y,x2,y

			# ver lines
			x = lerp -10*n, -9*n, i
			y1 = -10*n
			y2 = 10*n
			line x,y1,x,y2 

		sw 3
		line 0,y1,0,y2
		line x1,0,x2,0 

		if ! @finished()
			@complexPoint n,1,1,0, @top().mul new Complex 0,1
			@complexPoint n,1,1,0, @top().mul new Complex 2,0
			@complexPoint n,1,1,0, @top().add new Complex 1,0
		@complexPoint n,1,0,0, @target
		@complexPoint n,0,1,0, @top()

	complexPoint : (n,r,g,b,c)->
		if abs c.x <= 10 and abs c.y <= 10 
			fc r,g,b,0.75
			sc()
			circle n*c.x,-n*c.y,n/2

	process : (key) ->
		if @finished()
			return
		@history.pop() if key==@keys[0] and @history.length>1
		@save @top().mul new Complex 0,1 if key==@keys[1]
		@save @top().mul new Complex 2,0 if key==@keys[2]
		@save @top().add new Complex 1,0 if key==@keys[3] 

	save : (value) ->
		@count++
		@history.push value
		if @finished()
			d = new Date()
			ms = d.getTime()
			@stopp = int ms 

	mousePressed : -> button.mousePressed() for button in @buttons 
	touchStarted : (x,y) -> button.touchStarted x,y for button in @buttons 
	keyPressed : (key) -> button.keyPressed key for button in @buttons

	score : -> (@stopp - @start)/1000 + @count * 10 
	top : -> @history[@history.length-1]
	finished : -> @top().toString() == @target.toString()		
	perfect : (level) -> @finished() and @count <= level

	digits = (x) ->
		return x.toFixed 3 if x<100
		return x.toFixed 2 if x<1000
		return x.toFixed 1 if x<10000
		return x.toFixed 0

	result :() ->
		n = 20
		if @stopp == 0
			return
		fill @color
		H = height / n
		textSize H
		if @keys=="WASD" # left
			x0 = -width/8
			dx = -width/8
		else
			x0 = width/8
			dx = width/8
		text digits(@score()), x0, -9.5*H 
		for number,i in @history
			x = int i / (n-1)
			y = int i % (n-1)
			text number, x0+x*dx, -8.5*H + y*H

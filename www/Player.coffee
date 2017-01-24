class Player

	constructor: (keys,x,y,@w,@h) ->  # sixties
		@M = 120
		@N = 60
		@keys = keys
		@history = []
		@target = 2
		@count = 0
		@level = 0

		@buttons = []                             # x     y    w   h (relativt centrum)
		@buttons.push new Button 0,1,0,   @, 0,   -7.5, -24, 6, 12, "","a"
		@buttons.push new Button 1,0,0,   @, 0,    7.5, -24, 6, 12, "","b"
		@buttons.push new Button 1,1,1,   @, 0.2,   0,  -24, 6, 12, keys[0],"1" # undo
		@buttons.push new Button 1,1,0,   @, 0.2,   -11, 24, 6, 12, keys[4],"m"
		@buttons.push new Button 1,1,0,   @, 0.2, -3.67, 24, 6, 12, keys[1],"*i"
		@buttons.push new Button 1,1,0,   @, 0.2,  3.67, 24, 6, 12, keys[2],"*2"
		@buttons.push new Button 1,1,0,   @, 0.2,  11, 24, 6, 12, keys[3],"+1"

	draw : ->
		@gridWithOneMove() if g.bitmap 
		if @finished()
			fc 0,1,0,0.1 # green
			rect 0,0, width * @w / @M, height * @h / @N 

		@buttons[2].alpha = if @history.length == 1 then 0 else 0.2
		@buttons[0].txt = @top().toString()
		@buttons[1].txt = @target.toString()
		@buttons[2].txt = @level - @history.length + 1

		for button in @buttons
			button.draw()

	grid : (m,n) ->
		fc 0
		rect 0,0,20*n,20*n
		sc 1,1,1
		sw 1
		strokeCap SQUARE
		for i in range 21
			p = lerp -10*n, -9*n, i 
			line -m,p,m,p # hor lines
			line p,-m,p,m # ver lines
		sw 3
		line 0,-m,0,m
		line -m,0,m,0 

	gridWithOneMove : ->
		n = int width/40
		m = 10*n

		@grid m,n

		if ! @finished()
			@complexPoint n,1,1,0, @top().mul new Complex 0,1
			@complexPoint n,1,1,0, @top().mul new Complex 2,0
			@complexPoint n,1,1,0, @top().add new Complex 1,0
			@complexPoint n,1,1,0, @top().mir()
		@complexPoint n,1,0,0, @target
		@complexPoint n,0,1,0, @top()

	draw_path : (path,n,thickness, r,g,b) ->
		sw thickness
		fc()
		sc r,g,b
		strokeCap ROUND
		for move,i in path
			continue if i == 0
			a = path[i-1]
			radius = n*dist(0,0,a.x,a.y) 
			if radius == n*dist(0,0,move.x,move.y) and not (move.x == a.y and move.y == a.x)
				start = - HALF_PI + atan2 a.x,a.y
				stopp = - HALF_PI + atan2 move.x,move.y
				#print a.x,a.y, move.x,move.y, radius,start,stopp
				arc 0,0, 2*radius,2*radius, stopp,start
			else
				line n*a.x, -n*a.y, n*move.x, -n*move.y

	gridWithAllMoves : ->
		n = int width/40
		m = 10*n
		@grid m,n

		@draw_path @history,  n,9, 1,1,1
		@draw_path g.solution,n,5, 1,0,0  # bug in arc?. cannot handle strokeWeight > 1

		for move in @history
			@complexPoint n,1,1,0, move, n/2-2
		for move in g.solution
			@complexPoint n,1,1,0, move, n/4

		@complexPoint n,1,0,0, @target
		@complexPoint n,0,1,0, @history[0]

	complexPoint : (n,r,g,b,c,radius=n/2-(g*2))->
		if abs(c.x) <= 10 and abs(c.y) <= 10 
			sc()
			fc r,g,b,0.75
			circle n*c.x,-n*c.y,radius

	process : (key) ->
		print "pro"
		if @finished()
			return
		@history.pop() if key == @keys[0] and @history.length>1
		@save @top().mul new Complex 0,1 if key ==@keys[1]
		@save @top().mul new Complex 2,0 if key ==@keys[2]
		@save @top().add new Complex 1,0 if key ==@keys[3] 
		@save @top().mir() if key ==@keys[4] 

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

#	score : -> (@stopp - @start)/1000 + @count * 10 
	score : -> (@stopp - @start)/1000 + (@history.length - 1) * 10 
	top : -> @history[@history.length-1]
	finished : -> @top().toString() == @target.toString()		
	perfect : (level) ->
		@finished() and @history.length - 1 <= level

	digits = (x) ->
		return x.toFixed 3 if x<100
		return x.toFixed 2 if x<1000
		return x.toFixed 1 if x<10000
		return x.toFixed 0

	result :() ->
		n = 20
		if @stopp == 0
			return

		@gridWithAllMoves()

		#fill @color
		H = height / n
		textSize H
		if _.isEqual @keys,[87, 65, 83, 68, 16]# left
			x0 = width/8
		# 	dx = -width/8
		else
			x0 = -width/8
		# 	dx = width/8
		text digits(@score()), x0, -9.5*H 
		# for number,i in @history
		# 	x = int i / (n-1)
		# 	y = int i % (n-1)
		# 	text number, x0+x*dx, -8.5*H + y*H 


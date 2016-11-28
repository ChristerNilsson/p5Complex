g = 0
ids = {}

class Game
	constructor : (@x=0, @y=0, @a=0, @s=1, @stack=[]) ->
		@players = []
		@level = 1
		w = width
		h = height   
		@mode = 0                                                     
		@players.push new Player "WASD",30,30, 60,60
		@players.push new Player "&%('",90,30, 60,60
		@display = new Button 0,0,0, @, 0.2, 0, -22, 8, 12, "",""
	push : ->
		@stack.push [@x,@y,@a,@s]
		push()
	pop : ->
		[@x,@y,@a,@s] = @stack.pop()
		pop()
	rotate : (d) ->
		rotate radians d
		@a += d
	scale : (ds) ->
		scale ds
		@s *= ds
	translate : (dx,dy) ->
		v = radians @a
		@x += @s * dx * cos(v) - @s * dy * sin(v)
		@y += @s * dy * cos(v) + @s * dx * sin(v)
		translate dx,dy
	dump : (txt) ->
		print txt, @x,@y

	process : ->
		@mode = 1 - @mode
		if @mode == 0
			autolevel()
			@createProblem()

	result : ->
		fill 127
		rect 0,0,width,height

		if @players[0].stopp == 0
			@players[0].color = color 127
		else if @players[0].score() < @players[1].score() or @players[1].stopp == 0  
			@players[0].color = color 0,255,0
		else
			@players[0].color = color 255,0,0

		if @players[1].stopp == 0
			@players[1].color = color 127
		else if @players[1].score() < @players[0].score() or @players[0].stopp == 0  
			@players[1].color = color 0,255,0
		else
			@players[1].color = color 255,0,0

		for player in @players
			player.result()

		@solve_result()	

	solve_result : ->
		fill 0
		n = 20 
		H = height / n
		textSize H

		for number,i in @solution
			x = int i / n
			y = int i % n
			text number.toString(), x*100, -8.5*H + y*H		

	createProblem : ->
		x = int random -5,6
		y = int random -5,6
		a = new Complex x,y
		lst = [a]
		tree = {}
		tree[a.toString()] = null 
		lst2 = []

		c1 = new Complex 0,1
		c2 = new Complex 2,0
		c3 = new Complex 1,0

		save = (item1, item2) ->
			if item2 not of tree
				lst2.push item2
				tree[item2] = item1

		for j in range @level
			lst2 = []
			for item in lst
				save item, item.mul c1
				save item, item.mul c2
				save item, item.add c3
			lst = lst2
			
		b = @selectTarget lst
		@solution = @path b,tree

		d = new Date()
		ms = int d.getTime()
		for player in @players
			player.history = [a]
			player.target = b
			player.count = 0
			player.start = ms 
			player.stopp = 0
			player.level = @level

	path : (b,tree) ->
		return [] if b == null
		@path(tree[b], tree).concat([b])

	selectTarget : (lst) -> # within 21x21 window, if possible
		bs = (item for item in lst when -10 < item.x <= 10 and -10 < item.y <= 10)
		_.sample if bs.length > 0 then bs else lst

setup = ->
	createCanvas windowWidth, windowHeight
	frameRate 15
	textAlign CENTER,CENTER
	rectMode CENTER
	strokeCap SQUARE
	noSmooth()
	g = new Game()
	g.createProblem()		
	xdraw()

xdraw = ->
	g.push()
	g.translate int(width/2), int(height/2)	# integers needed here or blurry grid lines

	for player,i in g.players
		g.push()
		g.translate (2*i-1) * width/4, 0
		player.draw()
		g.pop()
  g.result() if g.mode==1
	g.display.draw()	
	g.pop()

touchStarted = -> 
	for touch in touches
		if touch.id not of ids 
			ids[touch.id] = touch
			for player in g.players
				player.touchStarted(touch.x,touch.y)
	ids = {} if touch.length == 0
	g.display.touchStarted(touch.x,touch.y)
	xdraw()

mousePressed = ->
	player.mousePressed() for player in g.players
	g.display.mousePressed()
	xdraw()

keyPressed = ->
	player.keyPressed(key) for player in g.players
	if key == ' ' 
		autolevel()
		g.createProblem()
	xdraw()

autolevel = ->
	finished = 0
	perfect = 0
	for player in g.players
		if player.finished()
			finished++
		if player.perfect g.level
			perfect++	
	if perfect > 0
		g.level++
	else 
		g.level--
	if g.level == 0
		g.level = 1

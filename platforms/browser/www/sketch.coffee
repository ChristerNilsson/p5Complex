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
		@display = new Button @, 0, -22, 8, 12, "",""
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
		solution = solve(@players[0].history[0], @players[0].target)

		for number,i in solution
			x = int i / n
			y = int i % n
			text number, x*100, -8.5*H + y*H		

	createProblem : ->
		n = int Math.pow 2, 4+@level/3 # nodes
		a = int random 1,n/2
		lst = [a]
		tree = [a]
		lst2 = []
		save = (item) ->
			if Math.floor(item) == item and item <= n
				if item not in tree
					lst2.push item
					tree.push item
		for j in range @level
			lst2 = []
			for item in lst
				save item+2 
				save item*2
				save item/2
			lst = lst2
		i = int random lst.length
		b = lst[i]

		d = new Date()
		ms = int d.getTime()
		for player in @players
			player.history = [a]
			player.target = b
			player.count = 0
			player.start = ms 
			player.stopp = 0
			player.level = @level

setup = ->
	createCanvas windowWidth, windowHeight
	frameRate 15
	textAlign CENTER,CENTER
	rectMode CENTER
	g = new Game()
	g.createProblem()		
	xdraw()

xdraw = ->
	g.push()
	g.translate width/2, height/2	

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

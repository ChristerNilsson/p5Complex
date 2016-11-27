class Player

	constructor: (keys,x,y,@w,@h) ->  # sixties
		@M = 120
		@N = 60
		@keys = keys
		@x = width * x / @M # centrum pixels
		@y = height * y / @N # centrum pixels
		@history = [3]
		@target = 2
		@count = 0
		@level = 0

		@buttons = []              # x   y   w   h (relativt centrum)
		@buttons.push new Button @,-10, -5, 7.5, 15, "","3"
		@buttons.push new Button @, 10, -5, 7.5, 15, "","2"
		@buttons.push new Button @,  0, -5, 7.5, 15, keys[0],"undo"
		@buttons.push new Button @,-10, 15, 7.5, 15, keys[1],"/2"
		@buttons.push new Button @,  0, 15, 7.5, 15, keys[2],"+2"
		@buttons.push new Button @, 10, 15, 7.5, 15, keys[3],"*2"

	draw : ->
		if @keys == "WASD"
			if @target==@top()
				fc 0,1,0
			else
				fc 1,1,0
		else
			if @target==@top()
				fc 0,1,0
			else
				fc 1,0,0

		rect 0,0, width * @w / @M, height * @h / @N 
		@buttons[0].txt = @top().toString()
		@buttons[1].txt = @target.toString()
		for button in @buttons
			button.draw()
		textSize height/20
		fc 0.5
		text @level - @history.length + 1, 0, height * 0.45

	process : (key) ->
		if @target==@top()
			return
		@history.pop() if key==@keys[0] and @history.length>1
		@save(@top() / 2) if key==@keys[1] and @top()%2==0
		@save(@top() + 2) if key==@keys[2] 
		@save(@top() * 2) if key==@keys[3]

	save : (value) ->
		@count++
		@history.push value
		if @target==@top()
			d = new Date()
			ms = d.getTime()
			@stopp = int ms 

	mousePressed : -> button.mousePressed() for button in @buttons 
	touchStarted : (x,y) -> button.touchStarted(x,y) for button in @buttons 
	keyPressed : (key) -> button.keyPressed(key) for button in @buttons

	score : -> (@stopp - @start)/1000 + @count * 10 
	top : -> @history[@history.length-1]
	finished : -> @top() == @target		
	perfect : (level) -> @finished() and @count <= level

	digits = (x) ->
		return x.toFixed(3) if x<100
		return x.toFixed(2) if x<1000
		return x.toFixed(1) if x<10000
		return x.toFixed(0)

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

function solve(num,tar) {

	var q = new Deque()
	var q1 = new Deque()
	var hash = {}
	var hash1 = {}
	var liste = []
	var liste1 = []
	var mode = 0

	function problemsolver(num,tar) {
		hash[num] = 0
		q.push(num)
		hash1[tar] = 0
		q1.push(tar)
		while (isitins(hash,hash1) == -1) {
			if (mode == 0) {
				step()
				mode = 1
			} else if (mode == 1) {
				step1()
				mode = 0
			}
		}
		var v = int(isitins(hash,hash1))
		solution(v)
		liste.shift()
		var answer = reverse(liste)
		solution1(v)
		return answer.concat(liste1)
	}

	function step1() {
		var q1_2 = new Deque()
		while (q1.length>0) {
			var i1 = q1.shift()
			if (i1>1) {
				expand1(i1,i1-2,q1_2)
			}
			expand1(i1,i1*2,q1_2)
			if (i1%2===0) {
				expand1(i1,i1/2,q1_2)
			}
		}
		q1=q1_2
	}

	function step() {
		var q_2 = new Deque()
		while (q.length > 0) {
			var i = q.shift()
			expand(i,i+2,q_2)
			expand(i,i*2,q_2)
			if (i%2 == 0) {
				expand(i,i/2,q_2)
			}
		}
		q=q_2
	}

	function expand(a,b,c) {
		if (!isitin(b)) {
			c.push(b)
			hash[b]=a
		}
	}
		
	function expand1(a,b,c) {
		if (!isitin1(b)) {
			c.push(b)
			hash1[b]=a
		}
	}
	 
	function isitins(hah1,hah2) {
		var found = -1
	  var l = Object.keys(hah1)
	  var k = Object.keys(hah2)
		for (var i =0; i<l.length; i++) {
			if (l[i] in hah2) { 
				found=l[i]
				break
			}
		}
		return found
	}
		
	function isitin(b) {
		return b in hash
	}
		
	function isitin1(b) {
		return b in hash1
	}
		
	function solution1(tare) {
		if (hash1[tare] == 0) {
			liste1.push(tare)
			return liste1
		} else {
			liste1.push(tare)
			solution1(hash1[tare])
		}
	}
		
	function solution(tare) {
		if (hash[tare] == 0) {
			liste.push(tare)
			return liste
		} else {
			liste.push(tare)
			solution(hash[tare])
		}
	}
	return problemsolver(num,tar)
}
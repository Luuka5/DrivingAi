var friction = 0.95
var power = 0.13
var rotation = 2.5

var showAll = false

var now = 0

// Canvas setup
var c = document.getElementById("canvas")
var ctx = c.getContext("2d")

var c00 = new Vector(40, 35)
var c10 = new Vector(100, 10)
var c20 = new Vector(200, 15)
var c30 = new Vector(300, 13)
var c40 = new Vector(400, 10)
var c50 = new Vector(500, 15)
var c60 = new Vector(560, 50)

var c01 = new Vector(5, 100)
var c11 = new Vector(110, 110)
var c21 = new Vector(215, 100)
var c31 = new Vector(303, 101)
var c41 = new Vector(402, 105)
var c51 = new Vector(480, 125)
var c61 = new Vector(590, 120)

var c02 = new Vector(4, 200)
var c12 = new Vector(100, 200)
var c22 = new Vector(230, 210)
var c32 = new Vector(300, 230)
var c42 = new Vector(360, 240)
var c52 = new Vector(490, 220)
var c62 = new Vector(596, 200)

var c03 = new Vector(10, 300)
var c13 = new Vector(115, 285)
var c23 = new Vector(200, 300)
var c33 = new Vector(302, 301)
var c43 = new Vector(400, 300)
var c53 = new Vector(500, 300)
var c63 = new Vector(597, 300)

var c04 = new Vector(30, 370)
var c14 = new Vector(100, 395)
var c24 = new Vector(200, 396)
var c34 = new Vector(270, 380)
var c44 = new Vector(430, 372)
var c54 = new Vector(520, 397)
var c64 = new Vector(576, 374)

var ccc = new Vector(410, 150)

var track=[new Line(c01, c02), new Line(c11, c12),
           new Line(c02, c03), new Line(c12, c13),
           new Line(c03, c04), new Line(c04, c14),
           new Line(c14, c24), new Line(c13, c23),
           new Line(c24, c34), new Line(c34, c33),
           new Line(c33, c32), new Line(c32, c22),
           new Line(c32, c42), new Line(c42, c43),
           new Line(c43, c44), new Line(c44, c54),
           new Line(c54, c64), new Line(c64, c63),
           new Line(c63, c62), new Line(c53, c52),
           new Line(c62, c61), new Line(c52, c51),
           new Line(c61, c60), new Line(c60, c50),
           new Line(c50, c40), new Line(c51, c41),
           new Line(c40, c30), new Line(c41, c31),
           new Line(c30, c20), new Line(c31, c21),
           new Line(c20, c10), new Line(c21, c11),
           new Line(c10, c00), new Line(c00, c01),
           new Line(c31, ccc), new Line(c52, ccc)]
var checkpoints =[new Line(c53, c63),
                  new Line(c52, c62),
                  new Line(c51, c60),
                  new Line(c41, c50),
                  new Line(c31, c30),
                  new Line(c21, c20),
                  new Line(c00, c11),
                  new Line(c02, c12),
                  new Line(c04, c13),
                  new Line(c34, c23),
                  new Line(c22, c13),
                  new Line(c21, c22),
                  new Line(c42, ccc),
                  new Line(c44, c53)]

/*var checkpoints =[new Line(c44, c53), new Line(c42, ccc),
                  new Line(c34, c23), new Line(c04, c13),
                  new Line(c21, c22), new Line(c22, c13),
                  new Line(c34, c23), new Line(c04, c13),
                  new Line(c02, c12), new Line(c00, c11),
                  new Line(c31, c30), new Line(c41, c50),
                  new Line(c51, c60), new Line(c52, c62),
                  new Line(c53, c63)]*/
var colors = ["#202020", "#282828", "#303030", "#353535", "#3a3a3a", "#3f3f3f"]

// Input data
var up, down, left, right

function Vector(x, y) {
    this.x = x
    this.y = y

    this.add = function(v) {
        this.x += v.x
        this.y += v.y
    }
    this.subtract = function(v) {
        this.x -= v.x
        this.y -= v.y
    }
    this.multiple = function(v) {
        this.x *= v
        this.y *= v
    }

    this.size = function() {
        return Math.sqrt(this.x*this.x + this.y*this.y)
    }
    this.distance = function(v) {
        return new Vector(this.x - v.x, this.y - v.y).size()
    }
    this.copy = function() {
        return new Vector(this.x, this.y)
    }

    this.draw = function(color) {
        ctx.fillStyle = color
        ctx.beginPath()                                    
        ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.fill()
    }
}
function Line(v1, v2) {
    if (v1.x == v2.x) {
        v1.x += 0.001
    }
    if (v1.y == v2.y) {
        v1.y += 0.001
    }

    this.v1 = v1
    this.v2 = v2
    v2.x -= v1.x
    v2.y -= v1.y
    this.k = v2.y / v2.x
    this.b = v1.y - v1.x * this.k

    v2.x += v1.x
    v2.y += v1.y


    this.getX = function(y) {
        return (y - this.b) / this.k
    }
    this.getY = function(x) {
        return this.k * x + this.b
    }
    this.getIntersection = function(line) {
        var v = new Vector((this.b - line.b) / (line.k - this.k), 0)

        v.y = this.getY(v.x)

        if (illegal(v.x) || illegal(v.y)) {
            console.log("illegal")
            return undefined
        }
        if (  Math.abs(this.v1.x - this.v2.x) < Math.abs(this.v1.x - v.x) + Math.abs(this.v2.x - v.x)  ||
              Math.abs(line.v1.x - line.v2.x) < Math.abs(line.v1.x - v.x) + Math.abs(line.v2.x - v.x)  ||
              Math.abs(this.v1.x - this.v2.x) > Math.abs(this.v1.x - v.x) + Math.abs(this.v2.x - v.x)  ||
              Math.abs(line.v1.x - line.v2.x) > Math.abs(line.v1.x - v.x) + Math.abs(line.v2.x - v.x)) {
            return undefined
        }
        return v
    }

    this.draw = function() {
        ctx.beginPath()
        ctx.moveTo(this.v1.x, this.v1.y)
        ctx.lineTo(this.v2.x, this.v2.y)
        ctx.closePath()
        ctx.strokeStyle = c
        ctx.stroke()
    }
}

function Car(x, y, drifting) {
    this.pos = new Vector(x, y)
    this.vel = new Vector(0, 0)
    this.dir = Math.PI +0.5
    
    this.laps = 1

    this.ur = new Vector(Math.sin(this.dir + Math.PI*0.15) *15.5 +this.pos.x,
                        Math.cos(this.dir + Math.PI*0.15)*15.5 + this.pos.y)
    this.ul = new Vector(Math.sin(this.dir + Math.PI*-0.15) *15.5 +this.pos.x,
                        Math.cos(this.dir + Math.PI*-0.15)*15.5 + this.pos.y)
    this.dr = new Vector(Math.sin(this.dir + Math.PI*0.75) *10 +this.pos.x,
                        Math.cos(this.dir + Math.PI*0.75)*10 + this.pos.y)
    this.dl = new Vector(Math.sin(this.dir + Math.PI*-0.75) *10 +this.pos.x,
                        Math.cos(this.dir + Math.PI*-0.75)*10 + this.pos.y)
    this.lineU = new Line(this.ur, this.ul)
    this.lineD = new Line(this.ur, this.ul)
    this.lineR = new Line(this.ur, this.dr)
    this.lineL = new Line(this.ul, this.dl)

    this.s0 = new Line(this.pos,
            new Vector(Math.sin(this.dir) *150+this.pos.x,
            Math.cos(this.dir)*150 + this.pos.y))
    this.s1 = new Line(this.pos,
            new Vector(Math.sin(this.dir +1) *100+this.pos.x,
            Math.cos(this.dir +1)*100 + this.pos.y))
    this.s_1 = new Line(this.pos,
            new Vector(Math.sin(this.dir -1) *100+this.pos.x,
            Math.cos(this.dir -1)*100 + this.pos.y))
    this.s2 = new Line(this.pos,
            new Vector(Math.sin(this.dir +2) *100+this.pos.x,
            Math.cos(this.dir +2)*100 + this.pos.y))
    this.s_2 = new Line(this.pos,
            new Vector(Math.sin(this.dir -2) *100+this.pos.x,
            Math.cos(this.dir -2)*100 + this.pos.y))
    this.sPI = new Line(this.pos,
            new Vector(Math.sin(this.dir +Math.PI) *100+this.pos.x,
            Math.cos(this.dir +Math.PI)*100 + this.pos.y))

    this.score = 0
    this.index = 0
    this.time = now
    this.sensors = [0, 0, 0, 0, 0, 0]

    this.dots = undefined
    if (drifting) {
        this.dots = []
    }

    this.dot = false
    this.draw = function(color) {
        if (this.dots != undefined) {
            ctx.fillStyle = "#404040"
            for (var i = 0; i < this.dots.length; i++) {
                ctx.fillStyle = colors[Math.round((Date.now() - this.dots[i][1]) *0.001)]

                ctx.beginPath()                                    
                ctx.arc(this.dots[i][0].x + Math.sin(this.dots[i][2]+Math.PI*0.5) *5,
                        this.dots[i][0].y + Math.cos(this.dots[i][2]+Math.PI*0.5) *5,
                        1, 0, 2 * Math.PI)
                ctx.closePath()
                ctx.fill()

                /ctx.beginPath()                                    
                ctx.arc(this.dots[i][0].x + Math.sin(this.dots[i][2]-Math.PI*0.5) *5,
                        this.dots[i][0].y + Math.cos(this.dots[i][2]-Math.PI*0.5) *5,
                        1, 0, 2 * Math.PI)
                ctx.closePath()
                ctx.fill()
            }
        }

        if (color == undefined) {
            color = "#ff0000"
        }
        if (this.crash) {
            color = "#303030"
        }
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.moveTo(this.ur.x, this.ur.y)
        ctx.lineTo(this.ul.x, this.ul.y)
        ctx.lineTo(this.dl.x, this.dl.y)
        ctx.lineTo(this.dr.x, this.dr.y)
        ctx.closePath()
        ctx.fill()

        this.lineU.draw()
        this.lineD.draw()
        this.lineR.draw()
        this.lineL.draw()
    }

    this.intersect = function(l) {
        var results = []
        for (var i = 0; i < track.length; i++) {
            var intersection = l.getIntersection(track[i])
            if (intersection != undefined) {
                results.push(intersection)
            }
        }
        if (results.length == 0) {
            return undefined
        }
        var h = Infinity
        var index = 0
        for (var i = 0; i < results.length; i++) {
            var d = results[i].distance(this.pos)
            if (d < h) {
                h = d
                index = i
            }
        }
        return results[index]
    }

    this.crash = false
    this.update = function(input) {
        if (this.crash) {
            return
        }

        if (now - this.time > 300) {
            this.crash = true
        }

        if (this.lineU.getIntersection(checkpoints[this.index]) != undefined ||
                this.lineD.getIntersection(checkpoints[this.index]) != undefined ||
                this.lineR.getIntersection(checkpoints[this.index]) != undefined ||
                this.lineL.getIntersection(checkpoints[this.index]) != undefined) {
            this.score += 10 + (1000 / now - this.time)
            this.index++
            this.time = now
            
            if (this.index >= checkpoints.length) {
                this.laps++
                this.index = 0
            }
        }

        this.ur = new Vector(Math.sin(this.dir + Math.PI*0.15) *15.5 +this.pos.x,
                            Math.cos(this.dir + Math.PI*0.15)*15.5 + this.pos.y)
        this.ul = new Vector(Math.sin(this.dir + Math.PI*-0.15) *15.5 +this.pos.x,
                            Math.cos(this.dir + Math.PI*-0.15)*15.5 + this.pos.y)
        this.dr = new Vector(Math.sin(this.dir + Math.PI*0.75) *10 +this.pos.x,
                            Math.cos(this.dir + Math.PI*0.75)*10 + this.pos.y)
        this.dl = new Vector(Math.sin(this.dir + Math.PI*-0.75) *10 +this.pos.x,
                            Math.cos(this.dir + Math.PI*-0.75)*10 + this.pos.y)
        this.lineU = new Line(this.ur, this.ul)
        this.lineD = new Line(this.dr, this.dl)
        this.lineR = new Line(this.ur, this.dr)
        this.lineL = new Line(this.ul, this.dl)


        this.s0 = new Line(this.pos,
                new Vector(Math.sin(this.dir) *150+this.pos.x,
                Math.cos(this.dir)*150 + this.pos.y))
        this.s1 = new Line(this.pos,
                new Vector(Math.sin(this.dir +1) *100+this.pos.x,
                Math.cos(this.dir +1)*100 + this.pos.y))
        this.s_1 = new Line(this.pos,
                new Vector(Math.sin(this.dir -1) *100+this.pos.x,
                Math.cos(this.dir -1)*100 + this.pos.y))
        this.s2 = new Line(this.pos,
                new Vector(Math.sin(this.dir +2) *100+this.pos.x,
                Math.cos(this.dir +2)*100 + this.pos.y))
        this.s_2 = new Line(this.pos,
                new Vector(Math.sin(this.dir -2) *100+this.pos.x,
                Math.cos(this.dir -2)*100 + this.pos.y))
        this.sPI = new Line(this.pos,
                new Vector(Math.sin(this.dir +Math.PI) *100+this.pos.x,
                Math.cos(this.dir +Math.PI)*100 + this.pos.y))

        try {
            this.sensors[0] = this.intersect(this.s0).distance(this.pos) / 150
        } catch (e) {
            this.sensors[0] = 1
        }
        try {
            this.sensors[1] = this.intersect(this.s1) .distance(this.pos) / 100
        } catch (e) {
            this.sensors[1] = 1
        }
        try {
            this.sensors[2] = this.intersect(this.s_1).distance(this.pos) / 100
        } catch (e) {
            this.sensors[2] = 1
        }
        
        /*try {
            //this.sensors[3] = this.intersect(this.s2).distance(this.pos) / 100
        } catch (e) {
            this.sensors[3] = 1
        }

        try {
            //this.sensors[4] = this.intersect(this.s_2).distance(this.pos) / 100
        } catch (e) {
            this.sensors[4] = 1
        }

        try {
            this.sensors[5] = this.intersect(this.sPI).distance(this.pos) / 100
        } catch (e) {
            this.sensors[5] = 1
        }*/



        if (this.intersect(this.lineU) != undefined ||
                this.intersect(this.lineD) != undefined ||
                this.intersect(this.lineR) != undefined ||
                this.intersect(this.lineL) != undefined) {
                this.crash = true
        }

        this.control(input)

        this.vel.multiple(friction)
        this.pos.add(this.vel)

        if (this.dots == undefined) {
            return
        }

        var v = new Vector(this.vel.x, this.vel.y)
        v.subtract(new Vector(Math.sin(this.dir) *this.vel.size(),
                              Math.cos(this.dir) *this.vel.size()))
        if (v.size() > 1 && up && this.dot) {
            this.dots.push([this.pos.copy(), Date.now() + Math.random()*1200, this.dir])
        }
        this.dot = !this.dot

        try {
            if (Date.now() - this.dots[0][1] > 4000) {
                this.dots.shift()
            }
        } catch(e) {
            this.dots.shift()
        }
    }

    this.control = function(input) {
        if (input[0] > 0) {
            this.vel.x += Math.sin(this.dir) *power
            this.vel.y += Math.cos(this.dir) *power
        }
        if (input[1] > 0) {
            //this.vel.x -= Math.sin(this.dir) *power*0.7
            //this.vel.y -= Math.cos(this.dir) *power*0.7
        }
        if (input[1] < -0.05) {
            this.dir += (rotation*this.vel.size()) / 100
        }
        if (input[1] > 0.05) {
            this.dir -= (rotation*this.vel.size()) / 100
        }
    }
}

var ai = new Population(120)
checkbox()
ai.showGen()

function Population(size) {
    this.pop = [[], []]
    this.gen = 1
    this.best = 0
    this.laps = 0

    for(var i = 0; i < size; i++) {
        this.pop[0].push(new Ai())
        this.pop[1].push(new Car(550, 320, true))
    }

    this.nextGen = function() {
        this.laps = 1
        this.gen++
        var size = this.pop[0].length
        var scores = []
        this.showGen()

        var total = 0
        var b = 0
        var index = 0
        for (var i = 0; i < this.pop[1].length; i++) {
            var s = Math.pow(this.pop[1][i].score, 7)

            total += s
            scores.push(s)

            if (scores[i] > b) {
                b = scores[i]
                index = i
            }
        }

        var list = []
        for (var i = 0; i < this.pop[0].length; i++) {
            var n = 0
            if (scores[i] != 0) {
                n = Math.round((scores[i] / total) * size)
            }
            for (var i2 = 0; i2 < n; i2++) {
                var a = this.pop[0][i].clone()
                if (i2 != 1) {
                    a.mutate()
                } else if (i == index) {
                    this.best = list.length
                }
                a.mutate()
                list.push(a)
            }
        }


        while (list.length < size) {
            try {
                var a = list[Math.random()*list.length | 0].clone()
                a.mutate()
                list.push(a)
            } catch (e) {}
        }
        while (list.length > size) {
            list.pop()
        }

        this.pop = [list, new Array(list.length)]

        for (var i = 0; i < this.pop[1].length; i++) {
            this.pop[1][i] = new Car(550, 330, true)
        }

        if (this.best >= this.pop[0].length) {
            this.best = this.pop[0].length -1
        }
        
        this.pop[0][this.best].draw()
    }

    this.update = function() {
        var crash = true
        for (var i = 0; i < this.pop[0].length; i++) {
            this.pop[1][i].update(this.pop[0][i].think(this.pop[1][i].sensors))
            if (!this.pop[1][i].crash) {
                crash = false
            }
            if (this.pop[1][i].laps > this.laps) {
                this.laps = this.pop[1][i].laps
                document.getElementById("text").innerHTML = "Generation #" + this.gen +" <br>Lap #"+ this.laps
            }
        }

        if (crash || this.laps > 5) {
            this.nextGen()
        }

    }
    this.draw = function() {
        if (showAll) {
            for (var i = 0; i < this.pop[1].length; i++) {
                if (i != this.best) {
                    this.pop[1][i].draw()
                }
            }
        }
        this.pop[1][this.best].draw("#0000ff")
    }

    this.showGen = function() {
        document.getElementById("text").innerHTML = "Generation #" + this.gen +"<br>Lap #"+ this.laps
    }
    
    this.pop[0][this.best].draw()
}
function Ai() {
    this.net =[[new Neuron(), new Neuron(), new Neuron()],
               [new Neuron(), new Neuron(), new Neuron()],
               [new Neuron(), new Neuron()]]

    for(var i = 0; i < this.net.length -1; i++) {
        for(var i2 = 0; i2 < this.net[i].length; i2++) {
            this.net[i][i2].neurons = this.net[i +1]
            this.net[i][i2].setup()
        }
    }

    this.think = function(input) {
        var output = []

        for(var i = 0; i < this.net[0].length; i++) {
            this.net[0][i].addValue(input[i])
        }

        for(var i = 0; i < this.net.length -1; i++) {
            for(var i2 = 0; i2 < this.net[i].length; i2++) {
                this.net[i][i2].setValues()
            }
        }

        for(var i = 0; i < this.net[this.net.length -1].length; i++) {
            output.push(this.net[this.net.length -1][i].value)
            this.net[this.net.length -1][i].value = 0
        }

        return output
    }

    this.draw = function() {
        var crc = document.getElementById("network").getContext("2d")
        crc.fillStyle = "#fff"
        crc.fillRect(0, 0, 300, 330)
        for(var i = 0; i < this.net.length -1; i++) {
            for(var i2 = 0; i2 < this.net[i].length; i2++) {
                this.net[i][i2].draw(i, i2, crc)
            }
        }
    }

    this.clone = function() {
        var a = new Ai()

        for(var i = 0; i < this.net.length -1; i++) {
            for(var i2 = 0; i2 < this.net[i].length; i2++) {
                a.net[i][i2] = this.net[i][i2].clone()
            }
        }
        for(var i = 0; i < a.net.length -1; i++) {
            for(var i2 = 0; i2 < a.net[i].length; i2++) {
                a.net[i][i2].neurons = a.net[i +1]
            }
        }
        return a
    }
    this.mutate = function() {
        var limit = 1
        for (var i = 0; i < limit; i++) {
            var z = (this.net.length*Math.random()) | 0
            var q = (this.net[z].length*Math.random()) | 0
            this.net[z][q].mutate(0.05)
        }
    }
}
function Neuron() {
    this.bias = Math.random()*2 -1
    this.neurons = []
    this.weights = []

    this.value = 0
    this.addValue = function(v) {
        this.value += v
    }

    this.setValues = function() {
        if (this.value > 1) {
            value = 1
        }
        if (this.value < -1) {
            value = -1
        }

        this.value += this.bias
        for(var i = 0; i < this.neurons.length; i++) {
            this.neurons[i].addValue(this.value * this.weights[i])
        }
        this.value = 0
    }

    this.setup = function() {
        for(var i = 0; i < this.neurons.length; i++) {
            this.weights.push(Math.random()*2 -1)
        }
    }

    this.mutate = function(m) {
        if (Math.random() < 0.15) {
            this.bias += Math.random()*m -(m/2)
            if (this.bias > 1) {
                this.bias = 1
            }
            if (this.bias < -1) {
                this.bias = -1
            }
        } else {
            var i = (this.weights.length*Math.random()) | 0
            this.weights[i] = Math.random()*m -(m/2)
            if (this.weights[i] > 1) {
                this.weights[i] = 1
            }
            if (this.weights[i] < -1) {
                this.weights[i] = -1
            }
        }
    }
    this.clone = function() {
        var n = new Neuron()
        n.bias = this.bias

        for(var i = 0; i < this.weights.length; i++) {
            n.weights[i] = this.weights[i]
        }
        
        return n
    }

    this.draw = function(x, y, crc) {
        crc.lineWidth = 1
        crc.strokeStyle = "#000000"
        for (var i = 0; i < this.weights.length; i++) {
            if (this.weights[i] > 0) {
                crc.strokeStyle = "#ff0000"
            } else {
                crc.strokeStyle = "#0000ff"
            }
            crc.lineWidth = this.weights[i]*2.5
            crc.beginPath()
            crc.moveTo(55 + x*90, 100 + y*60)
            crc.lineTo(55 + (x +1)*90, 100 + i*60)
            crc.closePath()
            crc.stroke()
        }
        
        crc.fillStyle = "#000000"
        crc.beginPath()                                    
        crc.arc(55 + x*90, 100 + y*60, (this.bias+2)*3 , 0, 2 * Math.PI)
        crc.closePath()
        crc.fill()
    }
}

setInterval(loop, 10)

function loop() {
    now++
    try {
        ctx.fillStyle = "#404040"
        ctx.fillRect(0, 0, 600, 400)

        for (var i = 0; i < checkpoints.length; i++) {
            ctx.strokeStyle = "#777"
            checkpoints[i].draw()
        }
        ctx.strokeStyle = "#ffffff"
        checkpoints[0].draw()
        ctx.strokeStyle = "#000000"
        for (var i = 0; i < track.length; i++) {
            track[i].draw()
        }

        ai.update()
        ai.draw()
    } catch (e) {
        console.error(e)
    }
}

// Active when key is pressed
function keypress(event) {
    var x = event.keyCode || event.keyCode;  // Get the Unicode value
    if (x == 83 || x == 40) {
        down = true
    }
    if (x == 65 || x == 37) {
        right = true
    }
    if (x == 68 || x == 39) {
        left = true
    }
    if (x == 87 || x == 38) {
        up = true
    }
}
// Active when key is relased
function keyup(event) {
    var x = event.keyCode || event.keyCode;  // Get the Unicode value
    if (x == 83 || x == 40) {
        down = false
    }
    if (x == 65 || x == 37) {
        right = false
    }
    if (x == 68 || x == 39) {
        left = false
    }
    if (x == 87 || x == 38) {
        up = false
    }
}

// Active when checkbox is clicked
function checkbox() {
    showAll = !showAll
    ai.showGen()
    var c = document.getElementById("checkbox").style
    if (showAll) {
        c.backgroundColor = "#00a"
        c.color = "#fff"
    } else {
        c.backgroundColor = "#fff"
        c.color = "#00a"
    }
}

// Display the input from keyboard on the screen
function showInput() {
    if (down) {
        ctx.fillStyle = "#ff0000"
    } else {
        ctx.fillStyle = "#403030"
    }
    ctx.fillRect(15, 15, 9, 9)

    if (right) {
        ctx.fillStyle = "#ff0000"
    } else {
        ctx.fillStyle = "#403030"
    }
    ctx.fillRect(5, 15, 9, 9)

    if (left) {
        ctx.fillStyle = "#ff0000"
    } else {
        ctx.fillStyle = "#403030"
    }
    ctx.fillRect(25, 15, 9, 9)

    if (up) {
        ctx.fillStyle = "#ff0000"
    } else {
        ctx.fillStyle = "#403030"
    }
    ctx.fillRect(15, 5, 9, 9)
}

// Returns true if the number is Infinity, -Infinity, NaN or undefined
function illegal(nro) {
    return nro == Infinity || nro == -Infinity || nro == NaN || nro == undefined
}
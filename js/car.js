
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
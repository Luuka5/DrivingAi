
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
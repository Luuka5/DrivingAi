
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
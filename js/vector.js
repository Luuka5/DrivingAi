
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
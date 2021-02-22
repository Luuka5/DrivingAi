
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

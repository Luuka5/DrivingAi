var friction = 0.95
var power = 0.13
var rotation = 2.5

var showAll = false

var now = 0

// Canvas setup
var c = document.getElementById("canvas")
var ctx = c.getContext("2d")

var trackData = [
    [[5, 100], [4, 200]], [[110, 110], [100, 200]],
    [[4, 200], [10, 300]], [[100, 200], [115, 285]],
    [[10, 300], [30, 370]], [[30, 370], [100, 395]],
    [[100, 395], [200, 396]], [[115, 285], [200, 300]],
    [[200, 396], [270, 380]], [[270, 380], [302, 301]],
    [[302, 301], [300, 230]], [[300, 230], [230, 210]],
    [[300, 230], [360, 240]], [[360, 240], [400, 300]],
    [[400, 300], [430, 372]], [[430, 372], [520, 397]],
    [[520, 397], [576, 374]], [[576, 374], [597, 300]],
    [[597, 300], [596, 200]], [[500, 300], [490, 220]],
    [[596, 200], [590, 120]], [[490, 220], [480, 125]],
    [[590, 120], [560, 50]], [[560, 50], [500, 15]],
    [[500, 15], [400, 10]], [[480, 125], [402, 105]],
    [[400, 10], [300, 13]], [[402, 105], [303, 101]],
    [[300, 13], [200, 15]], [[303, 101], [215, 100]],
    [[200, 15], [100, 10]], [[215, 100], [110, 110]],
    [[100, 10], [40, 35]], [[40, 35], [5, 100]],
    [[303, 101], [410, 150]], [[490, 220], [410, 150]],
]

var checkpointData = [
    [[500, 300], [597, 300]], [[490, 220], [596, 200]],
    [[480, 125], [560, 50]], [[402, 105], [500, 15]],
    [[303, 101], [300, 13]], [[215, 100], [200, 15]],
    [[40, 35], [110, 110]], [[4, 200], [100, 200]],
    [[30, 370], [115, 285]], [[270, 380], [200, 300]],
    [[230, 210], [115, 285]], [[215, 100], [230, 210]],
    [[360, 240], [410, 150]], [[430, 372], [500, 300]],
]

function mapData(data) {
    return data.map(line => {
        return new Line(
            new Vector(line[0][0], line[0][1]),
            new Vector(line[1][0], line[1][1])
        )
    })
}

var track = mapData(trackData)
var checkpoints = mapData(checkpointData)

var colors = ["#202020", "#282828", "#303030", "#353535", "#3a3a3a", "#3f3f3f"]

// Input data
var up, down, left, right

var ai = new Population(120)
checkbox()
ai.showGen()

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
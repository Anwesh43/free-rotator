var w : number = window.innerWidth
var h : number = window.innerHeight
const loopDelay : number = 1
const circleSizeFactor : number = 4
const arrowSizeFactor : number = 9
const ballSizeFactor : number = 7
const timerSizeFactor : number = 6
const backColor : string = "#00C853"
const circleColor : string = "#3F51B5"
const arrowColor : string = "#E0E0E0"
const ballColor : string = "#f44336"
const timerColor : string = "white"
const arrowDelay : number = 50
var ballCreateDelay : number = 1000

window.onresize = () => {
    w = window.innerWidth
    h = window.innerHeight
}

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = backColor
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage : Stage = new Stage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}

class LoopObject {

    constructor(public t : number, public startTime : number, public cb : Function, public delay : number) {

    }

    execute(currTime : number) {
        if (this.cb && typeof this.cb === "function" && currTime - this.startTime >= this.delay) {
            this.startTime = currTime
            this.cb()
        }
    }
}

class Loop {

    interval : number
    loopObjects : Array<LoopObject> = new Array()
    started : boolean = false
    n : number = 0

    start() {
        if (!this.started) {
            this.started = true
            this.interval = setInterval(() => {
                this.execute()
            }, loopDelay)
        }
    }

    add(cb : Function, delay : number) {
        this.n++
        const time = new Date().getTime()
        const loopObject = new LoopObject(this.n, time, cb, delay)
    }

    stop() {
        if (this.started) {
            this.started = false
            clearInterval(this.interval)
        }
    }

    execute() {
        if (this.started) {
            this.loopObjects.forEach((loopObject) => {
                loopObject.execute(new Date().getTime())
            })
        }
    }

    remove(n : number) {
        for (var i = this.loopObjects.length - 1; i >= 0; i--) {
            const loopObject = this.loopObjects[i]
            if (loopObject.t == n) {
                this.loopObjects.splice(i, 1)
            }
        }
    }
}

Stage.init()

const loop : Loop = new Loop()

class Arrow {

    deg : number = 0
    dir : number = 1
    arrowSpeed : number = 5

    move() {
        this.deg += this.arrowSpeed * this.dir
    }

    draw(context : CanvasRenderingContext2D) {
        const cSize : number = Math.min(w, h) / circleSizeFactor
        const arrowSize : number = Math.min(w, h) / arrowSizeFactor
        context.save()
        context.rotate(this.deg * (Math.PI / 180))
        context.save()
        context.translate(cSize, 0)
        context.rotate(Math.PI * (1 - this.dir) / 2)
        context.beginPath()
        context.moveTo(-arrowSize / 2, -arrowSize)
        context.lineTo(0, arrowSize)
        context.lineTo(arrowSize / 2, -arrowSize)
        context.stroke()
        context.restore()
        context.restore()
    }

    static create(loop : Loop) : Arrow {
        const arrow = new Arrow()
        loop.add(() => {
            arrow.move()
        }, arrowDelay)
        return arrow
    }
}

const arrow = Arrow.create(loop)

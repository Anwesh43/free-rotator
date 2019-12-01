var w : number = window.innerWidth
var h : number = window.innerHeight
const loopDelay : number = 1
const circleSizeFactor : number = 4
const arrowSizeFactor : number = 13
const ballSizeFactor : number = 7
const timerSizeFactor : number = 6
const backColor : string = "#00C853"
const circleColor : string = "#3F51B5"
const arrowColor : string = "#E0E0E0"
const ballColor : string = "#f44336"
const timerColor : string = "white"
const arrowDelay : number = 50
var ballCreateDelay : number = 1000
const circleStrokeFactor : number = 60
const arrowStrokeFactor : number = 80
const ballScaleGap : number = 0.02

window.onresize = () => {
    w = window.innerWidth
    h = window.innerHeight
}

class DrawingUtil {

    static drawCircularLoop(context : CanvasRenderingContext2D) {
        const cSize : number = Math.min(w, h) / circleSizeFactor
        context.strokeStyle = circleColor
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / circleStrokeFactor
        context.beginPath()
        context.arc(0, 0, cSize, 0, 2 * Math.PI)
        context.stroke()
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
            console.log("started")
            this.interval = setInterval(() => {
                this.execute()
                console.log("executing")
            }, loopDelay)
        }
    }

    add(cb : Function, delay : number) : number {
        this.n++
        const time = new Date().getTime()
        const loopObject = new LoopObject(this.n, time, cb, delay)
        this.loopObjects.push(loopObject)
        return this.n
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
        context.strokeStyle = arrowColor
        context.lineWidth = Math.min(w, h) / arrowStrokeFactor
        context.lineCap = 'round'
        context.save()
        context.rotate(this.deg * (Math.PI / 180))
        context.save()
        context.translate(cSize, 0)
        context.rotate(Math.PI * (1 - this.dir) / 2)
        context.beginPath()
        context.moveTo(-arrowSize / 2, -arrowSize)
        context.lineTo(0, 0)
        context.lineTo(arrowSize / 2, -arrowSize)
        context.stroke()
        context.restore()
        context.restore()
    }

    toggle() {
        this.dir *= -1
    }

    static create(loop : Loop) : Arrow {
        const arrow = new Arrow()
        loop.add(() => {
            arrow.move()
        }, arrowDelay)
        return arrow
    }
}

class Renderer {

    loop : Loop = new Loop()
    arrow : Arrow

    constructor(cb : Function) {
        this.init(cb)
    }

    init(cb : Function) {
        this.loop.start()
        this.arrow = Arrow.create(this.loop)
        this.loop.add(cb, loopDelay)
    }



    render(context : CanvasRenderingContext2D) {
        context.save()
        context.translate(w / 2, h / 2)
        DrawingUtil.drawCircularLoop(context)
        this.arrow.draw(context)
        context.restore()
    }

    handleTap() {
        this.arrow.toggle()
    }
}

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D
    renderer : Renderer = new Renderer(() => {
        this.render()
    })

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = backColor
        this.context.fillRect(0, 0, w, h)
        this.renderer.render(this.context)
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.renderer.handleTap()
        }
    }

    static init() {
        const stage : Stage = new Stage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}

class BallState {

    scale : number = 0
    dir : number = 0
    prevScale : number = 0

    update(cb : Function) {
        this.scale += ballScaleGap * this.dir
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

Stage.init()

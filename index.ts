var w : number = window.innerWidth
var h : number = window.innerHeight
const loopDelay : number = 30
const circleSizeFactor : number = 4
const arrowSizeFactor : number = 9
const ballSizeFactor : number = 7
const timerSizeFactor : number = 6
const backColor : string = "#00C853"
const circleColor : string = "#3F51B5"
const arrowColor : string = "#E0E0E0"
const ballColor : string = "#f44336"
const timerColor : string = "white"

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

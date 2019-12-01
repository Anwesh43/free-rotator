const fs = require('fs')
const cp = require('child_process')
const delayInMilliseconds = 12000
const INTERVAL = 3000
class FileDiffer {

    constructor(file) {
        this.file = file
        this.t = new Date().getTime()
    }


    check() {
        return new Promise((resolve, reject) => {
            if (!this.prevContent) {
                this.prevContent = fs.readFileSync(this.file)
                this.t = new Date().getTime()
                resolve(this.prevContent)
            } else {
                const currTime = new Date().getTime()
                if (currTime - this.t >= delayInMilliseconds) {
                    this.t = currTime
                    const currContent = fs.readFileSync(this.file)
                    if (currContent !== this.prevContent) {
                        this.prevContent = currContent
                        resolve(currContent)
                    } else {
                        reject("no changes in file")
                    }
                } else {
                    reject("cycle yet to complete")
                }
            }
        })
    }


}

const promisifyCommand = (command) => {
    return new Promise((resolve, reject) => {
        cp.exec(command, (err, stdout) => {
            if (err == null) {
                resolve(stdout)
            } else {
                reject({err, stdout})
            }
        })
    })
}



const compileTs = () => {
    return promisifyCommand('tsc *.ts')
}


const startServer = () => {
    promisifyCommand('python -m SimpleHTTPServer').then((data) => {
        console.log(data)
        console.log("server started")
    }).catch((err) => {
        console.log("error in starting server")
        conosle.log(err)
    })
}

const checkForFileChanges = () => {
    console.log(`checking for file changes every ${INTERVAL}`)
    const fd = new FileDiffer('index.ts')
    setInterval(() => {
        console.log(`checking for file changes after ${INTERVAL} seconds`)
        fd.check().then(() => {
            console.log("index.ts have changes")
            compileTs().then(data => {
                console.log("index.ts compiled to index.js")
            }).catch((err) => {
                console.log(err)
            })
        }).catch(console.log)
  }, INTERVAL)
}

compileTs().then((data) => {
    console.log("starting server")
    startServer()
    checkForFileChanges()
}).catch((err) => {
    console.log(err)
    startServer()
    checkForFileChanges()
})

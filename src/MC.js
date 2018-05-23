class MC {
    constructor(container='widgetContainer', size=[19, 10], inertia=true, debug=false) {
        this.container = document.getElementById(container)
        this.size = size
        this.inertia = inertia
        this.debug = debug

        this.w = this.container.offsetWidth
        this.h = this.container.offsetHeight

        this.grid = []

        for (let y = 0; y < this.h; y += (this.h / this.size[1]))
            for (let x = 0; x < this.w; x += (this.w / this.size[0]))
                this.grid.push([x + 0.5, y + 0.5])

        console.log(this.container)
        console.log(this.size)
        console.log(this.inertia)
        console.log(this.debug)
        console.log(this.grid)
    }
}

export default MC
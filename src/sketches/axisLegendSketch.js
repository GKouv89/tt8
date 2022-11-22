export function sketch(p5){
    let axes = []
    let allAxes = []

    let gradient, gradient2
    let width = 400
    let height = 400

    let hasBeenDrawn = false // We use this to check whether the appropriate color codes have been loading and therefore, whether we can stop draw from looping.
    p5.updateWithProps = props => {
        axes = props.axes;
        console.log(axes)
        allAxes = props.allAxes;
        p5.loop()
    };

    p5.setup = () => {
        p5.createCanvas(width, height)    
        gradient = p5.drawingContext.createLinearGradient(width/2, 0, width/2, height)
        gradient2 = p5.drawingContext.createLinearGradient(width/2, 0, width/2, height)
        p5.noLoop()
    }

    p5.draw = () => {    
        allAxes.map((axis, idx) => {
            if(axes.includes(axis)){
                gradient.addColorStop(idx/6, p5.color(axis))
            }else{
                gradient.addColorStop(idx/6, p5.color('black'))
            }
            gradient2.addColorStop(idx/6, p5.color(axis))
        })
        p5.drawingContext.fillStyle = gradient;
        p5.rect(0, 0, 5*width/6, height)
        p5.drawingContext.fillStyle = gradient2;
        p5.rect(5*width/6, 0, width/6, height)
        if(axes.length != 0 && !hasBeenDrawn){
            hasBeenDrawn = true
            p5.noLoop()
        }
    }    
}
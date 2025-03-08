var i=0
var delay=1000
var interiorColor='#9467BD'
var indicatorColor='#ff7700'
var borderColor='#e6c300'
var coverColor='#99c3e0'
var text
var arrow
// var draw=SVG().addTo('#animation').size(1500,1000)
var snap=Snap(1500,800)

function createArrow(sx,sy,ex,ey,cx,cy,color,vivusConfirmed) {
            let  width = draw.width();
            let  height = draw.height();
            let  startX = sx
            let  startY = sy
            let  endX = ex
            let  endY = ey
            let  controlX = cx;
            let  controlY = cy;

            // Draw the curved path
            let arrow=draw.group().attr({id:'arrow'})
            let  curve = arrow.path(`M ${startX} ${startY} Q ${controlX} ${controlY}, ${endX} ${endY}`)
                .fill('none')
                .stroke({ color, width: 5,linejoin:'round' ,linecap:'round'})
// Calculate the slope of the curve at the end point
            let  dx = endX - controlX; // Change in x
            let  dy = endY - controlY; // Change in y
            let  angle = Math.atan2(dy, dx) * (180 / Math.PI); // Angle in degrees
            // Draw the arrowhead (a three-point polyline)
            let  arrowheadSize = 10;
            let  arrowhead = arrow.polyline([
                [endX - arrowheadSize, endY - arrowheadSize],
                [endX, endY],
                [endX - arrowheadSize, endY + arrowheadSize]
            ]).fill('none').stroke({ color, width: 5 ,linecap:'round'})
                .transform({ rotate: angle, origin: [endX, endY] }); // Rotate the arrowhead
            if(vivusConfirmed){
                new Vivus('arrow',{
                type:'oneByOne',
                duration:40,
                animTimingFunction:Vivus.EASE_OUT,
            })}
            return arrow
        }



        function updateMousePosition(event) {
            mousePositionElement=document.getElementById('mouse')
            // Get the bounding rectangle of the canvas
            const rect = snap.node.getBoundingClientRect();

            // Calculate the mouse position relative to the canvas
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            // Update the text inside the <p> element
            mousePositionElement.textContent = `Mouse Position: (${mouseX.toFixed(2)}, ${mouseY.toFixed(2)})`;
        }
function shakeAnimation(element,degree,frequency,callback,delay){
    element.animate({duration:200,delay}).after(callback)
                .rotate(degree) 
                .animate(frequency)
                .rotate(-2*degree)
                .animate(frequency)
                .rotate(2*degree) 
                .animate(frequency)
                .rotate(-2*degree) 
                .animate(frequency)
                .rotate(2*degree) 
                .animate(frequency)
                .rotate(-degree);
}
function createDynamicText(text){
var x=draw.text(function(add){
    text.forEach((elem)=>{
      add.tspan(elem.text).attr(elem.attr)
    })
})
return x
}


function regular(inputString) {
  return inputString.replace(/[\r\n]+/g,``).replace(/\s+/g,` `);;
}


function Pather(initialPath){
    this.standard={
        timing:(t)=>{return t}
    }
    this.setStandard=function(obj){
        for(let prop in obj){
            this.standard[prop]=obj[prop]
        }
    }

    const parts = initialPath.split(/[{}]/);
    let pathPartitions=parts.filter(part => part !== "");
    this.update=function(data){
        let newPathPartitions=pathPartitions.slice()
        for (let i = 1; i < newPathPartitions.length; i += 2) {
            if (newPathPartitions[i] in data) {
                newPathPartitions[i] = data[newPathPartitions[i]];
            }
        }
        return regular(newPathPartitions.join(' '))
    }
}
import { VectorField, CartPlane } from '../../../utiles/vector';
import { vMathAnimation } from '../../../library.js';
import { getCurrentPos } from '../../../utiles/vector/appendShape.js';
export const anim = new vMathAnimation({width:1200, height:800, parent:'first', id:'first'});
let draw=anim.frame
let arrow=draw.symbol().path('M 0 0 H 40 L 34 -8 L 37 -9 L 46 2 L 46 2 L 36 13 L 33 11 L 40 4 L 0 4 Z')
.attr({fill:'#9999ff'})
//create the cartesian plane
const plane=new CartPlane({draw, unit:{u:60,v:60}})


const mainRect=plane.plane.rect(500,300).fill('purple').attr({opacity:0})
.center(0,0)
const clipperGroup=draw.clip().add(plane.plane.clone(true))
const clipRect=clipperGroup.find('rect')[0]


function createOpenSet({path,scale,translate=[0,0]}){
    plane.plane.path(path)
.fill('white').stroke({color:'white',width:2,dasharray:'5,5'}).attr({opacity:0}).transform({scale,translate})
}


//creating shapes that represents open sets in the plane
createOpenSet({
    path:'M 0 0 C 26 31 118 28 106 0 S 59 -46 69 -103 S -30 -44 0 0',
    scale:2
})
createOpenSet({
    path:'M -104 -90 C -27 -43 -141 -20 -160 27 S -221 -93 -174 -93 S -160 -120 -104 -90',
    scale:2,
    translate:[-100,100]
})
createOpenSet({
    path:'M 217 -222 C 414 156 860 -6 957 -144 C 1228 -744 587 -308 483 -617 S -111 -885 217 -222',
    scale:1.2,
    translate:[-100,100]
})
createOpenSet({
    path:'M -354 2 C -326 -334 511 -271 520 2 S -346 334 -353 2 Z M 59 0 C 1 -56 -40 -56 -91 -1 S 97 35 59 0',
    scale:2.5
})
const shapes=plane.plane.find('path')


//creating shadows that will be used to neglect the parts of sets that are outside the rectangle

const shadow=plane.plane.clone()
shadow.insertBefore(plane.plane)
const clonedShapes=shadow.find('path')

//generating functions that fades open sets


let shapesFadeIn=[]
for (let i = 0; i < shapes.length; i++) {
    shapesFadeIn.push(()=>{
        console.log(i)
        shapes[i].animate(300).attr({opacity:0.8})
        if(i>0) shapes[i-1].animate(300).attr({opacity:0})
    })
}
shapesFadeIn.push(()=>{
    shapes[shapes.length-1].animate(300).attr({opacity:0})
})
let shapesClipedFadeIn=[]
for (let i = 0; i < shapes.length; i++) {
    shapesClipedFadeIn.push(()=>{
        console.log(i)
        shapes[i].animate(300).attr({opacity:0.8})
        clonedShapes[i].animate(300).attr({opacity:0.2})
        if(i>0){
            shapes[i-1].animate(300).attr({opacity:0})
            clonedShapes[i-1].animate(300).attr({opacity:0})
        }
    },
    ()=>{
        clonedShapes[i].animate(300).attr({opacity:0})
    }
)
}
shapesClipedFadeIn.push(()=>{
    clonedShapes[clonedShapes.length-1].animate(300).attr({opacity:0})
    shapes[shapes.length-1].animate(300).attr({opacity:0})
})




anim.initSteps([
    ...shapesFadeIn,
    ()=>{
        mainRect.attr({opacity:1})
        plane.plane.clipWith(clipRect)
    },
    ...shapesClipedFadeIn
])
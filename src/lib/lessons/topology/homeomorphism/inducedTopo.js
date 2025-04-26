import { VectorField, CartPlane } from '../../../utiles/vector';
import { vMathAnimation } from '../../../library.js';
import { getCurrentPos } from '../../../utiles/vector/appendShape.js';
export const anim = new vMathAnimation({width:1200, height:800, parent:'first', id:'first'});
let draw=anim.frame
let arrow=draw.symbol().path('M 0 0 H 40 L 34 -8 L 37 -9 L 46 2 L 46 2 L 36 13 L 33 11 L 40 4 L 0 4 Z')
.attr({fill:'#9999ff'})
//create the cartesian plane
const plane=new CartPlane({draw, unit:{u:60,v:60}})


const mainRect=plane.plane.rect(500,300).fill('purple')
.center(0,0)
const clipperGroup=draw.clip().add(plane.plane.clone(true))
const clipRect=clipperGroup.find('rect')[0]
console.log(clipRect)

//create the field of vectors and points
const shape1=plane.plane.path('M 0 0 C 26 31 118 28 106 0 S 59 -46 69 -103 S -30 -44 0 0')
.fill('white').stroke({color:'white',width:2,dasharray:'5,5'}).attr({opacity:0}).transform({scale:2})

const shape2=plane.plane.path('M -104 -90 C -27 -43 -141 -20 -160 27 S -221 -93 -174 -93 S -160 -120 -104 -90')
.fill('white').stroke({color:'white',width:2,dasharray:'5,5'}).attr({opacity:0})
.transform({scale:2,translate:[-100,100]})

const shape3=plane.plane.path('M 217 -222 C 414 156 860 -6 957 -144 C 1228 -744 587 -308 483 -617 S -111 -885 217 -222')
.fill('white').stroke({color:'white',width:2,dasharray:'5,5'}).attr({opacity:0})
.transform({scale:1.2,translate:[-100,100]})

const shape4=plane.plane.path('M -354 2 C -326 -334 511 -271 520 2 S -346 334 -353 2 Z M 59 0 C 1 -56 -40 -56 -91 -1 S 97 35 59 0')
.fill('white').stroke({color:'white',width:2,dasharray:'5,5'}).attr({opacity:0})
.transform({scale:2.5})
const shapes=[shape1,shape2,shape3,shape4]
// shapes.forEach((shape)=>shape.clipWith(clipRect))
plane.plane.clipWith(clipRect)

anim.initSteps([
    ()=>{
        shape1.animate(300).attr({opacity:0.8})
    },
    ()=>{
        shape1.animate(300).attr({opacity:0})
        shape2.animate(300).attr({opacity:0.8})
    },
    ()=>{
        shape2.animate(300).attr({opacity:0})
        shape3.animate(300).attr({opacity:0.8})
    },
    ()=>{
        shape3.animate(300).attr({opacity:0})
        shape4.animate(300).attr({opacity:0.8})
    },
    ()=>{
        shape4.animate(300).attr({opacity:0})
    }
])
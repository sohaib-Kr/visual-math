import {SmoothPloter} from "../../../utiles"

import { VectorField, CartPlane } from '../../../utiles/vector/index.js';
import { vMathAnimation } from '../../../library.js';
import { VectorTransforms } from '../../../utiles/Transformations.js';
import { getCurrentPos } from '../../../utiles/vector/appendShape.js';
import {Draggable} from '../../../utiles/daraggable.js'
import {TopoPath} from '../../../utiles/topoPath.js'
export const anim = new vMathAnimation({width:1200, height:800, parent:'first', id:'first'});

const draw=anim.frame
const plane=new CartPlane({draw, unit:{u:30,v:30}})

let path=new TopoPath({
    frame:draw,
    codedPath:`M |a| Q 0 0 |b|`,
    initialData:{a:[100,-100],b:[-100,100]},
    attr:{stroke:'red','stroke-width':5}})

plane.append(path.shape)
let firstPath=plane.plane.path('M 0 0 L 300 300').attr({
    fill:'non',
    stroke:'green',
    'stroke-width':5
})
let secondPath=plane.plane.path('M 0 0 L 100 -200').attr({
    fill:'non',
    stroke:'green',
    'stroke-width':5
})
let x=path.createShapeUpdater({a:firstPath,b:secondPath})
// let t=0
// {
//     let I=setInterval(()=>{
//         x(t)
//         t+=0.01
//         if(t==1){
//             clearInterval(I)
//         }
//     },50)
// }
path.draggable(['a','b'],plane.center)
anim.initSteps([
])
import {SmoothPloter} from "../../../utiles"

import { VectorField, CartPlane } from '../../../utiles/vector/index.js';
import { vMathAnimation } from '../../../library.js';
import { VectorTransforms } from '../../../utiles/Transformations.js';
import { getCurrentPos } from '../../../utiles/vector/appendShape.js';
import {Draggable} from '../../../utiles/daraggable.js'
export const anim = new vMathAnimation({width:1200, height:800, parent:'first', id:'first'});

const draw=anim.frame
const plane=new CartPlane({draw, unit:{u:30,v:30}})
let homotopyPath=new Draggable(
    `M |a| 
        Q 0 0 |b| `,
        {a:[-200,0],b:[200,0]},{
            stroke:'red',
            fill:'none',
            'stroke-width':5},
            plane,draw
    )
draw.node.addEventListener('mousemove',(event)=>{
    let heads=homotopyPath.heads
    console.log(parseInt(heads[1].y)/parseInt(heads[0].y)-parseInt(heads[1].x)/parseInt(heads[0].x))
    if(Math.abs(parseInt(heads[1].y)/parseInt(heads[0].y)-parseInt(heads[1].x)/parseInt(heads[0].x)) <= 0.2 || heads[1].x==0 || heads[0].x==0){
        homotopyPath.shape.stroke('green')
        console.log('error')
    }
    else{
        homotopyPath.shape.stroke('red')
    }
})






anim.initSteps([
    
])
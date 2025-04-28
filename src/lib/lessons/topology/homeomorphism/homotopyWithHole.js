import {SmoothPloter} from "../../../utiles"

import { VectorField, CartPlane } from '../../../utiles/vector/index.js';
import { vMathAnimation } from '../../../library.js';
import { VectorTransforms } from '../../../utiles/Transformations.js';
import { getCurrentPos } from '../../../utiles/vector/appendShape.js';
import {Draggable} from '../../../utiles/daraggable.js'
export const anim = new vMathAnimation({width:1200, height:800, parent:'first', id:'first'});

const draw=anim.frame
const plane=new CartPlane({draw, unit:{u:30,v:30}})
homotopyPath=new Draggable(
    `M |a| 
        Q 0 0 |b| `,
        {a:[-200,0],b:[200,0]},{
            stroke:'red',
            fill:'none',
            'stroke-width':5},
            plane,draw
    )







anim.initSteps([
    
])
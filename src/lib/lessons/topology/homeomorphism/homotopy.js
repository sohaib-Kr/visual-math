import {SmoothPloter} from "../../../utiles"

import { VectorField, CartPlane } from '../../../utiles/vector/index.js';
import { vMathAnimation } from '../../../library.js';
import { VectorTransforms } from '../../../utiles/Transformations.js';
export const anim = new vMathAnimation({width:1200, height:800, parent:'first', id:'first'});

const draw=anim.frame
const plane=new CartPlane({draw, unit:{u:30,v:30}})


let x=new SmoothPloter(
    {path:`M |-200+2*t| |2*t| 
        C 0 0
        |4*t| |-150+4*t| 
        |200+2*t| |-150+2*t| `,
    frame:anim.frame,
    attr:{
        fill:'none',
        stroke:'red',
        'stroke-width':5
    }
})
let input=document.getElementById('linear')
input.addEventListener('input',()=>{
    x.shapeUpdater(input.value)
})

let y=new SmoothPloter(
    {path:`M |-200+2*t+t*(t-100)/10| |2*t+t*(t-100)/50| 
        C 0 0
        |4*t+t*(t-100)/10| |-150+4*t+t*(t-100)/50| 
        |200+2*t+t*(t-100)/10| |-150+2*t+t*(t-100)/50| `,
    frame:anim.frame,
    attr:{
        fill:'none',
        stroke:'purple',
        'stroke-width':5
    }
})

let z=new SmoothPloter(
    {path:`M |-200+2*t-t*(t-100)/10| |2*t-t*(t-100)/50| 
        C 0 0
        |4*t-t*(t-100)/10| |-150+4*t-t*(t-100)/50| 
        |200+2*t-t*(t-100)/10| |-150+2*t-t*(t-100)/50| `,
    frame:anim.frame,
    attr:{
        fill:'none',
        stroke:'purple',
        'stroke-width':5
    }
})

let secondInput=document.getElementById('non-linear')
secondInput.addEventListener('input',()=>{
    z.shapeUpdater(secondInput.value)
})


plane.append(x.shape)
plane.append(z.shape)

anim.initSteps([
    
])
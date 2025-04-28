import {SmoothPloter} from "../../../utiles"

import { VectorField, CartPlane } from '../../../utiles/vector/index.js';
import { vMathAnimation } from '../../../library.js';
import { VectorTransforms } from '../../../utiles/Transformations.js';
export const anim = new vMathAnimation({width:1200, height:800, parent:'first', id:'first'});




let x=new SmoothPloter('M /2*t/ 0 H /3*t+1/ V /4*t+2/ ',anim.frame)
let input=document.getElementById('ranger')
input.addEventListener('input',()=>{
    console.log(x.shapeUpdater(input.value))
})

anim.initSteps([
    
])
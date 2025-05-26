import { CartPlane } from '@/lib/utiles/vector/index.js';
import { vMathAnimation } from '@/lib/library.js';
import SVG3DBuilder from 'svg-3d-builder'
import Vivus from 'vivus'
import {animateWithRAF} from '@/lib/library'
import {createIndicator,updateIndicator} from '@/lib/utiles/topoPath.js'
import gsap from 'gsap'

function init(){
    const anim = new vMathAnimation('test');
    const draw=anim.frame
    const config=anim.config()
    console.log(SVG3DBuilder)
    const cube = SVG3DBuilder.createCube(100, 100, 100);

    // Apply styling
    cube.style.fill = '#E62';
    cube.style.stroke = '#333';
    document.getElementById('test').appendChild(cube)
    anim.initSteps([
    ()=>{
    }
])
return anim
}
export const anim = init();
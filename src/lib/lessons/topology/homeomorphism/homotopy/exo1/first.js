import { CartPlane } from '@/lib/utiles/vector';
import { vMathAnimation } from '@/lib/library.js';
export const anim = new vMathAnimation('exo1');

const draw=anim.frame
const plane=new CartPlane({draw, unit:{u:30,v:30}})

plane.plane.circle(20).fill('white').center(0,0)
let mainPath=plane.plane.path(`M 0 0 L 400 0 L 0 0`)
mainPath.attr({stroke:'red','stroke-width':5,fill:'none'})

let indicatorLine=anim.createTopoPath({
    codedPath:`M |a|
L |b|`,
    initialData:{
        a : [300,-300],
b : [0,0],
    },
    attr:{stroke:'white','stroke-width':5,fill:'none',opacity:0.5}
})
plane.append(indicatorLine.group)
anim.initSteps([
    ()=>{},
    ()=>{
        let x=indicatorLine.createShapeUpdater({b:mainPath})
        x.runUpdater()
    },
    ()=>{
    }
])
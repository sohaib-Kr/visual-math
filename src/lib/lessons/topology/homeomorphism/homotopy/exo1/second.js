import { CartPlane } from '@/lib/utiles/vector';
import { vMathAnimation } from '@/lib/library.js';
export const anim = new vMathAnimation('exo1');

const draw=anim.frame
const plane=new CartPlane({draw, unit:{u:30,v:30}})

plane.plane.circle(20).fill('white').center(0,0)

let mainPath=plane.plane.path(`M 200 0 A 1 1 0 0 0 -200 0 A 1 1 0 0 0 200 0 A 200 200 0 0 0 167 -110`)
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
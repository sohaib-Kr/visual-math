import { CartPlane } from '@/lib/utiles/vector';
import { vMathAnimation } from '@/lib/library.js';
export function init(){
    
    const anim = new vMathAnimation('exerciceFrame02');

const draw=anim.frame
const plane=new CartPlane({draw, unit:{u:30,v:30}})

plane.plane.circle(20).fill('white').center(0,0)

let mainPath=plane.plane.path(`M 200 0 A 1 1 0 0 0 -200 0 A 1 1 0 0 0 200 0 A 200 200 0 0 0 167 -110`)
mainPath.attr({stroke:'red','stroke-width':5,fill:'none'})

let firstPath=plane.plane.path(`M -100 0 C -100 100 -200 -100 -200 0 `)
firstPath.attr({stroke:'yellow','stroke-width':5,fill:'none'})

let secondPath=plane.plane.path(`M 0 200 C -50 100 100 0 100 100 `)
secondPath.attr({stroke:'yellow','stroke-width':5,fill:'none'})



let indicatorLine=anim.createTopoPath({
    codedPath:`M |a|
L |b|`,
    initialData:{
        a : [300,-300],
b : [-100,0],
    },
    attr:{stroke:'white','stroke-width':5,fill:'none',opacity:0.5}
})
plane.append(indicatorLine.group)
anim.initSteps([
    ()=>{},
    ()=>{
        let x=indicatorLine.createShapeUpdater({b:firstPath})
        x.runUpdater(()=>{
            let y=indicatorLine.createShapeUpdater({b:secondPath})
            y.runUpdater()
        })
    },
    ()=>{
    }
])
return anim
}
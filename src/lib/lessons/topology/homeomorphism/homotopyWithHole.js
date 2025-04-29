import {SmoothPloter} from "../../../utiles"

import { VectorField, CartPlane } from '../../../utiles/vector/index.js';
import { vMathAnimation } from '../../../library.js';
import { VectorTransforms } from '../../../utiles/Transformations.js';
import { getCurrentPos } from '../../../utiles/vector/appendShape.js';
import {Draggable} from '../../../utiles/daraggable.js'
export const anim = new vMathAnimation({width:1200, height:800, parent:'first', id:'first'});

const draw=anim.frame
const plane=new CartPlane({draw, unit:{u:30,v:30}})

function restrictFromCenter(draggable){
    draw.node.addEventListener('mousemove',(event)=>{
        let heads=draggable.heads
        let Xa=heads[0].x
        let Ya=heads[0].y
        let Xb=heads[1].x
        let Yb=heads[1].y
        let diff=Math.min(1/(40*(Math.pow(Yb-Ya,2)+Math.pow(Xb-Xa,2))/1_000_000),0.1)
        document.getElementById('value').textContent=diff
        if(Math.abs((Yb/Xb)-(Ya/Xa)) <= diff || Xa==0 || Xb==0){
            draggable.shape.attr({opacity:0.3})
            console.log('error')
        }
        else{
            draggable.shape.attr({opacity:1})
        }
    })
}







let firstPath=new Draggable(
    `M |a| 
        Q 0 0 |b| `,
        {a:[-200,-100],b:[200,-100]},{
            stroke:'red',
            fill:'none',
            'stroke-width':5},
            plane,draw
    )
let secondPath=new Draggable(
    `M |a| 
        Q 0 0 |b| `,
        {a:[-200,100],b:[200,100]},{
            stroke:'yellow',
            fill:'none',
            'stroke-width':5},
            plane,draw
    )

restrictFromCenter(firstPath)
restrictFromCenter(secondPath)

{

    let aStartX=firstPath.heads[0].x
    let aStartY=firstPath.heads[0].y
    let bStartX=firstPath.heads[1].x
    let bStartY=firstPath.heads[1].y
    let aEndX=secondPath.heads[0].x
    let aEndY=secondPath.heads[0].y
    let bEndX=secondPath.heads[1].x
    let bEndY=secondPath.heads[1].y
    let aPath=plane.plane.path(`M ${aStartX} ${aStartY} Q 0 0 ${aEndX} ${aEndY}`).attr({
        stroke:'green',
        'stroke-width':5,
        fill:'none'
    })
    let bPath=plane.plane.path(`M ${bStartX} ${bStartY} Q 0 0 ${bEndX} ${bEndY}`).attr({
        stroke:'green',
        'stroke-width':5,
        fill:'none'
    })
    let aBall=plane.plane.circle(10).fill('gray').center(aStartX,aStartY)
    let bBall=plane.plane.circle(10).fill('gray').center(aStartX,aStartY)
    let t=0
    let aPathLength=aPath.length()
    let bPathLength=bPath.length()
    let I=setInterval(()=>{
        
        let a=aPath.pointAt(t*aPathLength)
        let b=bPath.pointAt(t*bPathLength)
        aBall.center(a.x,a.y)
        firstPath.updateShape({a:[a.x,a.y],b:[b.x,b.y]});
        bBall.center(b.x,b.y)
        t+=0.01
        if(t==1){
            clearInterval(I)
        }
    },50)
}
anim.initSteps([
])
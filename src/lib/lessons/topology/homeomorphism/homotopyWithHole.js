import {SmoothPloter} from "../../../utiles"

import { VectorField, CartPlane } from '../../../utiles/vector/index.js';
import { vMathAnimation } from '../../../library.js';
import { VectorTransforms } from '../../../utiles/Transformations.js';
import { getCurrentPos } from '../../../utiles/vector/appendShape.js';
import {Draggable} from '../../../utiles/daraggable.js'
export const anim = new vMathAnimation({width:1200, height:800, parent:'first', id:'first'});

const draw=anim.frame
const plane=new CartPlane({draw, unit:{u:30,v:30}})


let homotopyPath=new SmoothPloter(
    {path:`M -200 |(t-200)/4| 
        Q 0 |-400+2*t| 200 |(t-200)/4| `,
    frame:anim.frame,
    attr:{
        fill:'none',
        stroke:'red',
        'stroke-width':5
    }
})
homotopyPath.shapeUpdater(0)
let startPoint=homotopyPath.shape.pointAt(0)
let endPoint=homotopyPath.shape.pointAt(homotopyPath.shape.length())
plane.append(homotopyPath.shape)
const firstHead=plane.plane.circle(10).fill('orange').center(startPoint.x,startPoint.y)
const secondHead=plane.plane.circle(10).fill('orange').center(endPoint.x,endPoint.y)


// let t=0
// let i=setInterval(()=>{
//     t+=2
//     x.shapeUpdater(t)
//     if(t>=400) clearInterval(i)
// },10)
let firstIsHolding=false
firstHead.node.addEventListener('mousedown',(event)=>{
    firstIsHolding=true
})
firstHead.node.addEventListener('mouseup',(event)=>{
    firstIsHolding=false
})
let secondIsHolding=false
secondHead.node.addEventListener('mousedown',(event)=>{
    secondIsHolding=true
})
secondHead.node.addEventListener('mouseup',(event)=>{
    secondIsHolding=false
})
draw.node.addEventListener('mousemove',(event)=>{
    if(firstIsHolding){
        let currentPos=plane.center
        let x=event.offsetX-currentPos.x
        let y=event.offsetY-currentPos.y
        firstHead.center(x,y)
        homotopyPath.shape.plot(`M ${firstHead.cx()} ${firstHead.cy()} 
        Q ${firstHead.cx()} ${secondHead.cy()} 
        ${secondHead.cx()} ${secondHead.cy()}`)
    }
    else if(secondIsHolding){
        let currentPos=plane.center
        let x=event.offsetX-currentPos.x
        let y=event.offsetY-currentPos.y
        secondHead.center(x,y)
        homotopyPath.shape.plot(`M ${firstHead.cx()} ${firstHead.cy()} 
        Q ${firstHead.cx()} ${secondHead.cy()} 
        ${secondHead.cx()} ${secondHead.cy()}`)
    }
})


let testDrag=new Draggable('M |a| L |b|',{a:[0,0],b:[200,100]},{
    stroke:'yellow',
    fill:'none',
    'stroke-width':5},plane,draw)
console.log(testDrag)
draw.node.addEventListener('mousemove',(event)=>{
    testDrag.heads.forEach((head)=>{
        if(head.holding){
            let currentPos=plane.center
            let x=event.offsetX-currentPos.x
            let y=event.offsetY-currentPos.y
            head.elem.center(x,y)
        }
    })
})





anim.initSteps([
    
])
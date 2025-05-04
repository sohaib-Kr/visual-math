import { CartPlane } from '../../../utiles/vector/index.js';
import { vMathAnimation } from '../../../library.js';
export const anim = new vMathAnimation({width:1200, height:800, parent:'first', id:'first'});

const draw=anim.frame
const plane=new CartPlane({draw, unit:{u:30,v:30}})

function restrictFromCenter(draggable){
    draw.node.addEventListener('mousemove',(event)=>{
        let heads=draggable.currentData
        let Xa=heads.a[0]
        let Ya=heads.a[1]
        let Xb=heads.b[0]
        let Yb=heads.b[1]
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

function runShapeUpdater(shapeUpdater){
    let t=0
    let s=0
    let I=setInterval(()=>{
        s=t*t
        shapeUpdater(s)
        t+=0.04
        if(t>1.04){
            clearInterval(I)
        }
    },50)
}


let firstRadius=plane.plane.path('').attr({fill:'none','stroke-width':5,stroke:'green',opacity:0.5})
let secondRadius=plane.plane.path('').attr({fill:'none','stroke-width':5,stroke:'green',opacity:0.5})
function matchHeads(headA,headB){
    function dist(x1,y1,x2,y2){
        return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2))
    }
    let a=headA.a
    let aPri=headB.a
    let b=headA.b
    let bPri=headB.b
    let distAA=dist(a[0],a[1],aPri[0],aPri[1])+dist(b[0],b[1],bPri[0],bPri[1])
    let distAB=dist(a[0],a[1],bPri[0],bPri[1])+dist(b[0],b[1],aPri[0],aPri[1])
    console.log(distAA)
    if(distAA<distAB){
        firstRadius.plot(`M ${a[0]} ${a[1]} L ${aPri[0]} ${aPri[1]}`)
        secondRadius.plot(`M ${b[0]} ${b[1]} L ${bPri[0]} ${bPri[1]}`)
    }
    else{
        secondRadius.plot(`M ${b[0]} ${b[1]} L ${aPri[0]} ${aPri[1]}`)
        firstRadius.plot(`M ${a[0]} ${a[1]} L ${bPri[0]} ${bPri[1]}`)
    }
}



let firstPath=anim.createTopoPath({
    codedPath:`M |a| 
        Q 0 0 |b| `,
    initialData:{a:[-250,-50],b:[-50,-250]},
    attr:{stroke:'red',fill:'none','stroke-width':5,opacity:0}})
let secondPath=anim.createTopoPath({
    codedPath:`M |a| 
        Q 0 0 |b| `,
    initialData:{a:[50,250],b:[250,50]},
    attr:{stroke:'yellow',fill:'none','stroke-width':5,opacity:0}})
plane.append(firstPath.group)
plane.append(secondPath.group)
// firstPath.draggable(['a','b'],plane.center)
// secondPath.draggable(['a','b'],plane.center)

// restrictFromCenter(firstPath)
// restrictFromCenter(secondPath)
let toDelete=[]
anim.initSteps([
    ()=>{
        firstPath.shape.attr({opacity:1})
        secondPath.shape.attr({opacity:1})
    },
    // ()=>{
    //     toDelete.push(plane.plane.path('M -250 -50 L 50 250').attr({fill:'none','stroke-width':5,stroke:'green',opacity:0.5}),
    //     plane.plane.path('M -50 -250 L 250 50').attr({fill:'none','stroke-width':5,stroke:'green',opacity:0.5}))
    //     let aPath=plane.plane.path('M -250 -50 L -100 100')
    //     let bPath=plane.plane.path('M -50 -250 L 100 -100')
    //     let x=firstPath.createShapeUpdater({a:aPath,b:bPath})
    //     runShapeUpdater(x)
    // },
    // ()=>{},
    // ()=>{
    //     let aPath=plane.plane.path('M -100 100 L 50 250')
    //     let bPath=plane.plane.path('M 100 -100 L 250 50')
    //     let x=firstPath.createShapeUpdater({a:aPath,b:bPath})
    //     runShapeUpdater(x)
    // },
    // ()=>{},
    // ()=>{
    //     toDelete.forEach((path)=>path.remove())
    // }
    ()=>{
        firstPath.draggable(['a','b'],plane.center)
        secondPath.draggable(['a','b'],plane.center)
        draw.node.addEventListener('mousemove',(event)=>{
            matchHeads(firstPath.currentData,secondPath.currentData)
        })
    }
])
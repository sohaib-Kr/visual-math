import { CartPlane } from '../../../utiles/vector/index.js';
import { vMathAnimation } from '../../../library.js';
export const anim = new vMathAnimation({width:1200, height:800, parent:'first', id:'first'});

const draw=anim.frame
const plane=new CartPlane({draw, unit:{u:30,v:30}})

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


let mainPath=anim.createTopoPath({
    codedPath:`M |a| C |b| |c| |d|`,
    initialData:{a:[0,0],b:[0,0],c:[100,0],d:[100,0]},
    attr:{stroke:'red','stroke-width':5,fill:'none'}})
let mainPathShadow=mainPath.shape.clone().attr({opacity:0.5}).addTo(plane.plane)
plane.append(mainPath.group)

let mainPathIndicator=plane.plane.circle(12)
.attr({fill:'#1aff1a',opacity:0})
.center(100,-100)

let shadowPathIndicator=plane.plane.circle(12)
.attr({fill:'orange',opacity:0})
.center(0,0)

plane.append(mainPathIndicator)
plane.append(shadowPathIndicator)
let rangeInput=document.getElementById('rangeInput')

let arrowHolder=anim.createTopoPath({
    codedPath:`M |a| L |b|`,
    initialData:{a:[0,0],b:[100,-100]},
    attr:{stroke:'white','stroke-width':5,fill:'none',opacity:0}})
plane.append(arrowHolder.group)

anim.initSteps([
    ()=>{},
    ()=>{
        let aPath=plane.plane.path('M 0 0 L -100 -50')
        let bPath=plane.plane.path('M 0 0 L -100 -50')
        let cPath=plane.plane.path('M 100 0 L 200 -250')
        let dPath=plane.plane.path('M 100 0 L 200 -250')
        let x=mainPath.createShapeUpdater({a:aPath,b:bPath,c:cPath,d:dPath})
        runShapeUpdater(x)
    },
    ()=>{},
    ()=>{
        let aPath=plane.plane.path('M -100 -50 L -100 200')
        let bPath=plane.plane.path('M -100 -50 L -300 200')
        let cPath=plane.plane.path('M 200 -250 L -300 -100')
        let dPath=plane.plane.path('M 200 -250 L -100 -100')
        let x=mainPath.createShapeUpdater({a:aPath,b:bPath,c:cPath,d:dPath})
        runShapeUpdater(x)
    },
    ()=>{},
    ()=>{
        let aPath=plane.plane.path('M -100 200 L 200 200')
        let bPath=plane.plane.path('M -300 200 L 0 200')
        let cPath=plane.plane.path('M -300 -100 L 0 -100')
        let dPath=plane.plane.path('M -100 -100 L -200 -100')
        let x=mainPath.createShapeUpdater({a:aPath,b:bPath,c:cPath,d:dPath})
        runShapeUpdater(x)
    },
    ()=>{},
    
    ()=>{
        let aPath=plane.plane.path('M 200 200 L 100 -100')
        let bPath=plane.plane.path('M 0 200 L 300 -100')
        let cPath=plane.plane.path('M 0 -100 L 200 -250')
        let dPath=plane.plane.path('M -200 -100 L 400 -250')
        let x=mainPath.createShapeUpdater({a:aPath,b:bPath,c:cPath,d:dPath})
        runShapeUpdater(x)
    },
    ()=>{},
    ()=>{
        let arrowHolderUpdate=arrowHolder.createShapeUpdater({a:mainPath.shape,b:mainPathShadow})
        let length=mainPath.shape.length()
        let shadowLength=mainPathShadow.length()
        mainPathIndicator.animate(500).attr({opacity:1})
        shadowPathIndicator.animate(500).attr({opacity:1})
        arrowHolder.shape.animate(500).attr({opacity:0.5})
        rangeInput.addEventListener('input',()=>{
            arrowHolderUpdate(rangeInput.value/100)
            let data=mainPath.shape.pointAt(rangeInput.value*length/100)
            mainPathIndicator.center(data.x,data.y)
            let shadowData=mainPathShadow.pointAt(rangeInput.value*shadowLength/100)
            shadowPathIndicator.center(shadowData.x,shadowData.y)
        })
    }
])
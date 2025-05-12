import { CartPlane } from '@/lib/utiles/vector/index.js';
import { vMathAnimation } from '@/lib/library.js';
export const anim = new vMathAnimation('homotopicalEqu');

const draw=anim.frame
const plane=new CartPlane({draw, unit:{u:30,v:30}})

let homotopyPathShadow


function changeHomotopyType(type){
    switch(type){
        case 1:
            {let aPath=plane.plane.path('M -150 -300 L -200 250').attr({fill:'none'})
            let bPath=plane.plane.path('M -150 -100 L 50 250').attr({fill:'none'})
            let cPath=plane.plane.path('M 150 -100 L 50 50').attr({fill:'none'})
            let dPath=plane.plane.path('M 150 -300 L 200 50').attr({fill:'none'})
            homotopyPathShadow=[aPath,dPath]
            shapeUpdaterHolder=homotopyPath.createShapeUpdater({a:aPath,b:bPath,c:cPath,d:dPath})}
            break;
        case 2:
            {let aPath=plane.plane.path('M -150 -300 L 200 50').attr({fill:'none'})
            let bPath=plane.plane.path('M -150 -100 L 50 50').attr({fill:'none'})
            let cPath=plane.plane.path('M 150 -100 L 50 250').attr({fill:'none'})
            let dPath=plane.plane.path('M 150 -300 L -200 250').attr({fill:'none'})
            homotopyPathShadow=[aPath,dPath]
            shapeUpdaterHolder=homotopyPath.createShapeUpdater({a:aPath,b:bPath,c:cPath,d:dPath})}
            break;
        case 3:
            {let aPath=plane.plane.path('M -150 -300 Q 200 -200 -200 250').attr({fill:'none'})
            let bPath=plane.plane.path('M -150 -100 Q 200 -200 50 250').attr({fill:'none'})
            let cPath=plane.plane.path('M 150 -100 Q 200 -200 50 50').attr({fill:'none'})
            let dPath=plane.plane.path('M 150 -300 Q 200 -200 200 50').attr({fill:'none'})
            homotopyPathShadow=[aPath,dPath]
            shapeUpdaterHolder=homotopyPath.createShapeUpdater({a:aPath,b:bPath,c:cPath,d:dPath})}
                break;
    }
}
window.changeHomotopyType=changeHomotopyType

let firstPath=plane.plane.path(`
    M -150 -300
    C -150 -100
    150 -100
    150 -300
    `).attr({stroke:'red','stroke-width':5,fill:'none'})

let secondPath=plane.plane.path(`
    M 200 50
    C 50 50
    50 250
    -200 250
    `).attr({stroke:'red','stroke-width':5,fill:'none'})

let homotopyPath=anim.createTopoPath({
    codedPath:`M |a| C |b| |c| |d|`,
    initialData:{a:[-150,-300],b:[-150,-100],c:[150,-100],d:[150,-300]},
    attr:{stroke:'green','stroke-width':5,fill:'none'}})
plane.append(homotopyPath.group)
let xInput=document.getElementById('xInput')
let tInput=document.getElementById('tInput')
let shapeUpdaterHolder

let indicator=plane.plane.circle(12)
.attr({fill:'#1aff1a',opacity:0})
.center(-150,-300)
plane.append(indicator)
anim.initSteps([
    ()=>{},
    ()=>{
        changeHomotopyType(1)
        shapeUpdaterHolder.runUpdater()
    },
    ()=>{},
    ()=>{
        shapeUpdaterHolder.runReverseUpdater(()=>shapeUpdaterHolder.kill())
    },
    ()=>{},
    ()=>{
        changeHomotopyType(2)
        shapeUpdaterHolder.runUpdater()
    },
    ()=>{},
    ()=>{
        shapeUpdaterHolder.runReverseUpdater(()=>shapeUpdaterHolder.kill())
    },
    ()=>{},
    ()=>{
        changeHomotopyType(3)
        shapeUpdaterHolder.runUpdater()
    },
    ()=>{},
    ()=>{
        shapeUpdaterHolder.runReverseUpdater(()=>shapeUpdaterHolder.kill())
    },
    ()=>{
        anim.pause()
        let data
        homotopyPathShadow.forEach((path)=>{
            path.animate(500).attr({opacity:0.5,stroke:'orange','stroke-width':3})
        })
        shapeUpdaterHolder.update(0)
        indicator.animate(500).attr({opacity:1})
        tInput=anim.addControl({name:'tInput',type:'range',listener:(event)=>{
            shapeUpdaterHolder.update(event.target.value/100)
            data=homotopyPath.shape.pointAt(homotopyPath.shape.length()*xInput.node.value/100)
            indicator.center(data.x,data.y)
        }})
        xInput=anim.addControl({name:'xInput',type:'range',listener:(event)=>{
            data=homotopyPath.shape.pointAt(homotopyPath.shape.length()*event.target.value/100)
            indicator.center(data.x,data.y)
        }})
        let play=anim.addControl({name:'play',type:'button',listener:()=>{
            anim.play()
            play.kill()
        }})
    },
    ()=>{},
    ()=>{
        let aPath=plane.plane.path('M -150 -300 L 200 50')
        let bPath=plane.plane.path('M -150 -100 L 50 50')
        let cPath=plane.plane.path('M 150 -100 L 50 250')
        let dPath=plane.plane.path('M 150 -300 L -200 250')
        let x=homotopyPath.createShapeUpdater({a:aPath,b:bPath,c:cPath,d:dPath})
        x.runUpdater()
    },

])
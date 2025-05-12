import { CartPlane } from '@/lib/utiles/vector/index.js';
import { vMathAnimation } from '@/lib/library.js';
export const anim = new vMathAnimation('homotopyWithHole');

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

let center=plane.plane.circle(20).center(0,0).attr({fill:'white',opacity:0.8})


function runShapeUpdater(shapeUpdater,callback=()=>{}){
    let t=0
    let s=0
    let I=setInterval(()=>{
        s=t*t
        shapeUpdater(s)
        t+=0.04
        if(t>1.04){
            clearInterval(I)
            callback()
        }
    },50)
}
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
    if(distAA<distAB){
        return[a,b,bPri,aPri]
    }
    else{
        return[a,b,aPri,bPri]
    }
}

function checkIfInside(){
    //this function creates segments between points and checks if the point (0,0) is inside the polygon
    //be calculating how many times the line x=0 intersects the segments
    let [a,b,c,d]=matchHeads(firstPath.currentData,secondPath.currentData)
    let segAB=[a,b]
    let segBC=[b,c]
    let segCD=[c,d]
    let segDA=[d,a]
    let segments=[segAB,segBC,segCD,segDA]
    let inside=false
    let intersection=[]
        
    segments.forEach((segment)=>{
        //we calculate the equation of the segment
        let x=segment[0][0]
        let y=-segment[0][1]
        let x2=segment[1][0]
        let y2=-segment[1][1]
        let m=(y2-y)/(x2-x)
        let D=y-m*x
        //we check if the solution is in the segment
        if(x*x2<0 && D>0){
            inside=!inside
            intersection.push(segment)
        }
    })
    return {inside,points:{a,b,aPrime:d,bPrime:c}}
}
function linearDrag(){
    let Adata=firstPath.currentData
    let Bdata=secondPath.currentData
    let pathA=plane.plane.path(`M ${Adata.a[0]} ${Adata.a[1]} L ${Bdata.a[0]} ${Bdata.a[1]}`)
    let pathB=plane.plane.path(`M ${Adata.b[0]} ${Adata.b[1]} L ${Bdata.b[0]} ${Bdata.b[1]}`)
    let x=firstPath.createShapeUpdater({a:pathA,b:pathB})
    runShapeUpdater(x)
}
function nonLinearDrag({a,b,aPrime,bPrime}){
    function scalar(point){
        return Math.sqrt(Math.pow(point[0],2)+Math.pow(point[1],2))
    }
    let delta1=[(bPrime[0]+b[0])/2,(bPrime[1]+b[1])/2]
    let delta2=[(aPrime[0]+a[0])/2,(aPrime[1]+a[1])/2]
    let delta
    if(scalar(delta1)>scalar(delta2)){
        delta=delta1
        let pathA=plane.plane.path(`M ${a[0]} ${a[1]} 
            L ${0.5*delta[0]} ${0.5*delta[1]} 
            L${aPrime[0]} ${aPrime[1]}`).attr({fill:'none'})
        let pathB=plane.plane.path(`M ${b[0]} ${b[1]} 
            L ${delta[0]} ${delta[1]} 
            L${bPrime[0]} ${bPrime[1]}`).attr({fill:'none'})
        let x=firstPath.createShapeUpdater({a:pathA,b:pathB})
        runShapeUpdater(x)
    }
    else{
        delta=delta2
        let pathA=plane.plane.path(`M ${a[0]} ${a[1]} 
            L ${delta[0]} ${delta[1]} 
            L${aPrime[0]} ${aPrime[1]}`).attr({fill:'none'})
        let pathB=plane.plane.path(`M ${b[0]} ${b[1]} 
            L ${0.5*delta[0]} ${0.5*delta[1]} 
            L${bPrime[0]} ${bPrime[1]}`).attr({fill:'none'})
        let x=firstPath.createShapeUpdater({a:pathA,b:pathB})
        runShapeUpdater(x)
    }
    
}


function generateHomotopy(){
    firstPath.disableDraggable()
    secondPath.disableDraggable()
    let rect=checkIfInside()
    if(rect.inside){
        nonLinearDrag(rect.points)
    }
    else{
        linearDrag()
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

let toDelete=[]

anim.initSteps([
    ()=>{
        firstPath.shape.attr({opacity:1})
        secondPath.shape.attr({opacity:1})
    },
    ()=>{
        toDelete.push(plane.plane.path('M -250 -50 L 50 250').attr({fill:'none','stroke-width':5,stroke:'green',opacity:0.5}),
        plane.plane.path('M -50 -250 L 250 50').attr({fill:'none','stroke-width':5,stroke:'green',opacity:0.5}))
        let aPath=plane.plane.path('M -250 -50 L -100 100')
        let bPath=plane.plane.path('M -50 -250 L 100 -100')
        let x=firstPath.createShapeUpdater({a:aPath,b:bPath})
        runShapeUpdater(x)
    },
    ()=>{},
    ()=>{
        let aPath=plane.plane.path('M -100 100 L 50 250')
        let bPath=plane.plane.path('M 100 -100 L 250 50')
        let x=firstPath.createShapeUpdater({a:aPath,b:bPath})
        runShapeUpdater(x)
    },
    ()=>{},
    ()=>{
        toDelete.forEach((path)=>path.remove())
        let aPath=plane.plane.path('M 50 250 L -250 -50')
        let bPath=plane.plane.path('M 250 50 L -50 -250')
        let x=firstPath.createShapeUpdater({a:aPath,b:bPath})
        runShapeUpdater(x,()=>{
            firstPath.draggable(['a','b'],plane.center)
            secondPath.draggable(['a','b'],plane.center)
            restrictFromCenter(firstPath)
            restrictFromCenter(secondPath)
        })
    },
    ()=>{
        let playHomotopy=anim.addControl({name:'playHomotopy',type:'button',listener:()=>{
            generateHomotopy()
            playHomotopy.kill()
        }})
    }
])
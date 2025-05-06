import { CartPlane } from '../../../utiles/vector/index.js';
import { vMathAnimation } from '../../../library.js';
export const anim = new vMathAnimation({width:1200, height:800, parent:'fundamentalGroup', id:'fundamentalGroup'});

const draw=anim.frame
const plane=new CartPlane({draw, unit:{u:30,v:30}})

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

let mainPath=anim.createTopoPath({
    codedPath:`M |a|
C |b| |c| |d|
S |e| |f|
S |g| |h|
S |i| |j|
S |k| |l|
S |m| |n|
S |o| |a|`,
    initialData:{
        a : [-170, -70],
b : [-250, -100],
c : [300, -100],
d : [200, 50],
e : [-350, 50],
f : [-350, 200],
g : [350, 200],
h : [200, 50],
i : [-300, 150],
j : [-300, 50],
k : [250, -100],
l : [200, -250],
m : [100, -250],
n : [0, -250],
o : [-15, -20]
    },
    attr:{stroke:'red','stroke-width':5,fill:'none',opacity:0}
})
plane.append(mainPath.group)


anim.initSteps([
    ()=>{
        mainPath.shape.attr({opacity:1})
    },
    ()=>{},
    ()=>{
        let pathA=plane.plane.path(`M -170 -70 L -200 0`)
        let pathB=plane.plane.path(`M -250 -100 L -200 100`)
        let pathC=plane.plane.path(`M 300 -100 L -100 200`)
        let pathD=plane.plane.path(`M 200 50 L 0 200`)
        let pathE=plane.plane.path(`M -350 50 L 200 100`)
        let pathF=plane.plane.path(`M -350 200 L 200 0`)
        let pathG=plane.plane.path(`M 350 200 L 100 -200`)
        let pathH=plane.plane.path(`M 200 50 L 0 -200`)
        let pathI=plane.plane.path(`M -300 150 L -150 -130`)
        let pathJ=plane.plane.path(`M -300 50 L -160 -120`)
        let pathK=plane.plane.path(`M 250 -100 L -200 0`)
        let pathL=plane.plane.path(`M 200 -250 L -200 0`)
        let pathM=plane.plane.path(`M 100 -250 L -200 0`)
        let pathN=plane.plane.path(`M 0 -250 L -200 0`)
        let pathO=plane.plane.path(`M -15 -20 L -200 0`)
        
        let x=mainPath.createShapeUpdater({a:pathA,b:pathB,c:pathC,d:pathD,e:pathE,f:pathF,g:pathG,h:pathH,i:pathI,j:pathJ,k:pathK,l:pathL,m:pathM,n:pathN,o:pathO})
        runShapeUpdater(x)
    },
    ()=>{},
    ()=>{
        let pathA=plane.plane.path(`M -200 0 L 0 0`)
        let pathB=plane.plane.path(`M -200 100 L 0 0`)
        let pathC=plane.plane.path(`M -100 200 L 0 0`)
        let pathD=plane.plane.path(`M 0 200 L 0 0`)
        let pathE=plane.plane.path(`M 200 100 L 0 0`)
        let pathF=plane.plane.path(`M 200 0 L 0 0`)
        let pathG=plane.plane.path(`M 100 -200 L 0 0`)
        let pathH=plane.plane.path(`M 0 -200 L 0 0`)
        let pathI=plane.plane.path(`M -150 -130 L 0 00`)
        let pathJ=plane.plane.path(`M -160 -120 L 0 0`)
        let pathK=plane.plane.path(`M -200 0 L 0 0`)
        let pathL=plane.plane.path(`M -200 0 L 0 0`)
        let pathM=plane.plane.path(`M -200 0 L 0 0`)
        let pathN=plane.plane.path(`M -200 0 L 0 0`)
        let pathO=plane.plane.path(`M -200 0 L 0 0`)
        
        let x=mainPath.createShapeUpdater({a:pathA,b:pathB,c:pathC,d:pathD,e:pathE,f:pathF,g:pathG,h:pathH,i:pathI,j:pathJ,k:pathK,l:pathL,m:pathM,n:pathN,o:pathO})
        runShapeUpdater(x,()=>{plane.plane.circle(10).fill('red').center(0,0)})
    }
])
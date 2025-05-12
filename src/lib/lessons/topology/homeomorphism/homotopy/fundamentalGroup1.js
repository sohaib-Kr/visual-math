import { CartPlane } from '@/lib/utiles/vector/index.js';
import { vMathAnimation } from '@/lib/library.js';
export const anim = new vMathAnimation('fundamentalGroup1');

const draw=anim.frame
const plane=new CartPlane({draw, unit:{u:30,v:30}})

plane.plane.circle(20).fill('white').center(0,0)

let mainPath=anim.createTopoPath({
    codedPath:`M |a|
C |b| |c| |d|
S |e| |f|
S |g| |h|
S |i| |a|`,
    initialData:{
        a : [100,0],
b : [100, 100],
c : [0,100],
d : [-100,0],
e : [-400,-100],
f : [-400,0],
g : [-200,100],
h : [-100,0],
i : [100,-100]
    },
    attr:{stroke:'red','stroke-width':5,fill:'none',opacity:0}
})
plane.append(mainPath.group)

let secondPath=anim.createTopoPath({
    codedPath:`M |a|
C |b| |c| |d|
S |e| |a|
C |f| |g| |h|
S |i| |a|`,
    initialData:{
        a : [100,0],
b : [100,-100],
c : [-100,-100],
d : [-100,0],
e : [100,100],
f : [100,-300],
g : [-400,-300],
h : [-400,0],
i : [100,300],
    },
    attr:{stroke:'red','stroke-width':5,fill:'none',opacity:0}
})
plane.append(secondPath.group)

let thirdPath=anim.createTopoPath({
    codedPath:`M |a|
C |b| |c| |d|
S |e| |f|
S |g| |h|
S |i| |j|
S |k| |a|`,
    initialData:{
        a : [200,0],
b : [200,-100],
c : [100,-200],
d : [0,-200],
e : [-200,-100],
f : [-200,0],
g : [-200,-100],
h : [-200,0],
i : [-100,200],
j : [0,200],
k : [200,100],
    },
    attr:{stroke:'red','stroke-width':5,fill:'none',opacity:0}
})
plane.append(thirdPath.group)



anim.initSteps([
    ()=>{
        mainPath.shape.attr({opacity:1})
    },
    ()=>{
        let pathA=plane.plane.path(`M 100 0 L 10 0`)
        let pathB=plane.plane.path(`M 100 100 L 10 20`)
        let pathI=plane.plane.path(`M 100 -100 L 10 -20`)
        
        let x=mainPath.createShapeUpdater({a:pathA,b:pathB,i:pathI})
        x.runUpdater()
    },
    ()=>{},
    ()=>{
        let pathA=plane.plane.path(`M 10 0 L 100 0`)
        let pathB=plane.plane.path(`M 10 20 L 100 100`)
        let pathI=plane.plane.path(`M 10 -20 L 100 -100`)
        
        let x=mainPath.createShapeUpdater({a:pathA,b:pathB,i:pathI})
        x.runUpdater()
    },
    ()=>{},
    ()=>{
        let pathC=plane.plane.path(`M 0 100 L 0 250`)
        let pathD=plane.plane.path(`M -100 0 L -150 250`)
        let pathE=plane.plane.path(`M -400 -100 L -400 150`)
        let pathG=plane.plane.path(`M -200 100 L -300 -250`)
        let pathH=plane.plane.path(`M -100 0 L -150 -250`)
        
        let x=mainPath.createShapeUpdater({c:pathC,d:pathD,e:pathE,g:pathG,h:pathH})
        x.runUpdater()
    },
    ()=>{},
    ()=>{
        mainPath.shape.animate(500).attr({opacity:0})
    },
    ()=>{
        secondPath.shape.animate(500).attr({opacity:1})
    },
    ()=>{
        let pathA=plane.plane.path(`M 100 0 L 10 0`)
        let pathB=plane.plane.path(`M 100 -100 L 10 -10`)
        let pathC=plane.plane.path(`M -100 -100 L -10 -10`)
        let pathD=plane.plane.path(`M -100 0 L -10 0`)
        let pathE=plane.plane.path(`M 100 100 L 10 10`)
        let pathF=plane.plane.path(`M 100 -300 L 10 -300`)
        let pathI=plane.plane.path(`M 100 300 L 10 300`)
        
        let x=secondPath.createShapeUpdater({a:pathA,b:pathB,c:pathC,d:pathD,e:pathE,f:pathF,i:pathI})
        x.runUpdater()
    },
    ()=>{},
    ()=>{
        let pathA=plane.plane.path(`M 10 0 L 100 0`)
        let pathB=plane.plane.path(`M 10 -10 L 100 -100`)
        let pathC=plane.plane.path(`M -10 -10 L -100 -100`)
        let pathD=plane.plane.path(`M -10 0 L -100 0`)
        let pathE=plane.plane.path(`M 10 10 L 100 100`)
        let pathF=plane.plane.path(`M 10 -300 L 100 -300`)
        let pathI=plane.plane.path(`M 10 300 L 100 300`)
        
        let x=secondPath.createShapeUpdater({a:pathA,b:pathB,c:pathC,d:pathD,e:pathE,f:pathF,i:pathI})
        x.runUpdater()
    },
    ()=>{},
    ()=>{

        let pathB=plane.plane.path(`M 100 -100 L 100 -300`)
        let pathC=plane.plane.path(`M -100 -100 L -400 -300`)
        let pathD=plane.plane.path(`M -100 0 L -400 0`)
        let pathE=plane.plane.path(`M 100 100 L 100 300`)
        let pathF=plane.plane.path(`M 100 -300 L 100 -20`)
        let pathG=plane.plane.path(`M -400 -300 L -20 -20`)
        let pathH=plane.plane.path(`M -400 0 L -20 0`)
        let pathI=plane.plane.path(`M 100 300 L 100 20`)
        
        let x=secondPath.createShapeUpdater({b:pathB,c:pathC,d:pathD,e:pathE,f:pathF,g:pathG,h:pathH,i:pathI})
        x.runUpdater()
    },
    ()=>{},
    ()=>{
        let pathB=plane.plane.path(`M 100 -300 L 100 -100`)
        let pathC=plane.plane.path(`M -400 -300 L -100 -100`)
        let pathD=plane.plane.path(`M -400 0 L -100 0`)
        let pathE=plane.plane.path(`M 100 300 L 100 100`)
        let pathF=plane.plane.path(`M 100 -20 L 100 -300`)
        let pathG=plane.plane.path(`M -20 -20 L -400 -300`)
        let pathH=plane.plane.path(`M -20 0 L -400 0`)
        let pathI=plane.plane.path(`M 100 20 L 100 300`)
        
        let x=secondPath.createShapeUpdater({b:pathB,c:pathC,d:pathD,e:pathE,f:pathF,g:pathG,h:pathH,i:pathI})
        x.runUpdater()
    },
    ()=>{},
    ()=>{
        let pathB=plane.plane.path(`M 100 -100 L 100 -300`)
        let pathC=plane.plane.path(`M -100 -100 L -400 -300`)
        let pathD=plane.plane.path(`M -100 0 L -400 0`)
        let pathE=plane.plane.path(`M 100 100 L 100 300`)
        
        let x=secondPath.createShapeUpdater({b:pathB,c:pathC,d:pathD,e:pathE})
        x.runUpdater()
    },
    ()=>{
        let indicator=secondPath.createIndicator(plane)
        let t=0
        let I=setInterval(()=>{
            secondPath.updateIndicator(t,indicator)
            t+=0.01
            if(t>1){
                clearInterval(I)
            }
        },80)
    },
    ()=>{
        thirdPath.shape.animate(500).attr({opacity:1})
        thirdPath.label(plane)
    },
    ()=>{

        
        let pathE=plane.plane.path(`M -200 -100 L -100 -50`)
        let pathF=plane.plane.path(`M -200 -0 L 0 -50`)
        let pathG=plane.plane.path(`M -200 -100 L 100 50`)
        let pathH=plane.plane.path(`M -200 0 L 0 50`)
        
        let x=thirdPath.createShapeUpdater({e:pathE,f:pathF,g:pathG,h:pathH})
        x.runUpdater()

    }
])
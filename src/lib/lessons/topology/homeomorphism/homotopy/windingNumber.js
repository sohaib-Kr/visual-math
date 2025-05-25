import { CartPlane } from '@/lib/utiles/vector/index.js';
import { vMathAnimation } from '@/lib/library.js';
import { updateIndicator,createIndicator } from '@/lib/utiles/topoPath';
import {animateWithRAF} from '@/lib/utiles/raf'
export const anim = new vMathAnimation('windingNumber');

const draw=anim.frame
const plane=new CartPlane({draw, unit:{u:30,v:30}})
const config=anim.config()

let mainPath=plane.plane.path(`M 200, 0
         A 200, 200 0 1, 0 -200, 0
         A 200, 200 0 1, 0 200, 0
         Z`).attr({...config.path1})
let hole=plane.plane.circle(15).center(0,0).attr({...config.path1,fill:'white',opacity:0.7})
let intersectLine=plane.plane.path('M 0 0 H 1000 0').attr({...config.path1,stroke:'red'})
let indicator=createIndicator(plane).opacity(0)

let t=0
anim.initSteps([
    ()=>{
        anim.pause()
        intersectLine.animate(3000).rotate(300,{origin:[0,0]})
        .animate(1000).rotate(-30,{origin:[0,0]}).after(()=>{
            anim.play()
        })
    },
    ()=>{
        anim.pause()
        draw.animate(500).transform({scale:[1.5,1.5],origin:[0,0]})
        t=0
        let j=0
        while(parseInt(mainPath.pointAt(j*mainPath.length()).x)>0){
            j+=0.002
        }
        indicator.animate(500).attr({opacity:1})
        let I=animateWithRAF((timestamp,deltaTime)=>{
            updateIndicator(mainPath,t,indicator)
            t+=0.01
            if(t>=j){
                t=j
                updateIndicator(mainPath,j,indicator)
                I.stop()
                anim.play()
            }
        })
    },
    ()=>{},
    ()=>{
        anim.pause()
        let I=animateWithRAF((timestamp,deltaTime)=>{
            updateIndicator(mainPath,t,indicator)
            t+=0.01
            if(t>=1){
                I.stop()
                anim.play()
            }
        })
    },
    ()=>{
        mainPath.animate(700).attr({opacity:0}).after(()=>{
            mainPath=anim.createTopoPath({
                    codedPath:`
                    M 0 300 
                    C |a| |b| |c| 
                    S |g| 0 -300 
                    S |d| |e| 
                    S |f| 0 300 
                    `,
                initialData:{a:[250,300],b:[150,-100],c:[0,-100],d:[150,-100],e:[0,-100],f:[-250,300],g:[-100,-300]},
                attr:config.path1})
            plane.append(mainPath.group)
        })

    },
    ()=>{
        anim.pause()
        t=0
        let j=[0,0,0,1]
        for (let i = 0; i < 3; i++) {
            while(mainPath.shape.pointAt(j[i]*mainPath.shape.length()).x*mainPath.shape.pointAt((j[i]+0.002)*mainPath.shape.length()).x>=0){
                j[i]+=0.002
            }
            i<2&&(j[i+1]=j[i]+0.002)
        }
        indicator.animate(500).attr({opacity:1})
        let i=0
        function runWinder(){
            if(i==4){
                anim.play()
                return
            }
            let I=setInterval(()=>{
                updateIndicator(mainPath.shape,t,indicator)
                t+=0.01
                if(t>=j[i]){
                    t=j[i]
                    updateIndicator(mainPath.shape,j[i],indicator)
                    clearInterval(I)
                    i++
                    setTimeout(()=>runWinder(),1000)
                }
            },50)
        }
        runWinder()
    },
    ()=>{
        let aPath=plane.plane.path('M 250 300 L 165 300').attr({fill:'none'})
        let bPath=plane.plane.path('M 150 -100 L 300 165').attr({fill:'none'})
        let cPath=plane.plane.path('M 0 -100 L 300 0').attr({fill:'none'})
        let dPath=plane.plane.path('M 150 -100 L -300 -165').attr({fill:'none'})
        let ePath=plane.plane.path('M 0 -100 L -300 0').attr({fill:'none'})
        let fPath=plane.plane.path('M -250 300 L -165 300').attr({fill:'none'})
        let gPath=plane.plane.path('M -100 -300 L 165 -300').attr({fill:'none'})
        let updater=mainPath.createShapeUpdater({a:aPath,b:bPath,c:cPath,d:dPath,e:ePath,f:fPath,g:gPath})
        updater.runUpdater({duration:1500,timeFunc:'easeOut'})
        indicator.animate(500).attr({opacity:0})
        intersectLine.animate(500).attr({opacity:0})
    },
    ()=>{
        mainPath.shape.animate(500).attr({opacity:0}).after(()=>{
            mainPath=anim.createTopoPath({
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
                attr:{...config.path1,opacity:0}
            })
            plane.append(mainPath.group)
            mainPath.shape.animate(500).attr({opacity:1})
        })
    },
    ()=>{
        anim.pause()
        t=0
        let j=[0,0,1]
        for (let i = 0; i < 3; i++) {
            while(mainPath.shape.pointAt(j[i]*mainPath.shape.length()).x*mainPath.shape.pointAt((j[i]+0.002)*mainPath.shape.length()).x>=0){
                j[i]+=0.002
            }
            i<2&&(j[i+1]=j[i]+0.002)
            if(mainPath.shape.pointAt(j[i]*mainPath.shape.length()).y>0){
                j[i]+=0.002
                i-=1
            }
        }
        indicator.animate(500).attr({opacity:1})
        let i=0
        function runWinder(){
            if(i==4){
                anim.play()
                return
            }
            let I=animateWithRAF((timestamp,deltaTime)=>{
                updateIndicator(mainPath.shape,t,indicator)
                t+=0.01
                if(t>=j[i]){
                    t=j[i]
                    updateIndicator(mainPath.shape,j[i],indicator)
                    I.stop()
                    i++
                    setTimeout(()=>runWinder(),1000)
                }
            },50)
        }
        runWinder()
    },
    // ()=>{
    //     let pathA=plane.plane.path(`M 100 0 L 10 0`)
    //     let pathB=plane.plane.path(`M 100 -100 L 10 -10`)
    //     let pathC=plane.plane.path(`M -100 -100 L -10 -10`)
    //     let pathD=plane.plane.path(`M -100 0 L -10 0`)
    //     let pathE=plane.plane.path(`M 100 100 L 10 10`)
    //     let pathF=plane.plane.path(`M 100 -300 L 10 -300`)
    //     let pathI=plane.plane.path(`M 100 300 L 10 300`)
        
    //     let x=mainPath.createShapeUpdater({a:pathA,b:pathB,c:pathC,d:pathD,e:pathE,f:pathF,i:pathI})
    //     x.runUpdater()
    // },
])
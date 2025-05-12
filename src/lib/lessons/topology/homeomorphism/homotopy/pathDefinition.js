import { CartPlane } from '@/lib/utiles/vector/index.js';
import { vMathAnimation } from '@/lib/library.js';
export const anim = new vMathAnimation('pathDefinition');

const draw=anim.frame
const plane=new CartPlane({draw, unit:{u:30,v:30}})
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

let arrowHolder=anim.createTopoPath({
    codedPath:`M |a| L |b|`,
    initialData:{a:[0,0],b:[100,-100]},
    attr:{stroke:'white','stroke-width':5,fill:'none',opacity:0}})
plane.append(arrowHolder.group)

let secondPath=anim.createTopoPath({
    codedPath:`M |a| C |b| |c| |d| C |e| |f| |g|`,
    initialData:{a:[0,0],b:[0,0],c:[100,0],d:[0,0],e:[100,0],f:[100,0],g:[100,0]},
    attr:{stroke:'red','stroke-width':5,fill:'none',opacity:0}})
plane.append(secondPath.group)
let textHolder
let lambdaHolder
anim.initSteps([
    // ()=>{
    //     textHolder=anim.createTextSpace().update('Here are examples of different paths in the plane R^2',true)
    // },
    // ()=>{
    //     let aPath=plane.plane.path('M 0 0 L -100 -50')
    //     let bPath=plane.plane.path('M 0 0 L -100 -50')
    //     let cPath=plane.plane.path('M 100 0 L 200 -250')
    //     let dPath=plane.plane.path('M 100 0 L 200 -250')
    //     let x=mainPath.createShapeUpdater({a:aPath,b:bPath,c:cPath,d:dPath})
    //     x.runUpdater()
    // },
    // ()=>{},
    // ()=>{
    //     let aPath=plane.plane.path('M -100 -50 L -100 200')
    //     let bPath=plane.plane.path('M -100 -50 L -300 200')
    //     let cPath=plane.plane.path('M 200 -250 L -300 -100')
    //     let dPath=plane.plane.path('M 200 -250 L -100 -100')
    //     let x=mainPath.createShapeUpdater({a:aPath,b:bPath,c:cPath,d:dPath})
    //     x.runUpdater()
    // },
    // ()=>{},
    // ()=>{
    //     let aPath=plane.plane.path('M -100 200 L 200 200')
    //     let bPath=plane.plane.path('M -300 200 L 0 200')
    //     let cPath=plane.plane.path('M -300 -100 L 0 -100')
    //     let dPath=plane.plane.path('M -100 -100 L -200 -100')
    //     let x=mainPath.createShapeUpdater({a:aPath,b:bPath,c:cPath,d:dPath})
    //     x.runUpdater()
    // },
    ()=>{},
    
    ()=>{
        let aPath=plane.plane.path('M 200 200 L 100 -100')
        let bPath=plane.plane.path('M 0 200 L 300 -100')
        let cPath=plane.plane.path('M 0 -100 L 200 -250')
        let dPath=plane.plane.path('M -200 -100 L 400 -250')
        let x=mainPath.createShapeUpdater({a:aPath,b:bPath,c:cPath,d:dPath})
        x.runUpdater()
    },
    ()=>{},
    ()=>{
        // textHolder.update('Use the range slider to change the value of x.',true)
        // lambdaHolder=anim.createTextSpace().update('\\gamma \\left( x \\right)=\\left( 1,1 \\right)',true,true)
        anim.pause()
        let arrowHolderUpdate=arrowHolder.createShapeUpdater({a:mainPath.shape,b:mainPathShadow})
        let length=mainPath.shape.length()
        let shadowLength=mainPathShadow.length()
        mainPathIndicator.animate(500).attr({opacity:1})
        shadowPathIndicator.animate(500).attr({opacity:1})
        arrowHolder.shape.animate(500).attr({opacity:0.5})
        function sceww(x){
            arrowHolderUpdate.update(x/100)
            let data=mainPath.shape.pointAt(x*length/100)
            mainPathIndicator.center(data.x,data.y)
            let shadowData=mainPathShadow.pointAt(x*shadowLength/100)
            shadowPathIndicator.center(shadowData.x,shadowData.y)
        }
        let scrub=anim.createScrubber({
            initialValue:0,
            animator:sceww,
            duration:400
        })
        let range=anim.addControl({name:'rangeInput',type:'range',listener:(event)=>{
            scrub.play(event.target.value)
            // lambdaHolder.update('/gamma/left( '+event.target.value/100+' /right)=/left( '+parseInt(data.x)/100+','+(-parseInt(data.y)/100)+' /right)')
        }})
        let next=anim.addControl({name:'next',type:'button',listener:()=>{
            anim.play()
            range.kill()
            next.kill()
        }})

    },
    ()=>{
        let aPath=plane.plane.path('M 100 -100 L 0 0')
        let bPath=plane.plane.path('M 300 -100 L 0 0')
        let cPath=plane.plane.path('M 200 -250 L  100 0')
        let dPath=plane.plane.path('M 400 -250 L 100 0')
        let x=mainPath.createShapeUpdater({a:aPath,b:bPath,c:cPath,d:dPath})
        x.runUpdater()
        arrowHolder.shape.animate(300).attr({opacity:0})
        mainPathIndicator.animate(300).attr({opacity:0})
        shadowPathIndicator.animate(300).attr({opacity:0})
    },
    ()=>{
        mainPath.shape.attr({opacity:0})
        secondPath.shape.attr({opacity:1})
        let aPath=plane.plane.path('M 0 0 L -450 200')
        let bPath=plane.plane.path('M 0 0 L -450 450')
        let cPath=plane.plane.path('M 0 0 L -50 450')
        let dPath=plane.plane.path('M 0 0 L -50 200')
        let ePath=plane.plane.path('M 100 0 L -50 -50')
        let fPath=plane.plane.path('M 100 0 L -450 -50')
        let gPath=plane.plane.path('M 100 0 L  -450 200')
        let x=secondPath.createShapeUpdater({a:aPath,b:bPath,c:cPath,d:dPath,e:ePath,f:fPath,g:gPath})
        x.runUpdater()
        arrowHolder.shape.animate(300).attr({opacity:0})
        mainPathIndicator.animate(300).attr({opacity:0})
        shadowPathIndicator.animate(300).attr({opacity:0})
    },
    ()=>{},
    ()=>{
        anim.pause()
        let arrowHolderUpdate=arrowHolder.createShapeUpdater({a:secondPath.shape,b:mainPathShadow})
        let length=secondPath.shape.length()
        let shadowLength=mainPathShadow.length()
        mainPathIndicator.animate(500).attr({opacity:1})
        shadowPathIndicator.animate(500).attr({opacity:1})
        arrowHolder.shape.animate(500).attr({opacity:0.5})
        let range=anim.addControl({name:'rangeInput',type:'range',listener:(event)=>{
            arrowHolderUpdate(event.target.value/100)
            let data=secondPath.shape.pointAt(event.target.value*length/100)
            mainPathIndicator.center(data.x,data.y)
            let shadowData=mainPathShadow.pointAt(event.target.value*shadowLength/100)
            shadowPathIndicator.center(shadowData.x,shadowData.y)
        }})
        let next=anim.addControl({name:'next',type:'button',listener:()=>{
            anim.play()
            range.kill()
            next.kill()
        }})
    
    }
])
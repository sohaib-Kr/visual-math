import { CartPlane } from '@/lib/utiles/vector/index.js';
import { vMathAnimation } from '@/lib/library.js';

function init(){
const anim = new vMathAnimation('homotopicalEqu');


const draw=anim.frame
const plane=new CartPlane({draw, unit:{u:30,v:30}})
const config=anim.config()
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

plane.plane.path(`
    M -150 -300
    C -150 -100
    150 -100
    150 -300
    `).attr(config.path1)

plane.plane.path(`
    M 200 50
    C 50 50
    50 250
    -200 250
    `).attr(config.path1)

let homotopyPath=anim.createTopoPath({
    codedPath:`M |a| C |b| |c| |d|`,
    initialData:{a:[-150,-300],b:[-150,-100],c:[150,-100],d:[150,-300]},
    attr:{...config.path1,opacity:0.7}})
plane.append(homotopyPath.group)

let textHolder
let lambdaHolder
let xInput=document.getElementById('xInput')
let tInput=document.getElementById('tInput')
let shapeUpdaterHolder

let indicator=plane.plane.circle()
.attr({...config.indicationPoint,opacity:0})
.center(-150,-300)
plane.append(indicator)
anim.initSteps([
    ()=>{
        textHolder=anim.createTextSpace().update({newText:'As you can see there are many ways you can continously transform one path into another',fade:true})
    },
    ()=>{
        changeHomotopyType(1)
        shapeUpdaterHolder.runUpdater({duration:1.5})
    },
    ()=>{},
    ()=>{
        shapeUpdaterHolder.runReverseUpdater({callback:()=>shapeUpdaterHolder.kill(),duration:1.5})
    },
    ()=>{},
    ()=>{
        changeHomotopyType(2)
        shapeUpdaterHolder.runUpdater({duration:1.5})
    },
    ()=>{},
    ()=>{
        shapeUpdaterHolder.runReverseUpdater({callback:()=>shapeUpdaterHolder.kill(),duration:1.5})
    },
    ()=>{},
    ()=>{
        changeHomotopyType(3)
        shapeUpdaterHolder.runUpdater({duration:1.5})
    },
    ()=>{},
    ()=>{
        shapeUpdaterHolder.runReverseUpdater({callback:()=>shapeUpdaterHolder.kill(),duration:1.5})
    },
    ()=>{
        anim.pause()
        textHolder.update({newText:'Use the range slider to change the values of | and |.',fade:true,callback:()=>{
            textHolder.addLatex(['x','t'])
        }})
        lambdaHolder=anim.createTextSpace().update({newText:'\\mathcal{H}\\left( 0.00,0.00 \\right)=\\left( 1.00,1.00 \\right)',fade:true,latex:true})
        changeHomotopyType(1)
        draw.animate(800).transform({scale:[1.5,1.3],origin:[0,-100]})
        let indicPos=0
        shapeUpdaterHolder.update(0)
        indicator.animate(800).attr({opacity:1})
        let changeIndicatorEmph=anim.emphasize([indicator],{
            resultStyle:[
                {opacity:1}
            ]
        })
        function changeIndicator(x){
            indicPos=x
            let data
            data=homotopyPath.shape.pointAt(homotopyPath.shape.length()*x/100)
            indicator.center(data.x,data.y)
            changeIndicatorEmph.updateAll()
        }
        let changeHomoPathEmph=anim.emphasize([homotopyPath.shape,indicator],{
            resultStyle:[
                {opacity:1},
                {opacity:1}
            ]
        })
        let changeIndicatorScrub=anim.createScrubber({
                    initialValue:0,
                    animator:changeIndicator,
                    duration:400,
                    onUpdate:()=>{
                        changeIndicatorEmph.updateAll()
                    }
                })

                
        function changeHomoPath(x){
            shapeUpdaterHolder.update(x/100)
            let data
            data=homotopyPath.shape.pointAt(homotopyPath.shape.length()*indicPos/100)
            indicator.center(data.x,data.y)
            changeHomoPathEmph.updateAll()
        }
        let changeHomoPathScrub=anim.createScrubber({
                    initialValue:0,
                    animator:changeHomoPath,
                    duration:400,
                    onUpdate:()=>{
                        changeHomoPathEmph.updateAll()
                    }
                })       
        
        anim.addControl({name:'play again',type:'button',listener:()=>{
            anim.playAgain(init)
        }}) 
        let xValue=0
        tInput=anim.addControl({name:'t',latex:true,type:'range',listener:(event)=>{
            
            changeHomoPathEmph.updateAll()
            changeHomoPathScrub.play(event.target.value)
            let data=homotopyPath.shape.pointAt(event.target.value*homotopyPath.shape.length()/100)
            lambdaHolder.update({newText:'\\mathcal{H}\\left( '+parseFloat(event.target.value/100).toFixed(2)+','+parseFloat(indicPos/100).toFixed(2)+' \\right)=\\left( '+parseFloat(parseInt(data.x)/100).toFixed(2)+','+parseFloat(-parseInt(data.y)/100).toFixed(2)+' \\right)',latex:true})
            xValue=event.target.value
        }})
        tInput.node.addEventListener('mousedown',()=>{
            changeHomoPathEmph.on()
        })
        tInput.node.addEventListener('mouseup',()=>{
            changeHomoPathEmph.updateAll()
            changeIndicatorEmph.updateAll()
            changeHomoPathEmph.off()
        })



        xInput=anim.addControl({name:'x',latex:true,type:'range',listener:(event)=>{
            changeIndicatorEmph.updateAll()
            changeIndicatorScrub.play(event.target.value)
            let data=homotopyPath.shape.pointAt(event.target.value*homotopyPath.shape.length()/100)
            lambdaHolder.update({newText:'\\mathcal{H}\\left( '+parseFloat(xValue/100).toFixed(2)+','+parseFloat(event.target.value/100).toFixed(2)+' \\right)=\\left( '+parseFloat(parseInt(data.x)/100).toFixed(2)+','+parseFloat(-parseInt(data.y)/100).toFixed(2)+' \\right)',latex:true})
        }})

        xInput.node.addEventListener('mousedown',()=>{
            changeIndicatorEmph.on()
        })
        xInput.node.addEventListener('mouseup',()=>{
            changeIndicatorEmph.updateAll()
            changeHomoPathEmph.updateAll()

            changeIndicatorEmph.off()
        })
    }

])
return anim
}
export const anim= init()

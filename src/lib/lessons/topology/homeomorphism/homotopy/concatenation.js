import { CartPlane } from '@/lib/utiles/vector/index.js';
import { vMathAnimation } from '@/lib/library.js';
import Vivus from 'vivus'
import {animateWithRAF} from '@/lib/library'
import {createIndicator,updateIndicator} from '@/lib/utiles/topoPath.js'
import gsap from 'gsap'

function init(){
    const anim = new vMathAnimation('concatenation');
    const draw=anim.frame
    const plane=new CartPlane({draw, unit:{u:30,v:30}})
    const config=anim.config()

    const firstLoop=plane.plane.path('M 0 0 C -28 -52 160 -136 200 -100 S 303 -48 253 24 S 14 21 0 0')
    .attr({...config.path1})
    .addTo(plane.plane)
    const secondLoop=plane.plane.path('M 0 0 C -44 -74 50 -155 -67 -192 S -35 -244 -4 -258 S 77 71 0 0')
    .attr({...config.path1})
    .addTo(plane.plane)
let emph
let indicator
let textHolder=anim.createTextSpace()
indicator=createIndicator(plane)

anim.initSteps([
    ()=>{
        draw.animate(800).transform({scale:1.7,origin:[200,-200]})
        textHolder=anim.createTextSpace()
        textHolder.update({
            newText:`||`,
            fade:true,
            callback:()=>{
                textHolder.addLatex([
                    `\\gamma_{1}=(1.00,1.00) `,
                    `\\newline \\gamma_{2}=(1.00,1.00)`])
            }})
    },
    ()=>{
        indicator=createIndicator(plane)
        emph=anim.emphasize([firstLoop,indicator],{resultStyle:[
            {opacity:1},
            {opacity:1,filter:'brightness(2)'}
        ]})
        emph.on()
    },
    ()=>{
        anim.pause()
        gsap.to(textHolder.textSpace.children[1],{duration:0.5,opacity:0.3})
        let t=0
        let coords=textHolder.textSpace.children[0].querySelectorAll('.mord')
        let length=firstLoop.length()
        let gammaX=coords[4]
        let gammaY=coords[5]
        let I=animateWithRAF((timestamp,deltaTime)=>{
            updateIndicator(firstLoop,t,indicator)
            emph.updateAll()
        let {x,y}=firstLoop.pointAt(length*t)
            gammaX.textContent=(x/100).toFixed(2)
            gammaY.textContent=(-y/100).toFixed(2)
            emph.highlightGroup.children()[2]
            .transform({rotate:indicator.transform().rotate})
            t+=0.01
            if(t>=1.01){
                anim.play()
                I.stop()
            }
        })
    },
    ()=>{
        emph.remove()
        emph=anim.emphasize([secondLoop,indicator],{resultStyle:[
            {opacity:1},
            {opacity:1,filter:'brightness(2)'}
        ]})
        emph.on()
    },
    ()=>{
        anim.pause()
        gsap.to(textHolder.textSpace.children[1],{duration:0.5,opacity:1})
        gsap.to(textHolder.textSpace.children[0],{duration:0.5,opacity:0.3})
        let t=0
        let coords=textHolder.textSpace.children[1].querySelectorAll('.mord')
        let length=secondLoop.length()
        let gammaX=coords[4]
        let gammaY=coords[5]
        let I=setInterval(()=>{
            updateIndicator(secondLoop,t,indicator)
            emph.updateAll()
        let {x,y}=secondLoop.pointAt(length*t)
            gammaX.textContent=(x/100).toFixed(2)
            gammaY.textContent=(-y/100).toFixed(2)
            emph.highlightGroup.children()[2]
            .transform({rotate:indicator.transform().rotate})
            t+=0.01
            if(t>=1.01){
                anim.play()
                clearInterval(I)
            }
        },30)
    },
    ()=>{
        // emph.remove()
        emph=anim.emphasize([firstLoop,secondLoop,indicator],{resultStyle:[
            {opacity:1},
            {opacity:1},
            {opacity:1,filter:'brightness(2)'}
        ]})
        emph.on()
    },
    ()=>{
        textHolder.update({
            newText:`\\Gamma(0.0) = \\begin{cases}
   \\gamma_{1}(0.0) \\newline
   \\gamma_{2}(0.0) 
\\end{cases}\\newline =(0.00,0.00)`,
            fade:true,
            latex:true})
    },
    ()=>{
        anim.pause()
        let x,y
        let t=0
            let coords=textHolder.textSpace.querySelectorAll('.mord')
            let holder1=coords[3]
            let holder2=coords[9]
            let firstLength=firstLoop.length()
            let secondLength=secondLoop.length()
            let gammaT=coords[1]
            let gammaT1=coords[8]
            let gammaT2=coords[14]
            let X=coords[15]
            let Y=coords[16]
        let [holder1Faded,holder2Faded]=[false,false]
        let I=animateWithRAF((timestamp,deltaTime)=>{
            gammaT.textContent=(t/2).toFixed(1);
            ({x,y}=firstLoop.pointAt(firstLength*t))
            gammaT1.textContent=(t).toFixed(1)
            updateIndicator(firstLoop,t,indicator)
            if(!holder1Faded){
                holder1Faded=true
                gsap.to(holder2,{duration:0.5,opacity:0.3})
            }
            t+=0.01
            if(t>=1.01){
                I.stop()
                let J=animateWithRAF((timestamp,deltaTime)=>{
                    gammaT.textContent=(t/2).toFixed(1);
                        ({x,y}=secondLoop.pointAt(secondLength*(t-1)))
                        gammaT2.textContent=(t-1).toFixed(1)
                        updateIndicator(secondLoop,t-1,indicator)
                        if(!holder2Faded){
                            holder2Faded=true
                            gsap.to(holder1,{duration:0.5,opacity:0.3})
                            gsap.to(holder2,{duration:0.5,opacity:1})
                        }
                    t+=0.01
                    if(t>=2.01){
                        J.stop()
                        anim.play()
                    }
                    })
            }
            })
            
let I3=animateWithRAF((timestamp,deltaTime)=>{
    gammaT.textContent=(t/2).toFixed(1)
    X.textContent=(x/100).toFixed(2)
    Y.textContent=(-y/100).toFixed(2)
    emph.updateAll()
    emph.highlightGroup.children()[3]
    .transform({rotate:indicator.transform().rotate})
    if(t>=2.01){
        I3.stop()
        anim.play()
    }
    })
}
])
return anim
}
export const anim = init();
import { CartPlane } from '@/lib/utiles/vector/index.js';
import { vMathAnimation } from '@/lib/library.js';
import {createIndicator,updateIndicator} from '@/lib/utiles/topoPath.js'
import gsap from 'gsap'

function init(){
    const anim = new vMathAnimation('concatenation');
    const draw=anim.frame
    const plane=new CartPlane({draw, unit:{u:30,v:30}})
    const config=anim.config()
    const firstLoopGroup=plane.plane.group()
    const firstLoop=firstLoopGroup.path('M 0 0 C -28 -52 160 -136 200 -100 S 303 -48 253 24 S 14 21 0 0')
    .attr({...config.path1})
    const secondLoopGroup=plane.plane.group()
    const secondLoop=secondLoopGroup.path('M 0 0 C -44 -74 50 -155 -67 -192 S -35 -244 -4 -258 S 77 71 0 0')
    .attr({...config.path1})
let textHolder=anim.createTextSpace()
let indicator=createIndicator(plane)
updateIndicator(firstLoop,0,indicator)

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
        anim.vivusRender({elem:firstLoopGroup.node,duration:50,onReady:()=>{
            firstLoop.animate(1000).attr({opacity:1})
        }})
        anim.vivusRender({elem:secondLoopGroup.node,duration:50,onReady:()=>{
            secondLoop.animate(1000).attr({opacity:1})
        }})
    },
    ()=>{},
    ()=>{
        anim.pause()
        gsap.to(textHolder.textSpace.children[1],{duration:0.5,opacity:0.3})
        let coords=textHolder.textSpace.children[0].querySelectorAll('.mord')
        let length=firstLoop.length()
        let gammaX=coords[4]
        let gammaY=coords[5]
        gsap.to({},{
            duration:3,
            onUpdate:function(){
                updateIndicator(firstLoop,this.progress(),indicator)
            let {x,y}=firstLoop.pointAt(length*this.progress())
            gammaX.textContent=(x/100).toFixed(2)
            gammaY.textContent=(-y/100).toFixed(2)
            },
            onComplete:function(){
                anim.play()
            }
        })
    },
    ()=>{

    },
    ()=>{
        anim.pause()
        gsap.to(textHolder.textSpace.children[1],{duration:0.5,opacity:1})
        gsap.to(textHolder.textSpace.children[0],{duration:0.5,opacity:0.3})
        let coords=textHolder.textSpace.children[1].querySelectorAll('.mord')
        let length=secondLoop.length()
        let gammaX=coords[4]
        let gammaY=coords[5]
        gsap.to({},{
            duration:3,
            onUpdate:function(){
                updateIndicator(secondLoop,this.progress(),indicator)
                let {x,y}=secondLoop.pointAt(length*this.progress())
                gammaX.textContent=(x/100).toFixed(2)
                gammaY.textContent=(-y/100).toFixed(2)
            },
            onComplete:function(){
                anim.play()
            }
        })
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

        gsap.to({},{
            duration:3,
            onUpdate:function(){
                gammaT.textContent=(this.progress()/2).toFixed(1);
                ({x,y}=firstLoop.pointAt(firstLength*this.progress()))
                gammaT1.textContent=(this.progress()).toFixed(1)
                updateIndicator(firstLoop,this.progress(),indicator)
                if(!holder1Faded){
                    holder1Faded=true
                    gsap.to(holder2,{duration:0.5,opacity:0.3})
                }
            },
        onComplete:function(){
            gsap.to({},{
                duration:3,
                onUpdate:function(){
                    gammaT.textContent=(0.5+this.progress()/2).toFixed(1);
                    ({x,y}=secondLoop.pointAt(secondLength*this.progress()))
                    gammaT2.textContent=(this.progress()).toFixed(1)
                    updateIndicator(secondLoop,this.progress(),indicator)
                    if(!holder2Faded){
                        holder2Faded=true
                        gsap.to(holder1,{duration:0.5,opacity:0.3})
                        gsap.to(holder2,{duration:0.5,opacity:1})
                    }
                },
            })
        }
        })
            
gsap.to({},{
    duration:6.1,
    onUpdate:function(){
    gammaT.textContent=(this.progress()).toFixed(1)
    X.textContent=(x/100).toFixed(2)
    Y.textContent=(-y/100).toFixed(2)
    },
    onComplete:function(){
        indicator.animate(1000).attr({opacity:0}).after(function(){
            indicator.node.remove()
        })
    }
})
}
])
return anim
}
export const anim = {vMath:init(),init:init};

import { CartPlane } from '@/lib/utiles/vector/index.js';
import { vMathAnimation } from '@/lib/library.js';
import Vivus from 'vivus'
import {createIndicator,updateIndicator} from '@/lib/utiles/topoPath.js'
import gsap from 'gsap'

function init(){
    const anim = new vMathAnimation('concatenation');
    const draw=anim.frame
    const plane=new CartPlane({draw, unit:{u:30,v:30}})
    const config=anim.config()
    const mainSpace=[]
    for (let i = 1; i < 15; i++) {
        mainSpace.push(plane.plane.path(`M 0 0 A 1 1 0 0 0 ${500/i} 0 A 1 1 0 0 0 0 0`).
        attr({...config.path2}))
        
    }

    function generatePaths(commands){
        const group=plane.plane.group()
        commands.forEach((command,index)=>{
            command&&mainSpace[index].clone().addTo(group).attr({...config.path1,opacity:1})
            
            anim.vivusRender({elem:group.node,duration:50})
        })
        return group
    }
    let groupHolder
    let textHolder=anim.createTextSpace()
    let binDecod
anim.initSteps([
    ()=>{
        draw.animate(700).transform({scale:1.5,origin:[700,0]})
    },
    // ()=>{
    //     anim.pause()
    //     let i=0
    //     let interval=setInterval(()=>{
    //         (i!=0)&&mainSpace[i-1].animate(500).attr({opacity:0.4})
    //         mainSpace[i].animate(500).attr({opacity:1})
    //         i++
    //         if(i==8){
    //             clearInterval(interval)
    //             anim.play()
    //         }
    //     },1200)
    // },
    // ()=>{
    //     mainSpace.forEach((path)=>{
    //         path.animate(500).attr({opacity:1})
    //     })
    // },
    // ()=>{
    //     mainSpace.forEach((path)=>{
    //         path.animate(500).attr({opacity:0.4})
    //     })
    // }
    ()=>{
        textHolder.update({newText:'\\omega(\\lambda)={0}{0}{0}{0}{0}{0}{0}....',fade:true,latex:true})
    },
    ()=>{
        
        binDecod=textHolder.textSpace.querySelectorAll('.mord')
        binDecod.forEach((elem,index)=>{
            (index>1&&index<8)&&(elem.innerHTML='0')
        })
    },


    ()=>{
        binDecod=textHolder.textSpace.querySelectorAll('.mord')
        Array.from(binDecod).forEach((elem,index)=>{
            (index>1)&&(elem.innerHTML=0)
        })
        gsap.to(binDecod[2],{opacity:0,duration:0.5}).then(()=>{
            binDecod[2].innerHTML='1'
            gsap.to(binDecod[2],{opacity:1,duration:0.5})
        })
        groupHolder=generatePaths([true])
        anim.delay=3000
    },


    ()=>{
        gsap.to([binDecod[2],binDecod[3]],{opacity:0,duration:0.5}).then(()=>{
            binDecod[2].innerHTML='0'
            binDecod[3].innerHTML='1'
            gsap.to([binDecod[2],binDecod[3]],{opacity:1,duration:0.5})
        });
        [...groupHolder.children()].forEach((path)=>{
            path.animate(200).attr({opacity:0}).after(()=>path.remove())
        })
        groupHolder=generatePaths([false,true])
    },


    ()=>{
        gsap.to([binDecod[2],binDecod[3],binDecod[4]],{opacity:0,duration:0.5}).then(()=>{
            binDecod[2].innerHTML='1'
            binDecod[3].innerHTML='0'
            binDecod[4].innerHTML='1'
            gsap.to([binDecod[2],binDecod[3],binDecod[4]],{opacity:1,duration:0.5})
        });
        [...groupHolder.children()].forEach((path)=>{
            path.animate(200).attr({opacity:0}).after(()=>path.remove())
        })
        groupHolder=generatePaths([true,false,true])
    },


    ()=>{
        gsap.to([binDecod[4],binDecod[5]],{opacity:0,duration:0.5}).then(()=>{
            binDecod[4].innerHTML='0'
            binDecod[5].innerHTML='1'
            gsap.to([binDecod[4],binDecod[5]],{opacity:1,duration:0.5})
        });
        [...groupHolder.children()].forEach((path)=>{
            path.animate(200).attr({opacity:0}).after(()=>path.remove())
        })
        groupHolder=generatePaths([true,false,false,true])
    },
])
return anim
}
export const anim = init();
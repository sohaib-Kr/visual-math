import {SVG} from '@svgdotjs/svg.js'
import gsap from 'gsap'
export function lessonsButton(){
    let arrow=SVG("#arrowIcon").size(100,50)
    let arrowPath=arrow.findOne('path')
    arrowPath.stroke({color:'#232326',width:4,strokeLinecap:'round',strokeLinejoin:'round'})
    arrowPath.attr({"stroke-linecap":'round',"stroke-linejoin":'round',opacity:0})
    arrowPath.transform({translate:[100,-10]})

    let but=document.getElementById('seeLessonsButton')
    but.addEventListener('mouseover',()=>{
        arrowPath.animate(300).attr({opacity:1})
        gsap.to(but,{duration:0.5,opacity:0})
        gsap.to(but.parentNode,{duration:0.5,backgroundColor:'#ccccff'})
    })
    but.addEventListener('mouseout',()=>{
    arrowPath.animate(300).attr({opacity:0})
    gsap.to(but,{duration:0.5,opacity:1})
    gsap.to(but.parentNode,{duration:0.5,backgroundColor:'white'})
})
    but.addEventListener('click',()=>{
    if(siwtcher){
        topoSprits.forEach((sprite)=>sprite.In())
        siwtcher=false
    }else{
        topoSprits.forEach((sprite)=>sprite.Out())
        siwtcher=true
    }
})
}

export function hamburgerMenu(){
    const draw = SVG().addTo('#hamburgerLogo').size(100, 100);
let line1=draw.line(10,10,60,10).stroke({ color: '#f4d10b', width: 5 });
let line2=draw.line(10,25,60,25).stroke({ color: '#f4d10b', width: 5 });
let line3=draw.line(10,40,60,40).stroke({ color: '#f4d10b', width: 5 });
let closedState=true
let arrowhead=draw.path('M 20 35 L 10 25 L 20 15').stroke({ color: '#f4d10b', width: 3 }).fill('none').attr({opacity:0})
document.getElementById('hamburgerLogo').addEventListener('click',()=>{
    if(closedState){
        line1.animate(300).transform({translate:[0,-10]}).attr({opacity:0})
        line2.animate(300).transform({translate:[0,-10]}).attr({opacity:0})
        line3.animate(300).transform({translate:[0,-15]}).after(() => {
            arrowhead.animate(300).attr({opacity:1})
        })
        gsap.to('#branches', { opacity: 1, duration: 0.5 });
    }else{
        line1.animate(300).transform({translate:[0,0]}).attr({opacity:1})
        line2.animate(300).transform({translate:[0,0]}).attr({opacity:1})
        line3.animate(300).transform({translate:[0,0]})
        arrowhead.animate(300).attr({opacity:0})
        gsap.to('#branches', { opacity: 0, duration: 0.5 });
    }
    closedState=!closedState
})
}
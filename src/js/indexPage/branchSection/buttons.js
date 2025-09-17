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
        gsap.to(but.parentNode,{duration:0.5,backgroundColor:'#e6e6ff'})
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

export function categoriesButton(){
let closedState=true
let coolingTime = false; // Flag to track if the event is in cooldown

let isAnimating = false; // Flag to track if animation is in progress

document.getElementById('categoriesButton').addEventListener('click', () => {
    if (isAnimating) return; // If animation is ongoing, do nothing

    isAnimating = true; // Set the flag to indicate the animation is starting

    if (closedState) {
        gsap.to('#branches', {
            opacity: 1, 
            display: 'block', 
            duration: 0.5, 
            onComplete: () => {
                isAnimating = false; // Reset flag when animation completes
            }
        });
    } else {
        gsap.to('#branches', {
            opacity: 0, 
            display: 'none', 
            duration: 0.5, 
            onComplete: () => {
                isAnimating = false; // Reset flag when animation completes
            }
        });
    }

    closedState = !closedState; // Toggle the state
});
}
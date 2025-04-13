import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import katex from "katex"

// GSAP setup and initialization
gsap.registerPlugin(Flip, ScrollTrigger);

Array.from(document.getElementsByClassName('fadeOnScroll')).forEach((element)=>{
    ScrollTrigger.create({
        trigger:element,
        start: "top 75%",
        onEnter:()=>{
            gsap.to(element,{opacity:1,y:-20,duration:0.8})
        },
        onLeaveBack:()=>{
            gsap.to(element,{opacity:0,y:20,duration:0.8})
        },
        
    })
})
Array.from(document.getElementsByClassName('katex-input')).forEach((elem)=>{
    let src=elem.innerText
    elem.innerText=''
    katex.render(src,elem)
})
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SVG } from '@svgdotjs/svg.js'

// GSAP setup and initialization
gsap.registerPlugin(Flip, ScrollTrigger);

function progressBar(){
    // Create SVG canvas for progress bar
    const draw = SVG().addTo(document.getElementById('progress-bar')).size('100%', '100%');
    const rectData={
        x:50,
        y:50,
        width:20,
        height:600,
    }
    const barSkeleton=draw.path(`M ${rectData.x} ${rectData.y} 
        A 1 1 0 0 1 ${rectData.x+rectData.width} ${rectData.y} 
        V ${rectData.height + rectData.y} 
        A 1 1 0 0 1 ${rectData.x} ${rectData.height + rectData.y} Z`)
    .fill('#f6f3f4')
    const barCurrent=draw.path(`M ${rectData.x} ${rectData.y} 
        A 1 1 0 0 1 ${rectData.x+rectData.width} ${rectData.y} 
        V ${rectData.y} 
        A 1 1 0 0 1 ${rectData.x} ${rectData.y} Z`)
    .fill('#b15a84')

    // Create ScrollTrigger animation for progress bar
    gsap.to(barCurrent.node, {
        scrollTrigger: {
            trigger: "#parts-container",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            pin:draw.node,
        },
    });
    const points=[]
    Array.from(document.getElementById('parts-container').children).forEach((child,index)=>{
        points.push({
            height:parseInt(parseInt(window.getComputedStyle(child).height)),
            title:child.getAttribute('data-title')
        })
    })
    let totalHeight=0
    let currentHeight=0
    points.forEach((point)=>totalHeight+=point.height)
    points.forEach((point,index)=>{
        point.circle=draw.circle(30).fill('#f6f3f4')
        .center(rectData.x+10,rectData.y+rectData.height*(currentHeight/totalHeight))
        point.text=draw.text(point.title).font({size:15,weight:'bold'})
        .fill('#bfbfbf')
        .cy(rectData.y+rectData.height*(currentHeight/totalHeight))
        .x(rectData.x+40)
        console.log((point.height/totalHeight))
        currentHeight+=point.height
    })
    currentHeight=0
    let lastHeight=0
    points.forEach((point,index)=>{
        ScrollTrigger.create({
            trigger:document.getElementsByClassName('part')[index],
            start: "top 50%",
            end: "bottom 50%",
            onEnter:()=>{
                point.circle.fill('#b15a84')
                point.text.fill('#595959')
                gsap.timeline().to(point.circle.node,{scale:1.2,x:-3,duration:0.3}).to(point.circle.node,{scale:1,x:0,duration:0.3})
            },
            onLeaveBack:()=>{
                point.circle.fill('#f6f3f4')
                point.text.fill('#bfbfbf')
                lastHeight-=point.height
            },
            onLeave:()=>{
                index<points.length-1 ? lastHeight+=point.height : NaN
            },
            onEnterBack:()=>{
                index==0 ? lastHeight=0 : NaN
            },
            onUpdate: (self) => {
                // Calculate new height based on scroll progress
                const newheight = rectData.height*((point.height*self.progress+lastHeight)/totalHeight)-20;
                
                // Update progress bar path
                barCurrent.plot(`M ${  rectData.x} ${ rectData.y} 
                    A 1 1 0 0 1 ${ rectData.x+   rectData.width} ${  rectData.y} 
                    V ${newheight + rectData.y} 
                    A 1 1 0 0 1 ${ rectData.x} ${newheight + rectData.y} Z`);
                },
        })
    })
}



//single page animations







progressBar()

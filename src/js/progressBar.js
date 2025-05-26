import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SVG } from '@svgdotjs/svg.js'

// GSAP setup and initialization
gsap.registerPlugin(Flip, ScrollTrigger);



function progressBar(){

    const draw = SVG().addTo(document.getElementById('progress-bar')).size('100%', '100%');

// Rectangle data for the progress bar
const rectData = {
    x: 50,
    y: 50,
    width: 20,
    height: 600,
};

// Create the skeleton of the progress bar
const barSkeleton = draw.path(`
    M ${rectData.x + rectData.width / 2} ${rectData.y} 
    L ${rectData.x + rectData.width / 2} ${rectData.height + rectData.y}`)
    .stroke({ color: '#f6f3f4', width: 2 })

// Create the current progress bar with shadow
const barCurrent = draw.path(`
    M ${rectData.x + rectData.width/2 - 1} ${rectData.y + 1}
    a 1 1 0 0 1 3 0
    V ${rectData.y + rectData.height - 1}
    a 1 1 0 0 1 -3 0
    Z`)
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
    points.forEach((point)=>{
        point.circle=draw.circle(20).fill('#f6f3f4')

        .center(rectData.x+10,rectData.y+rectData.height*(currentHeight/totalHeight))
        point.text=draw.text(point.title).font({size:15,weight:'bold'})

        .fill('#bfbfbf')
        .cy(rectData.y+rectData.height*(currentHeight/totalHeight))
        .x(rectData.x+40)
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
                gsap.timeline().to(point.circle.node,{transformOrigin: "center center",scale:1.2,duration:0.3}).to(point.circle.node,{scale:1,duration:0.3})
            },
            onLeaveBack:()=>{
                point.circle.fill('#f6f3f4')
                point.text.fill('#bfbfbf')
                lastHeight-=points[index-1].height
            },
            onLeave:()=>{
                index<points.length-1 ? lastHeight+=point.height : NaN
            },
            onEnterBack:()=>{
                index==0 ? lastHeight=0 : NaN
            },
            onUpdate: (self) => {
                // Calculate new height based on scroll progress
                const newheight = rectData.height*((point.height*self.progress+lastHeight)/totalHeight);
                console.log(lastHeight)
                
                // Update progress bar path
                barCurrent.plot(`M ${rectData.x + rectData.width/2 - 1} ${rectData.y + 1}
    a 1 1 0 0 1 3 0
    V ${rectData.y + newheight}
    a 1 1 0 0 1 -3 0
    Z`);
            },
        })
    })
}



//single page animations







progressBar()

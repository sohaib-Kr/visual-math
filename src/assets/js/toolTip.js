import gsap from 'gsap'
import Vivus from 'vivus'
import { SVG } from '@svgdotjs/svg.js'
import Flip from 'gsap/Flip'
import ScrollTrigger from 'gsap/ScrollTrigger'
gsap.registerPlugin(Flip, ScrollTrigger);
function initializeToolTips(){ 
let elems=document.getElementsByClassName('toolTipLink')
for(let elem of elems){
    gsap.to(elem,{duration:0.5,opacity:0,onComplete:function(){
        elem.style.color='#7b8b9d'
        elem.style.fontWeight='bold'
        gsap.to(elem,{duration:0.5,opacity:1})
    }})
    let title = elem.getAttribute('data-title');
    let box = document.getElementById(`${title}toolTip`);
    let SVG = document.getElementById(`${title}toolTipFrame`);
    let content = document.getElementById(`${title}toolTipContent`);
    let mainContainer=document.getElementById('parts-container')
    let contWidth=parseInt(window.getComputedStyle(mainContainer).width)
    let linkPos=elem.getBoundingClientRect().left-mainContainer.getBoundingClientRect().left
    let lRatio=parseInt(linkPos)/contWidth
    


    // Get computed dimensions
    let size = window.getComputedStyle(content);
    let height = parseInt(size.height) + 20; // Add padding
    let width = parseInt(size.width) + 20;   // Add padding
    
    // Set SVG dimensions to match content
    SVG.setAttribute('width', width);
    SVG.setAttribute('height', height);
    SVG.setAttribute('viewBox', `0 0 ${width} ${height}`);
    
   // Calculate pointer position (centered)
// Pointer configuration - only position is dynamic
const pointerConfig = {
    position: lRatio, // 0 (left) to 1 (right) - 0.5 is center
    width: 20      // Fixed pointer width
};

// Calculate dynamic pointer X position
let pointerX = width * pointerConfig.position;

// Fixed other values
const cornerRadius = 10;
const pointerStartY = height - 21; // Fixed vertical start position
const pointerTipY = height - 1;    // Fixed tip position (Y-coordinate of pointer tip)
const bodyBottomCutoff = height - 30; // Fixed where body rounding starts

// SVG path with dynamic pointer X position
SVG.innerHTML = `
    <path d="
        M1,${cornerRadius} 
        Q1,1 ${cornerRadius},1 
        H${width - cornerRadius} 
        Q${width - 1},1 ${width - 1},${cornerRadius} 
        V${bodyBottomCutoff} 
        Q${width - 1},${pointerStartY} ${width - cornerRadius},${pointerStartY} 
        H${pointerX + pointerConfig.width} 
        L${pointerX},${pointerTipY} 
        L${pointerX - pointerConfig.width},${pointerStartY} 
        H${cornerRadius} 
        Q1,${pointerStartY} 1,${bodyBottomCutoff} 
        Z" 
      fill="white" 
      stroke="#ccc" 
      stroke-width="1"
      vector-effect="non-scaling-stroke"/>
`;

// Set the tooltip box dimensions
box.style.width = `${width}px`;
box.style.height = `${height}px`;

// Position the SVG so the pointer tip lands at (targetX, targetY)
    // The pointer tip's position relative to the SVG is (pointerX, pointerTipY)
    let linkX=parseInt(elem.getBoundingClientRect().left)
    let linkY=parseInt(elem.getBoundingClientRect().top)
    const svgX = linkX - pointerX+50;
    const svgY = linkY - pointerTipY-10;

    // Apply positioning (assuming SVG is inside 'box' with position: absolute)
    box.style.left = `${svgX}px`;
    box.style.top = `${svgY}px`;

    box.style.display='none'

    
    let clicked=false
    elem.addEventListener('mouseover',function(){
        if(!clicked){
            new Vivus(`${title}toolTipFrame`, {
                type: 'oneByOne',
                duration:150,
                pathTimingFunction: Vivus.EASE_OUT,
                onReady:function(){
                    gsap.to(box,{duration:0.5,y:10,opacity:1,display:'grid'})
                    gsap.to(`#${title}toolTipContent`,{duration:0.5,delay:0.3,y:-5,opacity:1})
                }
            })
        }
    })
    elem.addEventListener('click',function(){
        clicked=!clicked
    })
    elem.addEventListener('mouseout',function(){
        (!clicked)&&gsap.to(`#${title}toolTipContent`,{duration:0.4,delay:0.3,y:5,opacity:0,onComplete:()=>{
            gsap.to(box,{duration:0.5,y:5,opacity:0,display:'none'})
        }})
    })
}
}

function progressBar(){

    gsap.registerPlugin(Flip, ScrollTrigger);
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


        let length=point.title ? point.title.length : 0
        let text= length>15 ? point.title.slice(0,15)+'...' : point.title
        point.text=draw.text(text)
        .fill('#bfbfbf')
        .cy(rectData.y+rectData.height*(currentHeight/totalHeight))
        .x(rectData.x+40)
        .attr({
            'font-family':'poppins',
            'font-size':'18px',
        })
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
                point.circle.animate(500).fill('#b15a84')
                point.text.animate(500).attr({fill:'#595959'})
                gsap.timeline().to(point.circle.node,{transformOrigin: "center center",scale:1.1,duration:0.3}).to(point.circle.node,{scale:1,duration:0.3})
            },
            onLeaveBack:()=>{
                point.circle.animate(500).fill('#f6f3f4')
                point.text.animate(200).attr({fill:'#bfbfbf'})
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

async function loadAnimations(){
    const {anim:pathDefinition} = await import("@/lib/lessons/topology/homeomorphism/homotopy/pathDefinition.js");
    const {anim:homotopyWithHole} = await import("@/lib/lessons/topology/homeomorphism/homotopy/homotopyWithHole.js");
    const {anim:homotopicalEqu} = await import("@/lib/lessons/topology/homeomorphism/homotopy/homotopicalEqu.js");
    const {anim:concatenation} = await import("@/lib/lessons/topology/homeomorphism/homotopy/concatenation.js");
    const {exo00,exo01,exo02} = await import("@/lib/lessons/topology/homeomorphism/homotopy/exercices")
let frames={
    pathDefinition:pathDefinition,
    homotopyWithHole:homotopyWithHole,
    homotopicalEqu:homotopicalEqu,
    concatenation:concatenation
}
const observer = new MutationObserver(() => {
    if (document.getElementById("exerciceSection")) {
        observer.disconnect();
        exo00().engine[0]()
        exo01().engine[0]()
        exo02().engine[0]()
    }
});
observer.observe(document.body, {
    childList: true,
    subtree: true
});


for (let key in frames) {
  const targetSection = frames[key].vMath.node;
  let isFirstObservation = true;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (isFirstObservation) {
        isFirstObservation = false;
        return; // Skip the first observation
      }

      if (entry.isIntersecting) {
        frames[key].vMath.engine[0]();
        observer.disconnect()
      }
    });
  }, {
    threshold: 0.5,
  });

  observer.observe(targetSection);
}
}

document.addEventListener('DOMContentLoaded',
    function(){
        initializeToolTips()
        progressBar()
        loadAnimations()
    }
)
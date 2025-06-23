import gsap from 'gsap'
import Vivus from 'vivus'
let elems=document.getElementsByClassName('toolTipLink')
setTimeout(function(){
for(let elem of elems){
    let title = elem.getAttribute('data-title');
    let box = document.getElementById(`${title}toolTip`);
    let SVG = document.getElementById(`${title}toolTipFrame`);
    let content = document.getElementById(`${title}toolTipContent`);
    console.log(content)
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
    const svgX = linkX - pointerX-10;
    const svgY = linkY - pointerTipY-10;

    // Apply positioning (assuming SVG is inside 'box' with position: absolute)
    box.style.left = `${svgX}px`;
    box.style.top = `${svgY}px`;

    box.style.display='none'
    elem.addEventListener('mouseover',function(){
        gsap.to(box,{duration:0.5,y:10,opacity:1,display:'grid'})
        new Vivus(`${title}toolTipFrame`, {
                type: 'oneByOne',
                duration:150,
                pathTimingFunction: Vivus.EASE_OUT,
                onReady:function(){
                    gsap.to(`#${title}toolTipContent`,{duration:0.5,delay:0.3,y:-5,opacity:1})
                }
            })
    })
    box.addEventListener('mouseout',function(){
        gsap.to(`#${title}toolTipContent`,{duration:0.4,delay:0.3,y:5,opacity:0,onComplete:()=>{
            gsap.to(box,{duration:0.5,y:5,opacity:0})
        }})
    })
}
},1000)
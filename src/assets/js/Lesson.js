import gsap from 'gsap'
import Vivus from 'vivus'
import { SVG } from '@svgdotjs/svg.js'
import Flip from 'gsap/Flip'
import ScrollTrigger from 'gsap/ScrollTrigger'
import katex from 'katex'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
function fadingEffect(){
    gsap.registerPlugin(ScrollTrigger)

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
}






function initializeToolTips(){ 
    gsap.registerPlugin(ScrollToPlugin)
let elems=document.getElementsByClassName('toolTipLink')
for(let elem of elems){
    gsap.to(elem,{duration:0.5,opacity:0,onComplete:function(){
        elem.style.color='#7b8b9d'
        elem.style.fontWeight='bold'
        gsap.to(elem,{duration:0.5,opacity:1})
    }})
    let title = elem.getAttribute('data-title');
    let box = document.getElementById(`${title}toolTip`).cloneNode(true)
    let SVG =box.querySelector('svg');
    let content = box.querySelector('div');
    let mainContainer=document.getElementById('parts-container')
    let contWidth=parseInt(window.getComputedStyle(mainContainer).width)
    let linkPos=elem.getBoundingClientRect().left-mainContainer.getBoundingClientRect().left
    let lRatio=parseInt(linkPos)/contWidth
    document.body.appendChild(box)
    

    // Get computed dimensions
    let size = window.getComputedStyle(content);
    let height = parseInt(size.height) + 20; // Add padding
    let width = parseInt(size.width) + 20;   // Add padding
    
    // Set SVG dimensions to match content
    SVG.setAttribute('width', width);
    SVG.setAttribute('height', height);
    SVG.setAttribute('viewBox', `0 0 ${width} ${height}`);
    let rand=Math.floor(Math.random() * 5000) 
    SVG.setAttribute('id',`toolTipFrame${rand}`)
    content.setAttribute('id',`toolTipContent${rand}`)
    
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
      stroke-width="1"/>
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
            new Vivus(`toolTipFrame${rand}`, {
                type: 'oneByOne',
                duration:150,
                pathTimingFunction: Vivus.EASE_OUT,
                onReady:function(){
                    gsap.to(box,{duration:0.5,y:10,opacity:1,display:'grid'})
                    gsap.to(`#toolTipContent${rand}`,{duration:0.5,delay:0.3,y:-5,opacity:1})
                }
            })
        }
    })
    elem.addEventListener('click',function(){
        clicked=!clicked
    })
    elem.addEventListener('mouseout',function(){
        (!clicked)&&gsap.to(`#toolTipContent${rand}`,{duration:0.4,delay:0.3,y:5,opacity:0,onComplete:()=>{
            gsap.to(box,{duration:0.5,y:5,opacity:0,display:'none'})
        }})
    })
}

gsap.timeline({
    repeat:-1,
    ease:'power1.inOut',
    delay:2,
    repeatDelay:4})
    .to('.toolTipLink',{
    rotate:2,
    duration:0.2})
    .to('.toolTipLink',{
    rotate:-2,
    duration:0.2})
    .to('.toolTipLink',{
    rotate:1,
    duration:0.2})
    .to('.toolTipLink',{
    rotate:0,
    duration:0.2})

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
            height:parseInt(window.getComputedStyle(child).height),
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
        point.text.node.style.cursor='pointer'
        let ssnapShot=currentHeight
        point.text.node.addEventListener('click',()=>{
            console.log(ssnapShot)
            gsap.to(window,{
                duration:1,
                scrollTo:{
                    y:ssnapShot,
                    behavior:'smooth'
                }
            })
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
let frames={
    pathDefinition:pathDefinition,
    homotopyWithHole:homotopyWithHole,
    homotopicalEqu:homotopicalEqu,
    concatenation:concatenation
}



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




async function exosInitialization(){
    const {exercices} = await import("@/lib/lessons/topology/homeomorphism/homotopy/exercices")
    const observer = new MutationObserver(() => {
        if (document.getElementById("exerciceSection")) {
            observer.disconnect();
            for (let key in exercices){
                exercices[key].question().engine[0]()
            }
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    document.addEventListener('exerciceAnswered',(event)=>{
        exercices[event.detail.name].answered=true
        
    })
}

// Custom slider initialization function
function initCustomSlider(input) {
    // Create wrapper and insert before the input
    const wrapper = document.createElement('div');
    wrapper.className = 'range-input-wrapper';
    input.parentNode.insertBefore(wrapper, input);
    
    // Setup SVG canvas
    const draw = SVG().addTo(wrapper).size(300, 50);
    const group = draw.group();
    
    // Create slider elements
    const thickLine = group.rect(240, 22).fill('#9c4971').radius(10);
    const thinLine = group.rect(210, 6).fill('white').radius(5).move(15, 8);
    const greenLine = group.rect(50, 6).fill('#ffd480').radius(5).move(15, 8);
    const circle = group.circle(14).fill('#ffd480').center(50, 11);
    
    group.transform({ translate: { x: 20, y: 20 } });
  
    // Convert between pixel positions and input values
    function positionToValue(x) {
      const minX = 15;
      const maxX = 225;
      const min = parseFloat(input.min) || 0;
      const max = parseFloat(input.max) || 100;
      const normalized = (x - minX) / (maxX - minX);
      return Math.round(normalized * (max - min)) + min;
    }
  
    function valueToPosition(value) {
      const min = parseFloat(input.min) || 0;
      const max = parseFloat(input.max) || 100;
      return 15 + ((value - min) / (max - min)) * (225 - 15);
    }
  
    // Update slider position and input value
    const eventDisp=new Event('input')
    function moveToPosition(x) {
      x = Math.max(15, Math.min(x, 225));
      const value = positionToValue(x);
      
      input.value = value;
      (eventDisp.currentTarget!=null)&&input.dispatchEvent(eventDisp);
      
      gsap.to(circle.node, { attr: { cx: x }, duration: 0.3, ease: "power2.out" });
      gsap.to(greenLine.node, { attr: { width: x - 15 }, duration: 0.3, ease: "power2.out" });
    }
  
    // Mouse event handlers
    
    const rect = wrapper.getBoundingClientRect();
    function onMouseMove(e) {
      const x = e.clientX - rect.left - 20;
      moveToPosition(x);
    }
  
    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
  
    // Initialize slider position
    function initPosition() {
      const value = parseFloat(input.value) || (parseFloat(input.min) || 0);
      const x = valueToPosition(value);
      circle.center(x, 11);
      greenLine.width(x - 15);
    }
  
    // Event listeners
    wrapper.addEventListener('mousedown', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left - 20;
      moveToPosition(x);
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  
    input.addEventListener('input', () => {
      const value = parseFloat(input.value) || 0;
      const x = valueToPosition(value);
      moveToPosition(x);
    });
  
    wrapper.addEventListener('selectstart', (e) => e.preventDefault());
  
    // Initialize
    initPosition();
  }
  
  // MutationObserver to watch for range inputs
  function setupRangeInputObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            if (node.classList.contains('rangeInput')) {
              initCustomSlider(node);
            }
            const inputs = node.querySelectorAll('.rangeInput');
            inputs.forEach(initCustomSlider);
          }
        });
      });
    });
  
    observer.observe(document.body, { childList: true, subtree: true });
  
    // Initialize existing inputs
    document.querySelectorAll('.rangeInput').forEach(initCustomSlider);
  }










// Custom slider initialization function
function initCustomRadio(input) {
    // Create wrapper and insert before the input
    const name=input.name
    const otherInputs = document.querySelectorAll('input[type="radio"][name="'+name+'"]')
    const wrapper = document.createElement('div');
    wrapper.className = 'radio-input-wrapper';
    wrapper.style.display='inline-block'
    input.parentNode.insertBefore(wrapper, input);
    
    // Setup SVG canvas
    const draw = SVG().addTo(wrapper).size(70, 70);
    const group = draw.group();
    
    // Create slider elements
    const circle = group.circle(20).fill('#ffffff').stroke({color:'#9c4971',width:2}).move(3,3)

    

  
  
    circle.node.addEventListener('mousedown', (e) => {
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      input.dispatchEvent(clickEvent);
      circle.animate(100).fill('#9c4971')
      otherInputs.forEach((otherInput) => {
        if (otherInput !== input) {
            SVG(otherInput.parentNode.querySelector('.radio-input-wrapper').querySelector('circle')).animate(100).fill('#ffffff')
        }
      });
    });
  
  }
  
  // MutationObserver to watch for range inputs
  function setupRadioInputObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            if (node.classList.contains('radioInput')) {
              initCustomRadio(node);
            }
            const inputs = node.querySelectorAll('.radioInput');
            inputs.forEach(initCustomRadio);
          }
        });
      });
    });
  
    observer.observe(document.body, { childList: true, subtree: true });
  
    // Initialize existing inputs
    document.querySelectorAll('.rangeInput').forEach(initCustomSlider);
    document.querySelectorAll('.radioInput').forEach(initCustomRadio);

  }

















document.addEventListener('DOMContentLoaded',
    function(){

        initializeToolTips()
        progressBar()
        fadingEffect()
        loadAnimations()
        exosInitialization()
        setupRangeInputObserver()
        setupRadioInputObserver()
    }
)
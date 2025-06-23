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
// Function to render KaTeX elements
function renderKatexElements() {
    const katexInputs = document.querySelectorAll('.katex-input');
    
    katexInputs.forEach(element => {
      // Skip if already rendered
      if (element.dataset.rendered === 'true') return;
      
      try {
        const texContent = element.textContent;
        katex.render(texContent, element, {
          throwOnError: false
        });
        element.dataset.rendered = 'true';
      } catch (e) {
        console.error('KaTeX rendering error:', e);
      }
    });
  }
  
  // Set up MutationObserver to watch for changes
  const observer = new MutationObserver((mutations) => {
    renderKatexElements();
  });
  
  // Start observing the document with the configured parameters
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
  });
  
  // Initial render
  document.addEventListener('DOMContentLoaded', renderKatexElements);
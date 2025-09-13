
import { SVG } from '@svgdotjs/svg.js';
import gsap from 'gsap';
import { createPathConnectAnimation, createGraphAnimation, createTorusAnimation } from './indexTestLib.js';

let texts=[`Topology is a branch of mathematics that studies the properties of 
                             space that are preserved under continuous deformations, 
                             such as stretching or bending, but not tearing or gluing. 
                             It focuses on concepts like continuity, compactness, and connectedness, 
                             and plays a key role in fields like geometry, analysis, and physics`,
                             `Functional analysis is a branch of mathematical analysis that studies 
                             the properties of functions and function spaces, 
                             with a focus on infinite-dimensional spaces. 
                             It has applications in many areas of mathematics, 
                             including differential equations, optimization, and probability theory.`
                            ]
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

window.onload = function() {
    Array.from(document.getElementsByClassName('branch')).forEach((branch)=>{
        branch.addEventListener('click', (event) => {
        const id = branch.getAttribute('data-id');
        document.getElementById('title').textContent = branch.textContent;
        document.getElementById('description').textContent = texts[id];
    });
})

    let container = document.getElementById('svgContainer');
    let svg = SVG().addTo(container).size(container.offsetWidth, container.offsetHeight);
    createPathConnectAnimation(svg).play()
    createGraphAnimation(svg).play()
    createTorusAnimation(svg).play()
        
};
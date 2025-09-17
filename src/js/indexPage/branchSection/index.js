import {createPathConnectAnimation,createGraphAnimation,createTorusAnimation,createCurveApproaximation,createUnderCurveSpaceAnimation,createSymboles} from './indexTestLib.js'
import {lessonsButton,categoriesButton} from './buttons.js'
import gsap from 'gsap'
import { SVG } from '@svgdotjs/svg.js';
export function branchesSectionScript() {

    var texts=[`Topology is a branch of mathematics that studies the properties of 
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

    let container = document.getElementById('svgContainer');

    let svg = SVG().addTo(container).size(container.offsetWidth, container.offsetHeight);


    let topoSprits=[createPathConnectAnimation(svg),createGraphAnimation(svg),createTorusAnimation(svg)]
    topoSprits.forEach(sprit=>sprit.In())
    let functionalAnalysisSprits=[createCurveApproaximation(svg),createUnderCurveSpaceAnimation(svg),createSymboles(svg)]
    functionalAnalysisSprits.forEach(sprit=>{
        sprit.In()
        setTimeout(()=>sprit.Out(),500)
    })
    Array.from(document.getElementsByClassName('branch')).forEach((branch)=>{
        branch.addEventListener('click', (event) => {
        const id = branch.getAttribute('data-id');
        document.getElementById('title').textContent = branch.textContent;
        document.getElementById('description').textContent = texts[id];
        if(id==0){
            topoSprits.forEach((sprite)=>sprite.In())
            functionalAnalysisSprits.forEach((sprite)=>sprite.Out())
        }else{
            functionalAnalysisSprits.forEach((sprite)=>sprite.In())
            topoSprits.forEach((sprite)=>sprite.Out())
        }
    });
    let mask=document.getElementById('svgContainerMask')
    gsap.to(mask,{duration:0.5,delay:0.7,opacity:0})
    })

    let children=svg.children()
    let group=svg.group()
    children.forEach((child)=>group.node.appendChild(child.node))
    const x=container.offsetWidth/2
    group.transform({translate:[x,0]})





    lessonsButton()
    categoriesButton()
    

    
}

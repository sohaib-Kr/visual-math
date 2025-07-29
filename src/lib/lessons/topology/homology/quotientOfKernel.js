import { vMathAnimation } from "@/lib/library";
import katex from 'katex';
import gsap from 'gsap';
import { SVG } from '@svgdotjs/svg.js';

const anim = new vMathAnimation('quotientOfKernel');

anim.setInit(function() {
    const draw = anim.frame;
    const main = draw.group();
    const vertexSymbol = draw.symbol().circle(10).attr(anim.config().indicationPoint);
    const latexSpace = anim.sideBar.createText();
    const secLatexSpace = anim.sideBar.createText();
    
    let currentAnimation;
    let vertexElements = {};
    let edgeElements = {};
    let triangleElements = {};
    let currentComplex = 0;
    let txtToRemove=[]
    let nextButton
    let mappedChainTexts

    // Different simplicial complex configurations
    const complexes = [
        { // Complex 0 - Basic triangle with extra edges
            vertices: {
                a: [-300, 0],
                b: [-150, -150],
                c: [0, 0],
                d: [150, -150]
            },
            edges: ['a,b', 'b,c', 'c,d', 'a,c', 'b,d'],
            triangles: ['a,b,c'],
            kernelChains: [
                'a,b+b,c+a,c',
                'b,c+b,d+c,d',
                'a,b+a,c+b,d+c,d'
            ],
            mappedKernelChains:'x,y,x+y',
            mappedImChains:'x',
            quotient:'y',
            mappedChainsPos:{
                x:[-150,-75],
                y:[0,-100]
            }
        },
        { // Complex 1 - case of 2 triangles
            vertices: {
                a: [-300, 0],
                b: [-150, -150],
                c: [0, 0],
                d: [150, -150],
                e:[250,0],
            },
            edges: ['a,b', 'b,c', 'c,d', 'a,c', 'b,d','c,e','d,e'],
            triangles: ['a,b,c','c,d,e'],
            kernelChains: [
                'a,b+b,c+a,c',
                'b,c+c,d+b,d',
                'c,d+d,e+c,e',
                'a,b+b,d+c,d+a,c',
                'b,d+d,e+c,e+b,c',
                'a,b+b,c+a,c+c,d+d,e+c,e',
                'a,b+b,d+d,e+c,e+a,c'
            ],
            mappedKernelChains:'x,y,z,x+y,y+z,x+z,x+y+z',
            mappedImChains:'x,z,x+z',
            quotient:'y',
            mappedChainsPos:{
                x:[-150,-75],
                y:[0,-100],
                z:[125,-75]
            }
        },
        { 
            vertices: {
                a: [-300, 0],
                b: [-150, -150],
                c: [0, 0],
                d: [150, -150],
                e:[250,0],
                f:[0,-300]
            },
            edges: ['a,b', 'b,c', 'c,d', 'a,c', 'b,d','c,e','d,e','b,f','d,f'],
            triangles: ['a,b,c','c,d,e'],
            kernelChains: [
                'a,b+b,c+a,c',
                'b,c+c,d+b,d',
                'c,d+d,e+c,e',
                'a,b+b,d+c,d+a,c',
                'b,d+d,e+c,e+b,c',
                'a,b+b,c+a,c+c,d+d,e+c,e',
                'a,b+b,d+d,e+c,e+a,c'
            ],
            mappedKernelChains:'l,m,n,l+m,m+n,l+n,l+m+n',
            mappedImChains:'l,n,l+n',
            quotient:'m,o,m+o',
            mappedChainsPos:{
                l:[-150,-75],
                m:[0,-100],
                n:[125,-75],
                o:[0,-225]
            }
        }
    ];


    function zoom(type){
        if(type==0){
            anim.frame.animate(500).transform({scale:1.8,origin:[-100,-200]})
        }else if(type==1){
            anim.frame.animate(500).transform({scale:1.7,origin:[-70,-200]})
        }else if(type==2){
            anim.frame.animate(500).transform({scale:1.7,origin:[-70,-300]})
        }
    }
    function createMappedChainTexts() {
        if (!complexes[currentComplex].mappedChainsPos) return null;
        
        const textGroup = main.group();
        
        Object.entries(complexes[currentComplex].mappedChainsPos).forEach(([key, pos]) => {
            const textElement = textGroup.text(key)
                .move(pos[0], pos[1])
                .font({
                    family: 'Arial, sans-serif',  // More readable font
                    size: 32,                    // Larger size
                    fill: '#ffffff',
                })
                .attr({
                    'text-anchor': 'middle',
                    'dominant-baseline': 'middle',
                    opacity: 0
                });
                
            // Animate the text appearance
            gsap.to(textElement.node, {
                duration: 0.5,
                delay: 1,
                attr: { opacity: 1 }
            });
        });
        
        return textGroup;
    }

    // Function to change the complex
    async function changeComplex(index) {
        currentComplex = index;
        const complex = complexes[index];
        
        // Clear existing elements
        await gsap.to(main.node,{duration:0.5,opacity:0})
        main.clear();
        zoom(index)
        vertexElements = {};
        edgeElements = {};
        triangleElements = {};
        
        // Create vertices
        Object.keys(complex.vertices).forEach(key => {
            vertexElements[key] = main.use(vertexSymbol)
                .center(complex.vertices[key][0], complex.vertices[key][1])
                .attr({ opacity: 0.3 });
        });

        // Create edges
        complex.edges.forEach(edge => {
            const [v1, v2] = edge.split(',');
            edgeElements[edge] = main.line(
                complex.vertices[v1][0], complex.vertices[v1][1],
                complex.vertices[v2][0], complex.vertices[v2][1]
            ).attr({ ...anim.config().path1, opacity: 0.3 });
        });

        // Create triangles
        complex.triangles.forEach(triangle => {
            const [v1, v2, v3] = triangle.split(',');
            triangleElements[triangle] = main.polygon([
                complex.vertices[v1][0], complex.vertices[v1][1],
                complex.vertices[v2][0], complex.vertices[v2][1],
                complex.vertices[v3][0], complex.vertices[v3][1]
            ]).attr({ fill: '#44335e', opacity: 0.3, stroke: 'none' });
        });

        // Position the complex
        main.transform({ translate: [600, 400] });
        await gsap.to(main.node,{duration:0.5,opacity:1})
    }

    function fadeNonQuotientTexts(quotient, mappedChainTexts) {
        const quotientVars = quotient.split(',').map(v => v.trim());
        Array.from(mappedChainTexts.children()).forEach(txt => {
            if (!quotientVars.includes(txt.text())) {
                gsap.to(txt.node, {
                    duration: 0.5,
                    opacity: 0.2
                });
            }
        });
    }

    // Function to highlight simplices
    function highlightSimplices(names, opacity = 1) {
        names.split('+').forEach(name => {
            name = name.trim();
            if (vertexElements[name]) {
                currentAnimation = gsap.to(vertexElements[name].node, {duration: 0.3, attr: {opacity}});
            }
            if (edgeElements[name]) {
                currentAnimation = gsap.to(edgeElements[name].node, {duration: 0.3, attr: {opacity}});
            }
            if (triangleElements[name]) {
                currentAnimation = gsap.to(triangleElements[name].node, {duration: 0.3, attr: {opacity}});
            }
        });
    }

    // Add this function to your script
    async function mapKernelChainsToVariables() {
        resetHighlights();
        const complex = complexes[currentComplex];
        const kernelContainer = latexSpace.textSpace.querySelector('div'); // Get the kernel container
        if (!kernelContainer) return;
        gsap.to(kernelContainer,{duration:0.5,opacity:0,onComplete:async function(){
            kernelContainer.remove()
            await new Promise((resolve)=>setTimeout(resolve,500))
            txtToRemove.push(latexSpace.appendText({text:complex.mappedKernelChains+'\\}',latex:true,fade:true}))
            await new Promise((resolve)=>setTimeout(resolve,500))
            let txt=secLatexSpace.update({newText:'Im(\\partial_2) = \\{'+complex.mappedImChains+'\\}',latex:true,fade:true}).textSpace
            txtToRemove.push(txt)
            console.log(txt)
            }})
        }
    async function calculateQuotient() {
        const complex = complexes[currentComplex];
        await new Promise((resolve)=>setTimeout(resolve,500))
        txtToRemove.forEach((txt)=>{
            gsap.to(txt,{duration:0.5,opacity:0,onComplete:function(){
                txt.innerHTML=''
            }})
        })
        await new Promise((resolve)=>setTimeout(resolve,500))
        latexSpace.appendText({text:'/ Im(\\partial_2) = \\{'+complex.quotient+'\\}',latex:true,fade:true})
    }

    // Function to reset all highlights
    function resetHighlights() {
        Object.values(vertexElements).forEach(v => 
            currentAnimation = gsap.to(v.node, {duration: 0.3, attr: {opacity: 0.3}}));
        Object.values(edgeElements).forEach(e => 
            currentAnimation = gsap.to(e.node, {duration: 0.3, attr: {opacity: 0.3}}));
        Object.values(triangleElements).forEach(t => 
            currentAnimation = gsap.to(t.node, {duration: 0.3, attr: {opacity: 0.3}}));
    }

    // Function to create kernel UI
    async function createKernelUI() {
        const complex = complexes[currentComplex];
        // Clear previous kernel UI
        gsap.to(secLatexSpace.textSpace,{duration:0.5,opacity:0,onComplete:function(){
            secLatexSpace.textSpace.innerHTML=''
            gsap.set(secLatexSpace.textSpace,{opacity:1})
        }})
        await gsap.to(latexSpace.textSpace,{duration:0.5,opacity:0,onComplete:function(){
            latexSpace.textSpace.innerHTML=''
            gsap.set(latexSpace.textSpace,{opacity:1})
        }})
        
        
        // Create kernel header
        latexSpace.appendText({text:'ker(\\partial_1)',latex:true,fade:true})
        txtToRemove.push(latexSpace.appendText({text:'= \\{',latex:true,fade:true}))
        
        // Create kernel elements container
        const kernelContainer = document.createElement('div');
        kernelContainer.style.display = 'flex';
        kernelContainer.style.flexDirection = 'column';
        kernelContainer.style.gap = '8px';
        kernelContainer.style.width = 'fit-content';
        kernelContainer.style.padding = '12px';
        kernelContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        kernelContainer.style.borderRadius = '8px';
        
        // Add each kernel chain
        let done=false
        complex.kernelChains.forEach((chain, i) => {
            if(done){
                return
            }
            const chainElement = document.createElement('div');
            katex.render(chain.replace(/,/g, ''), chainElement, { throwOnError: true, displayMode: false });
            chainElement.style.padding = '6px 12px';
            chainElement.style.borderRadius = '6px';
            chainElement.style.opacity=0
            chainElement.style.cursor = 'pointer';
            chainElement.style.transition = 'all 0.2s ease';
            chainElement.style.width = 'fit-content';
            chainElement.style.fontFamily = 'Latin Modern Math, serif';
            chainElement.style.fontSize = '18px';
            gsap.to(chainElement,{duration:0.5,delay:1,opacity:1})
            // Mouse interaction
            let isMouseInside = false;
            chainElement.addEventListener('mouseenter', () => {
                isMouseInside = true;
                chainElement.style.backgroundColor = 'rgba(255, 153, 167, 0.1)';
                setTimeout(() => {
                    if (isMouseInside) {
                        highlightSimplices(chain, 1);
                    }
                }, 300);
            });
            
            chainElement.addEventListener('mouseleave', () => {
                isMouseInside = false;
                chainElement.style.backgroundColor = '';
                resetHighlights();
            });
            
            kernelContainer.appendChild(chainElement);
            if(i==3){
                let dots=document.createElement('div')
                katex.render('\\cdots \\} ', dots, { throwOnError: true });
                dots.style.transform='translate(12px,-15px)'
                dots.style.opacity=0
                gsap.to(dots,{duration:0.5,delay:1.4,opacity:1})
                kernelContainer.appendChild(dots)
                done=true
            }
        });
        
        // Add closing brace
        if(!done){
            const closingBrace = document.createElement('div');
            katex.render('\\}', closingBrace, { throwOnError: true });
            closingBrace.style.fontSize = '18px';
            closingBrace.style.paddingLeft = '12px';
            closingBrace.style.opacity=0
            gsap.to(closingBrace,{duration:0.5,delay:1,opacity:1})
            kernelContainer.appendChild(closingBrace);
        }
        // Append to the latex space
        latexSpace.textSpace.appendChild(kernelContainer);
    }

    // Animation steps
    let timeout
    anim.initSteps([
        ()=>{
            changeComplex(0);
        },
        ()=>{
            anim.sideBar.createButtonGroup({
                buttons: [
                    {name: 'example 1', value: 0},
                    {name: 'example 2', value: 1},
                    {name: 'example 3', value: 2},
                ],
                listener: (value) => {
                    changeComplex(value)
                    anim.step=2
                    anim.play()
                    nextButton&&nextButton.kill()
                    mappedChainTexts=null
                }
            })
        },
        () => {
            // Initial complex setup
            anim.pause();
            createKernelUI()
            timeout&&clearTimeout(timeout)
            timeout=setTimeout(function(){
                nextButton=anim.sideBar.createButton({
                    name: 'Next',
                    listener: () => anim.play()
                });
            },3000)
        },
        ()=>{
            anim.pause()
            mappedChainTexts=createMappedChainTexts()
            mapKernelChainsToVariables()
        },
        ()=>{
            calculateQuotient()
            setTimeout(()=>{
                fadeNonQuotientTexts(complexes[currentComplex].quotient, mappedChainTexts)
            },1000)
            anim.pause()
            nextButton.kill()
        }
    ]);
});

export default anim;
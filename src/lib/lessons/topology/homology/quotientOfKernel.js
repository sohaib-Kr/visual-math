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
    
    let currentAnimation
    const vertices = {
        a: [-300, 0],    
        b: [-150, -150], 
        c: [0, 0],       
        d: [150, -150],
    };

    const edges = [
        'a,b', 'b,c', 'c,d', 'a,c', 'b,d'
    ];

    const triangles = [
        'a,b,c'
    ];

    // Create all simplex elements
    const vertexElements = {};
    const edgeElements = {};
    const triangleElements = {};

    // Create vertices
    Object.keys(vertices).forEach(key => {
        vertexElements[key] = main.use(vertexSymbol)
            .center(vertices[key][0], vertices[key][1])
            .attr({ opacity: 0.3 });
        main.text(key).move(vertices[key][0]+15, vertices[key][1]+15)
            .font({ size: '20px', fill: '#ffa64d' });
    });

    // Create edges
    edges.forEach(edge => {
        const [v1, v2] = edge.split(',');
        edgeElements[edge] = main.line(
            vertices[v1][0], vertices[v1][1],
            vertices[v2][0], vertices[v2][1]
        ).attr({ ...anim.config().path1, opacity: 0.3 });
    });

    // Create triangles
    triangles.forEach(triangle => {
        const [v1, v2, v3] = triangle.split(',');
        triangleElements[triangle] = main.polygon([
            vertices[v1][0], vertices[v1][1],
            vertices[v2][0], vertices[v2][1],
            vertices[v3][0], vertices[v3][1]
        ]).attr({ fill: '#44335e', opacity: 0.3, stroke: 'none' });
    });

    // Position the complex
    main.transform({ translate: [600, 400] });

    // Function to highlight simplices
    function highlightSimplices(names, opacity = 1) {
        names.split('+').forEach(name => {
            name = name.trim();
            if (vertexElements[name]) {
                currentAnimation=gsap.to(vertexElements[name].node,{duration:0.3,attr:{opacity}});
            }
            if (edgeElements[name]) {
                currentAnimation=gsap.to(edgeElements[name].node,{duration:0.3,attr:{opacity}});
            }
            if (triangleElements[name]) {
                currentAnimation=gsap.to(triangleElements[name].node,{duration:0.3,attr:{opacity}});
            }
        });
    }

    // Function to reset all highlights
    function resetHighlights() {
        Object.values(vertexElements).forEach(v => currentAnimation=gsap.to(v.node,{duration:0.3,attr:{opacity:0.3}}));
        Object.values(edgeElements).forEach(e => currentAnimation=gsap.to(e.node,{duration:0.3,attr:{opacity:0.3}}));
        Object.values(triangleElements).forEach(t => currentAnimation=gsap.to(t.node,{duration:0.3,attr:{opacity:0.3}}));
    }

    const kernelChains = [
        'a,b+b,c+a,c',
        'b,c+b,d+c,d',
        'a,b+a,c+b,d+c,d'
    ];
    
    // Animation steps
    anim.initSteps([
        () => {
            latexSpace.update({
                newText: 'ker(\\partial_1) = \\{',
                fade: true,
                latex: true
            });
        },
        () => {
            // Create a container for the kernel elements
            const kernelContainer = document.createElement('div');
            kernelContainer.style.opacity=0;
            kernelContainer.style.display = 'flex';
            kernelContainer.style.flexDirection = 'column';
            kernelContainer.style.gap = '8px';
            kernelContainer.style.width = 'fit-content';
            kernelContainer.style.padding = '12px';
            kernelContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            kernelContainer.style.borderRadius = '8px';
            
            kernelChains.forEach((chain, i) => {
                const chainElement = document.createElement('div');
                katex.render(chain.replace(/,/g, ''), chainElement, { throwOnError: true, displayMode: false });
                chainElement.style.padding = '6px 12px';
                chainElement.style.borderRadius = '6px';
                chainElement.style.cursor = 'pointer';
                chainElement.style.transition = 'all 0.2s ease';
                chainElement.style.width = 'fit-content';
                chainElement.style.fontFamily = 'Latin Modern Math, serif';
                chainElement.style.fontSize = '18px';
                
                // Mouse enter event
                let isMouseInside = false;

                chainElement.addEventListener('mouseenter', () => {
                    isMouseInside = true;
                    chainElement.style.backgroundColor = 'rgba(255, 153, 167, 0.1)';
                    
                    setTimeout(() => {
                        if (isMouseInside) {  // Only run if mouse is still inside
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
            });
            gsap.to(kernelContainer,{duration:1,opacity:1})
            
            // Add closing brace
            const closingBrace = document.createElement('div');
            closingBrace.textContent = '}';
            closingBrace.style.fontFamily = 'Latin Modern Math, serif';
            closingBrace.style.fontSize = '18px';
            closingBrace.style.paddingLeft = '12px';
            kernelContainer.appendChild(closingBrace);
            // Append to the latex space
            latexSpace.textSpace.appendChild(kernelContainer);
        }
    ]);
});

export default anim;
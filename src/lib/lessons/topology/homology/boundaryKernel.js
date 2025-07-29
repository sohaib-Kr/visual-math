import { vMathAnimation } from "@/lib/library";
import gsap from 'gsap';
const anim = new vMathAnimation('boundaryKernel');

anim.setInit(function() {
    const draw = anim.frame;
    const main = draw.group();
    const vertexSymbol = draw.symbol().circle(10).attr(anim.config().indicationPoint);
    
    const vertices = {
        a: [-300, 0],    
        b: [-150, -150], 
        c: [0, 0],       
        d: [150, -150],  
        e:[-150,150]
    };

    const edges = [
        'a,b', 'b,c', 'c,d','a,c','b,d','c,e','a,e'
    ];

    const triangles = [
        'a,b,c','b,c,d'
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

    // UI Elements
    const infoText = anim.sideBar.createText();

    // Function to highlight simplices
    function highlightSimplices(names, opacity = 1) {
        names.split('+').forEach(name => {
            name = name.trim();
            if (vertexElements[name]) {
                vertexElements[name].animate(300).attr({ opacity });
            }
            if (edgeElements[name]) {
                edgeElements[name].animate(300).attr({ opacity });
            }
            if (triangleElements[name]) {
                triangleElements[name].animate(300).attr({ opacity });
            }
        });
    }

    // Function to reset all highlights
    function resetHighlights() {
        Object.values(vertexElements).forEach(v => v.animate(300).attr({ opacity: 0.3 }));
        Object.values(edgeElements).forEach(e => e.animate(300).attr({ opacity: 0.3 }));
        Object.values(triangleElements).forEach(t => t.animate(300).attr({ opacity: 0.3 }));
    }

    // Animation steps
    anim.initSteps([
        // Step 0: Initial state
        () => {
            anim.frame.animate(500).transform({scale:1.7,origin:[-100,0]})
            infoText.update({ 
                newText: 'as you can see all chains of dimension 1 that ends at the same starting points get mapped to 0 (cycles)',
                fade: true
            });
        },
        
        // Step 1: Highlight 4 cycles in the kernel
        async () => {
            anim.pause()
            const cycles = [
                'a,b + b,c + a,c',
                'a,b + b,c + c,e + a,e',
                'a,b + b,d + c,d + a,c',
                'a,b + b,d + c,d + c,e + a,e'
            ];
            resetHighlights();
            for (const cycle of cycles) {
                highlightSimplices(cycle, 1);
                await new Promise(resolve => setTimeout(resolve, 2000));
                resetHighlights();
            }
            anim.play()
        },
        
        // Step 2: Show boundary of triangles maps to 0
        async () => {
            anim.pause()
            await gsap.to(infoText.textSpace,{duration:0.5,opacity:0})
            infoText.update({
                newText: 'Triangle boundaries are always cycles',
                fade: true
            });
            
            // Highlight both triangle boundaries simultaneously
            const boundaries = [
                'a,b + b,c + a,c',  
                'b,c + c,d + b,d',
                'a,b + c,d + a,c + b,d'
            ];
            
            // Highlight their boundaries
            let i=0
            let l=setInterval(()=>{
                if(i==3){
                    clearInterval(l)
                    resetHighlights();
                    anim.play()
                    return
                }
                resetHighlights()
                 highlightSimplices(boundaries[i],1)
                 i++
            },2000)
            
        },
        async () => {
            await new Promise(resolve => setTimeout(resolve, 500));

            infoText.update({
                newText: 'Out main focus in this particular cycle which represents (a hole). Next we will use algebraic tools to capture this chain abstractly',
                fade: true
            });
            await new Promise(resolve => setTimeout(resolve, 500));
            highlightSimplices('a,e + c,e + a,c',1)
        }
    ]);
});

export default anim;
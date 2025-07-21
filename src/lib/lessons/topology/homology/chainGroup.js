import { vMathAnimation } from "@/lib/library";

const anim = new vMathAnimation('chainGroup');

anim.setInit(function() {
    let main = anim.frame.group();
    let complex = {};
    
    const vertices = {
        a: [-200, 200],
        b: [-100, 0],
        c: [200, 100],
        d: [100, 300],
    };
    
    const edges = ['a,b', 'b,c', 'a,c', 'a,d', ];
    const triangles = ['a,b,c'];
    
    
    
    // Create edge elements
    const edgeElements = edges.map(edge => {
        const [v1, v2] = edge.split(',');
        const line = main.line(
            vertices[v1][0], vertices[v1][1],
            vertices[v2][0], vertices[v2][1]
        ).attr({...anim.config().path1,opacity:0.5});
        
        return {
            name: edge,
            elem: line,
            vertices: [v1, v2],
            dim: 1
        };
    });
    
    // Create triangle elements
    const triangleElements = triangles.map(triangle => {
        const [v1, v2, v3] = triangle.split(',');
        const points = [
            vertices[v1][0], vertices[v1][1],
            vertices[v2][0], vertices[v2][1],
            vertices[v3][0], vertices[v3][1]
        ];
        const poly = main.polygon(points).attr({
            fill: '#44335e',
            opacity: 0.5,
            stroke: 'none'
        });
        
        return {
            name: triangle,
            elem: poly,
            vertices: [v1, v2, v3],
            dim: 2
        };
    });
    // Create vertex elements
    const vertexElements = Object.keys(vertices).map((key) => {
        return {
            name: key,
            elem: main.circle(10).attr({...anim.config().indicationPoint, opacity: 0.5})
                 .center(vertices[key][0], vertices[key][1]),
            dim: 0
        };
    });
    
    // Combine all simplices into complex object
    [...vertexElements, ...edgeElements, ...triangleElements].forEach(simplex => {
        complex[simplex.name] = simplex.elem;
    });
    
    // Function to generate combinations of simplices of specific dimension
    function generateDimensionChains(simplices, dimension) {
        // Filter simplices by dimension
        const dimSimplices = simplices.filter(s => s.dim === dimension);
        
        const result = [];
        
        function backtrack(start, current, length) {
            if (current.length === length) {
                result.push(current.slice());
                return;
            }
            
            for (let i = start; i < dimSimplices.length; i++) {
                current.push({
                    name: dimSimplices[i].name,
                    elem: complex[dimSimplices[i].name],
                    vertices: dimSimplices[i].vertices,
                    dim: dimSimplices[i].dim
                });
                backtrack(i + 1, current, length);
                current.pop();
            }
        }
        
        // Generate combinations of all lengths from 1 to number of simplices
        for (let length = 1; length <= dimSimplices.length; length++) {
            backtrack(0, [], length);
        }
        
        return result;
    }
    
    // Function to display chains for a specific dimension
    function displayDimensionChains(dimension) {
        const allSimplices = [...vertexElements, ...edgeElements, ...triangleElements];
        const chains = generateDimensionChains(allSimplices, dimension);
        
        // Group chains by length (number of simplices in combination)
        const groupedChains = {};
        chains.forEach(chain => {
            const length = chain.length;
            if (!groupedChains[length]) groupedChains[length] = [];
            groupedChains[length].push(chain);
        });
        
        // Display the chains
        Object.entries(groupedChains).forEach(([length, chains]) => {
            let lineStrArray = [];
            
            chains.slice(0, 3).forEach((chain, j) => {
                lineStrArray.push(chain.map(simplex => simplex.name).join('+'));
                if (j < chains.length - 1 && j < 2) {
                    lineStrArray.push('\\ , \\ ');
                }
            });
            
            if (chains.length > 3) {
                lineStrArray.push('\\cdots');
            }
            
            const text = anim.elements.dynamicInlineLatexText({
                inputString: lineStrArray,
                textStyle: { fontSize: '30px', color: '#ff99a7' }
            }).addTo(main)
            .move(-550, parseInt(length) * 60 - 400);
            
            // Add hover effects
            chains.slice(0, 3).forEach((chain, index) => {
                const textIndex = index * 2; // Account for commas
                if (text.node.children[textIndex]) {
                    Object.assign(text.node.children[textIndex].style, {
                        'background-color': 'rgba(255, 153, 153, 0.2)',
                        'border-radius': '20px',
                        'padding': '3px 12px',
                        'cursor': 'pointer',
                        'transition': 'all 0.3s ease-in-out'
                    });
                    
                    const activeAnimations = new WeakMap();
                    
                    text.node.children[textIndex].addEventListener('mouseenter', () => {
                        chain.forEach(simplex => {
                            const existing = activeAnimations.get(simplex.elem);
                            if (existing) existing.unschedule();
                            
                            const anim = simplex.elem.animate({ duration: 200 }).attr({ opacity: 1 });
                            activeAnimations.set(simplex.elem, anim);
                        });
                    });
                    
                    text.node.children[textIndex].addEventListener('mouseleave', () => {
                        chain.forEach(simplex => {
                            const existing = activeAnimations.get(simplex.elem);
                            if (existing) existing.unschedule();
                            
                            const anim = simplex.elem.animate({ duration: 200 }).attr({ opacity: 0.2 });
                            activeAnimations.set(simplex.elem, anim);
                        });
                    });
                }
            });
        });
    }
    
    main.transform({translate: [600, 400]});
    
    // Display chains for each dimension separately
    displayDimensionChains(0);  // 0D (vertices)
    // displayDimensionChains(1);  // 1D (edges)
    // displayDimensionChains(2, 100);   // 2D (triangles)
    
    anim.initSteps([() => {}]);
});

export default anim;
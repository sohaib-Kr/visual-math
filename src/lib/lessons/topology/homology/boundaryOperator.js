import { vMathAnimation } from "@/lib/library";

const anim = new vMathAnimation('boundaryOperator');

anim.setInit(function() {
    const draw = anim.frame;
    const main = draw.group();
    const vertexSymbol = draw.symbol().circle(10).attr(anim.config().indicationPoint);
    
    // Define our simplicial complex
    const vertices = {
        a: [-400, 200],    
        b: [-150, -200],   
        c: [200, 150],     
        d: [250, -50],     
        e: [350, 50],     
        f: [50, -250],     
        g: [-100, 50],     
        h: [-350, -250]
    };

    const edges = [
        'a,b', 'b,c', 'a,c',  // Triangle 1
        'c,d', 'd,e', 'c,e',  // Triangle 2
        'b,f', 'd,f', 'b,d',  // Triangle 3
        'a,g','g,c', 'b,g', 'h,b', 'e,d'   // Extra edges
    ];

    const triangles = [
        'a,b,c', 'c,d,e', 'b,d,f',
        'a,c,g','b,c,g','a,b,g'
    ];

    const tetrahedron = 'a,b,c,g';

    // Create all simplex elements
    const vertexElements = {};
    const edgeElements = {};
    const triangleElements = {};
    let tetrahedronElement;

    

    

    // Create triangles
    triangles.forEach(triangle => {
        const [v1, v2, v3] = triangle.split(',');
        triangleElements[triangle] = main.polygon([
            vertices[v1][0], vertices[v1][1],
            vertices[v2][0], vertices[v2][1],
            vertices[v3][0], vertices[v3][1]
        ]).attr({ fill: '#44335e', opacity: 0.3, stroke: 'none' });
    });

    


    // Create edges
    edges.forEach(edge => {
        const [v1, v2] = edge.split(',');
        edgeElements[edge] = main.line(
            vertices[v1][0], vertices[v1][1],
            vertices[v2][0], vertices[v2][1]
        ).attr({ ...anim.config().path1, opacity: 0.3 });
    });

    // Create tetrahedron (will visualize as a triangle since we're in 2D)
    const [v1, v2, v3, v4] = tetrahedron.split(',');
    tetrahedronElement = main.polygon([
        vertices[v1][0], vertices[v1][1],
        vertices[v2][0], vertices[v2][1],
        vertices[v3][0], vertices[v3][1]
    ]).attr({ fill: '#faeaff', opacity: 0.3, stroke: 'none' });

    // Create vertices
    Object.keys(vertices).forEach(key => {
        vertexElements[key] = main.use(vertexSymbol)
            .center(vertices[key][0], vertices[key][1])
            .attr({ opacity: 0.3 });
    });

    

    // Position the complex
    main.transform({ translate: [600, 400] });

    // Boundary operator examples
    const examples = {
        delta1: [
            { input: 'a,b', boundary: 'a + b' },
            { 
                input: 'a,b + b,c', 
                boundary: 'a + c',
                sequentialInput: ['a,b', 'b,c']
            },
            { 
                input: 'a,c + c,d + d,e', 
                boundary: 'a + e',
                sequentialInput: ['a,c', 'c,d', 'd,e']
            }// Keep one single edge example
        ],
        delta2: [
            { input: 'a,c,g', boundary: 'a,g + a,c + g,c' },
            { input: 'c,d,e', boundary: 'c,d + c,e + d,e' },
            { input: 'b,d,f', boundary: 'b,d + b,f + d,f' }
        ],
        delta3: [
            { 
                input: 'a,b,c,g', 
                boundary: 'a,b,c + a,b,g + a,c,g + b,c,g',
                sequentialBoundary: [
                    'a,b,g',
                    'a,c,g',
                    'b,c,g',
                    'a,b,c'
                ]
            }
        ]
    };

    // UI Elements
    let boundaryText;
    let currentOperator = null;

    // Function to highlight simplices
    function highlightSimplices(names, opacity = 1, color = null) {
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
            if (name === tetrahedron) {
                tetrahedronElement.animate(300).attr({ opacity });
            }
        });
    }

    // Function to reset all highlights
    function resetHighlights() {
        Object.values(vertexElements).forEach(v => {
            v.animate(300).attr({ opacity: 0.3 });
        });
        Object.values(edgeElements).forEach(e => {
            e.animate(300).attr({ opacity: 0.3 });
        });
        Object.values(triangleElements).forEach(t => {
            t.animate(300).attr({ opacity: 0.3 });
        });
        if (tetrahedronElement) {
            tetrahedronElement.animate(300).attr({ opacity: 0.3 });
        }
    }

    // Function to animate boundary calculation
     async function animateBoundaryExample(example) {
        // Reset all highlights first
        resetHighlights();
        
        boundaryText.update({ 
            newText: `\\partial(${example.input}) = \\ `.replace(/,/g, ''),
            fade: true,
            latex: true
        });
        
        if (example.sequentialBoundary) {
            // Tetrahedron case (unchanged)
            for (const component of example.sequentialBoundary) {
                resetHighlights()
                if(currentOperator!='delta3') break;
                boundaryText.appendText({
                    text:(component + (component !== example.sequentialBoundary[example.sequentialBoundary.length-1] ? ' + ' : '').replace(/,/g, '')),
                    fade: true,
                    latex: true
                });
                highlightSimplices(component, 1);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        } 
        else if (example.sequentialInput) {
            // Edge chain case
            // Show input components sequentially
            for (const component of example.sequentialInput) {
                highlightSimplices(component, 1);
            }
            
            // Show boundary
            await new Promise(resolve => setTimeout(resolve, 3000));
            for (const component of example.sequentialInput) {
                highlightSimplices(component, 0.5); // Fade but keep visible
            }
            boundaryText.appendText({
                text: example.boundary.replace(/,/g, ''),
                fade: true,
                latex: true
            });
            highlightSimplices(example.boundary, 1);
        }
        else {
            // Single edge/triangle case
            highlightSimplices(example.input, 1);
            await new Promise(resolve => setTimeout(resolve, 1500));
            boundaryText.appendText({ 
                text: example.boundary.replace(/,/g, ''),
                fade: true,
                latex: true
            });
            highlightSimplices(example.input, 0.2);
            highlightSimplices(example.boundary, 1);
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000));
    }


    // Function to run all examples for an operator
    async function runOperatorExamples(operator) {
        currentOperator = operator;
        const opExamples = examples[operator];
        
        for (let i = 0; i < opExamples.length; i++) {
            
            if (currentOperator!=operator) break;
            await animateBoundaryExample(opExamples[i]);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Repeat the demonstration
        if (operator === currentOperator) {
            setTimeout(() => runOperatorExamples(operator), 300);
        }
    }

    // Create UI
    boundaryText = anim.sideBar.createText()
        .update({ newText: 'Select a boundary operator to begin', fade: true });

    const buttons = anim.sideBar.createButtonGroup({
        buttons: [
            { name: '∂₁ (edges)', value: 'delta1' },
            { name: '∂₂ (triangles)', value: 'delta2' },
            { name: '∂₃ (tetrahedron)', value: 'delta3' }
        ],
        listener: (value) => {
            currentOperator = null; // Stop any current animation
            resetHighlights();
            runOperatorExamples(value);
        },
        selectedValue: null
    });

    anim.initSteps([
        ()=>{},
        () => {
            anim.frame.animate(500).transform({scale:1.2,origin:[-150,-300]})
        }
    ]);
});

export default anim;
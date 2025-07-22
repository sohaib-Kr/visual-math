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
        e: [350, 250],     
        f: [50, -250],     
        g: [-100, 50],     
        h: [-550, -250]
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

    // Create vertices
    Object.keys(vertices).forEach(key => {
        vertexElements[key] = main.use(vertexSymbol)
            .center(vertices[key][0], vertices[key][1])
            .attr({ opacity: 0.3 });
        main.text(key).move(vertices[key][0]+20,vertices[key][1]+20).font({size:'35px',fill:'#ffa64d'})
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

    // Create tetrahedron (will visualize as a triangle since we're in 2D)
    const [v1, v2, v3, v4] = tetrahedron.split(',');
    tetrahedronElement = main.polygon([
        vertices[v1][0], vertices[v1][1],
        vertices[v2][0], vertices[v2][1],
        vertices[v3][0], vertices[v3][1]
    ]).attr({ fill: '#faeaff', opacity: 0.3, stroke: 'none' });

    // Position the complex
    main.transform({ translate: [600, 400] });

    // Boundary operator examples
    const examples = {
        delta1: [
            { input: 'a,b', boundary: 'a + b' },
            { input: 'b,c', boundary: 'b + c' },
            { input: 'a,c', boundary: 'a + c' }
        ],
        delta2: [
            { input: 'a,c,g', boundary: 'a,g + a,c + g,c' },
            { input: 'c,d,e', boundary: 'c,d + c,e + d,e' },
            { input: 'b,d,f', boundary: 'b,d + b,f + d,f' }
        ],
        delta3: [
            { input: 'a,b,c,g', boundary: 'a,b,c + a,b,g + a,c,g + b,c,g' }
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
                if (color) vertexElements[name].animate(300).attr({ fill: color });
            }
            if (edgeElements[name]) {
                edgeElements[name].animate(300).attr({ opacity });
                if (color) edgeElements[name].animate(300).attr({ stroke: color });
            }
            if (triangleElements[name]) {
                triangleElements[name].animate(300).attr({ opacity });
                if (color) triangleElements[name].animate(300).attr({ fill: color });
            }
            if (name === tetrahedron) {
                tetrahedronElement.animate(300).attr({ opacity });
                if (color) tetrahedronElement.animate(300).attr({ fill: color });
            }
        });
    }

    // Function to reset all highlights
    function resetHighlights() {
        Object.values(vertexElements).forEach(v => {
            v.attr({fill: anim.config().indicationPoint.fill });
            v.animate(300).attr({ opacity: 0.3 });
        });
        Object.values(edgeElements).forEach(e => {
            e.attr({stroke: anim.config().path1.stroke });
            e.animate(300).attr({ opacity: 0.3 });
        });
        Object.values(triangleElements).forEach(t => {
            t.attr({fill: '#44335e' });
            t.animate(300).attr({ opacity: 0.3 });
        });
        if (tetrahedronElement) {
            tetrahedronElement.animate(300).attr({ opacity: 0.3, fill: '#faeaff' });
        }
    }

    // Function to animate boundary calculation
    async function animateBoundaryExample(example) {
        // Reset all highlights first
        
        resetHighlights();
        // Show input with full opacity
        boundaryText.update({ 
            newText: `\\partial(${example.input}) = `,
            fade: true,
            latex: true
        });
        highlightSimplices(example.input, 1, '#ff99a7');
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show boundary while keeping input visible
        boundaryText.update({ 
            newText: `\\partial(${example.input}) = ${example.boundary}`,
            fade: true,
            latex: true
        });
        highlightSimplices(example.boundary, 1, '#00c9a7');
        
        // await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Fade out input simplex while keeping boundary visible
        highlightSimplices(example.input, 0.2, '#ff99a7');
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Final reset
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
            setTimeout(() => runOperatorExamples(operator), 1000);
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

    anim.initSteps([() => {}]);
});

export default anim;
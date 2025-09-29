import { SVG } from "@svgdotjs/svg.js";
export function plotMethodAnim(){
    // ========================
// GLOBAL VARIABLES
// ========================
let draw;
let curveTengents

// ========================
// UTILITY FUNCTIONS
// ========================

/**
 * Creates SVG path data for a mathematical function
 * @param {Object} options - Configuration object
 * @param {Function} options.mathFunc - The mathematical function to plot
 * @param {number} options.start - Start x value
 * @param {number} options.step - Step size for x values
 * @param {number} options.end - End x value
 * @param {number} options.scale - Scaling factor
 * @param {string} options.fill - Fill option ('none' or other)
 * @returns {string} SVG path data
 */
let cutPoint=false
let lastValidY=0
function drawTangentLine({ mathFunc, t, start, end, scale = 1 }) {
    const y_t = mathFunc(t);
    
    const h = 0.0001;
    const derivative = (mathFunc(t + h) - mathFunc(t - h)) / (2 * h);
    console.log(mathFunc)
    
    const tangentFunc = (x) => derivative * (x - t) + y_t;
    
    const y_start = tangentFunc(start);
    const y_end = tangentFunc(end);
    
    const pathData = `M ${start * scale} ${-y_start * scale} L ${end * scale} ${-y_end * scale}`;
    
    return pathData;
}

function drawTangentFieldAlongCurve({ mathFunc, xStart, xEnd, xStep, segmentLength = 20, scale = 1 }) {
    let pathData = '';
    const h = 0.0001;
    
    // Iterate through x values at regular intervals
    for (let x = xStart; x <= xEnd; x += xStep) {
        // Calculate derivative at this point
        const derivative = (mathFunc(x + h) - mathFunc(x - h)) / (2 * h);
        
        // The slope of the tangent line means:
        // For every dx change in x, there's derivative*dx change in y
        // Euclidean distance: sqrt(dx^2 + (derivative*dx)^2) = sqrt(dx^2 * (1 + derivative^2))
        // We want this distance to be segmentLength/(2*scale) for half the segment
        
        const halfLength = segmentLength / (2 * scale);
        
        // Solve for dx: halfLength = |dx| * sqrt(1 + derivative^2)
        const dx = halfLength / Math.sqrt(1 + derivative * derivative);
        
        const segmentStart = x - dx;
        const segmentEnd = x + dx;
        
        // Use the existing drawTangentLine function for each segment
        let seg = drawTangentLine({
            mathFunc: mathFunc,
            t: x,
            start: segmentStart,
            end: segmentEnd,
            scale: scale
        }) + ' ';
        pathData += seg;
    }
    return pathData;
}

function drawMathFunction({ mathFunc, start, step, end, scale, fill = 'none' }) {
    let pathData = `M ${start * scale} ${-mathFunc(start) * scale}`;
    lastValidY=mathFunc(start)
    
    for (let x = start; x <= end; x += step) {
        const y = mathFunc(x);
        if (!isFinite(y)) {
            cutPoint=true
            continue;
        }
        if(cutPoint){
            pathData += ` M ${x * scale} ${-y * scale}`
            cutPoint=false
        }else{
            pathData += ` L ${x * scale} ${-y * scale}`
            lastValidY=y
        }
    }
    
    if (fill !== 'none') {
        pathData += ` L ${end * scale} 0 L ${start * scale} 0 Z`;
    }
    return pathData;
}

/**
 * Sets up drag functionality for an SVG element
 * @param {Object} options - Configuration object
 * @param {HTMLElement} options.element - The element to make draggable
 * @param {Function} options.onMove - Callback for mouse move events
 * @param {Function} options.onRelease - Callback for mouse release events
 * @returns {Object} Object with disable method
 */
function setupDrag({ element, onMove, onRelease = () => {} }) {
    let dragging = false;
    let startX, startY;

    const mouseDownHandler = (e) => {
        dragging = true;
        startX = e.clientX;
        startY = e.clientY;
        e.preventDefault();
    };

    const mouseMoveHandler = (e) => {
        if (!dragging) return;
        onMove(e);
    };

    const mouseUpHandler = (e) => {
        if (!dragging) return;
        
        dragging = false;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        onRelease(deltaX, deltaY);
    };

    element.addEventListener('mousedown', mouseDownHandler);
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);

    return {
        disable: () => {
            element.removeEventListener('mousedown', mouseDownHandler);
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        }
    };
}

// ========================
// VECTOR FIELD FUNCTIONS
// ========================

/**
 * Creates a vector field as a single SVG path
 * @param {number} height - Half-height of the field
 * @param {number} width - Half-width of the field
 * @param {number} step - Step size between field points
 * @param {number} scale - Scaling factor for positioning
 * @returns {SVGPathElement} SVG path element containing all field segments
 */
function createSegmentField(height, width, step, scale) {
    let pathData = '';
    
    // Generate horizontal line segments at each grid point
    for (let x = -width; x <= width; x += step) {
        for (let y = -height; y <= height; y += step) {
            const scaledX = x * scale * step;
            const scaledY = y * scale * step;
            
            pathData += `M ${scaledX - 10} ${-scaledY} L ${scaledX + 10} ${-scaledY} `;
        }
    }
    
    return draw.path(pathData).stroke({ 
        color: '#333', 
        width: 1 
    }).fill('none');
}

/**
 * Applies mathematical transformation to rotate field segments
 * @param {Function} mathFunc - Function that determines rotation angle
 * @param {SVGPathElement} field - The field path to transform
 * @param {number} height - Half-height of the field
 * @param {number} width - Half-width of the field
 * @param {number} step - Step size between field points
 * @param {number} scale - Scaling factor for positioning
 * @returns {string} New path data with transformed segments
 */
function applyTransform(mathFunc, field, height, width, step, scale) {
    let pathData = '';
    
    // Recalculate each segment with rotation based on mathFunc
    for (let x = -width; x <= width; x += step) {
        for (let y = -height; y <= height; y += step) {
            const scaledX = x * scale * step;
            const scaledY = y * scale * step;
            
            // Calculate rotation angle from the math function
            const angle = -Math.atan(mathFunc(x, y));
            
            // Calculate rotated segment endpoints
            const segmentLength = 10;
            const startX = scaledX + Math.cos(angle + Math.PI) * segmentLength;
            const startY = -scaledY + Math.sin(angle + Math.PI) * segmentLength;
            const endX = scaledX + Math.cos(angle) * segmentLength;
            const endY = -scaledY + Math.sin(angle) * segmentLength;
            
            pathData += `M ${startX} ${startY} L ${endX} ${endY} `;
        }
    }
    return pathData;
}

// ========================
// CONFIGURATION DATA
// ========================

/**
 * Default mathematical function for field transformation
 */
function mathFunc(x, y) {
    return y;
}

/**
 * Higher-order functions that take a constant c and return mathematical functions for curve plotting
 */
const mathFuncs = [
    (c) => (x) => c * Math.exp(x),
    (c) => (x) => x* (Math.log(x*x)+c),
    (c) => (x) => 1/(x+c),
    (c) => (x) => 1+c*Math.exp(-x)
];

/**
 * Corresponding field transformation functions (derivatives of the above functions)
 */
const fieldFuncs = [
    (x, y) => y,
    (x, y) => y /x+2,
    (x, y) => -y*y,
    (x, y) => 1-y
];

// ========================
// MAIN VISUALIZATION SETUP
// ========================

/**
 * Main function to set up the mathematical visualization
 */
    // Initialize SVG canvas
    draw = SVG().addTo('#plotMethodContainer').size('400', '400');
    
    // Create main container group
    const group = draw.group();
    
    // ========================
    // COORDINATE AXES SETUP
    // ========================
    
    // X-axis
    group.line(-200, 0, 200, 0)
        .stroke({ width: 2, color: '#000' });
    
    // Y-axis  
    group.line(0, -200, 0, 200)
        .stroke({ width: 2, color: '#000' });
    
    // ========================
    // VECTOR FIELD SETUP
    // ========================
    
    const field = createSegmentField(10, 10, 0.8, 40);
    field.transform({ translate: [200, 200] });
    
    // Apply initial transformation with animation delay
    const initialPath = applyTransform(mathFunc, field, 10, 10, 0.8, 40);
    setTimeout(() => {
        field.animate(800).plot(initialPath);
    }, 2000);
    
    // ========================
    // FUNCTION CURVE SETUP
    // ========================
    
    // Initial curve with c = 1
    const initialCurvePath = drawMathFunction({
        mathFunc: mathFuncs[0](1), // exp(x) with c = 1
        start: -10,
        step: 0.05,
        end: 10,
        scale: 40
    });
    
    const curve = group.path(initialCurvePath)
        .stroke({ color: 'red', width: 2 })
        .fill('none');
    
    // ========================
    // INTERACTIVE CONTROL POINT
    // ========================
    
    const controlPoint = group.circle(10)
        .fill('blue')
        .center(0, -40);
    let currentC=1
    // Keep track of current mode for drag interaction
    let currentMode = 0;
    
    // Setup dragging for real-time curve modification
    setupDrag({
        element: controlPoint.node,
        onMove: (event) => {
            let c
            let cMapper={
                0:(y)=>-y/40,
                1:(y)=>-y/40,
                2:(y)=>(40/y+1),
                3:(y)=>y/40-1
            }
            if(currentMode==0 || currentMode==1){
                const y = event.clientY - draw.node.getBoundingClientRect().top - 200;
                let circleCenterX = currentMode==0 ? 0 : 40;
                controlPoint.center(circleCenterX, y);
                c = cMapper[currentMode](y);
            }else if (currentMode==2){
                const y = event.clientY - draw.node.getBoundingClientRect().top - 200;
                controlPoint.center(-40, y);
                 c = cMapper[currentMode](-y);

            }else if (currentMode==3){
                const y = event.clientY - draw.node.getBoundingClientRect().top - 200;
                controlPoint.center(0, y);
                 c = cMapper[currentMode](-y);
            }
            const newCurvePath = drawMathFunction({
                mathFunc: mathFuncs[currentMode](c), // Use current mode with new c value
                start: -10,
                step: 0.05,
                end: 10,
                scale: 40
            });
            curveTengents.plot(drawTangentFieldAlongCurve({
                mathFunc: mathFuncs[currentMode](c),
                xStart: -10,
                xEnd: 10,
                xStep: 1,
                segmentLength: 20,
                scale: 40
            }))
            
            curve.plot(newCurvePath);
        }
    });
    
    // ========================
    // MODE SWITCHING SETUP
    // ========================
    
    // Setup event listeners for function mode switching
    Array.from(document.getElementsByClassName('mode')).forEach((element) => {
        element.addEventListener('click', () => {
            const mode = document.querySelector('input[name="mode"]:checked').value;
            const modeIndex = parseInt(mode);
            currentMode = modeIndex; // Update current mode
            let currentC
            switch(modeIndex){
                case 0:
                    controlPoint.animate(400).center(0, -40);
                    currentC=1;
                    break;
                case 1:
                    controlPoint.animate(400).center(40, -40);
                    currentC=1;
                    break;
                case 2:
                    controlPoint.animate(400).center(0, 0);
                    currentC=0;
                    break;
                case 3:
                    controlPoint.animate(400).center(0, 0);
                    currentC=-1;
                    break;
            }
            
            
            // Animate curve change with current c value
            const newCurvePath = drawMathFunction({
                mathFunc: mathFuncs[modeIndex](currentC),
                start: -10,
                step: 0.05,
                end: 10,
                scale: 40
            });
            curve.animate(300).attr({opacity:0}).after(()=>curve.plot(newCurvePath).animate(300).attr({opacity:1}))
            
            // Update vector field
            const newFieldPath = applyTransform(fieldFuncs[modeIndex], field, 10, 10, 0.8, 40);
            field.animate(400).plot(newFieldPath);
        });
    });
    curveTengents=group.path(drawTangentFieldAlongCurve({
        mathFunc: mathFuncs[currentMode](currentC),
        xStart: -10,
        xEnd: 10,
        xStep: 1,
        segmentLength: 20,
        scale: 40
    })).stroke({color:'blue',width:3}).fill('none');
    // Apply final transformation to center everything
    group.transform({ translate: [200, 200] });
}
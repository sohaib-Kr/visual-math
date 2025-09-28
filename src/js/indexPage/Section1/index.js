import { SVG } from '@svgdotjs/svg.js';
import gsap from 'gsap';

// ========================
// GLOBAL VARIABLES
// ========================
let draw;

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
function drawMathFunction({ mathFunc, start, step, end, scale, fill = 'none' }) {
    let pathData = `M ${start * scale} ${-mathFunc(start) * scale}`;
    lastValidY=mathFunc(start)
    
    for (let x = start; x <= end; x += step) {
        const y = mathFunc(x);
        if (!isFinite(y) || Math.abs(y-lastValidY)>10) {
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

let circleCenterX=0
let circleCenterXList=[0,40]
/**
 * Higher-order functions that take a constant c and return mathematical functions for curve plotting
 */
const mathFuncs = [
    (c) => (x) => c * Math.exp(x),
    (c) => (x) => x* (Math.log(x*x)+c),
    (c) => (x) => 1/(x+c),
    (c) => (x) => Math.pow(x+c,2)/15
];

/**
 * Corresponding field transformation functions (derivatives of the above functions)
 */
const fieldFuncs = [
    (x, y) => y,
    (x, y) => y /x+2,
    (x, y) => -y*y,
    (x, y) => 2*(Math.sqrt(Math.abs(y)))
];

// ========================
// MAIN VISUALIZATION SETUP
// ========================

/**
 * Main function to set up the mathematical visualization
 */
export function section1() {
    // Initialize SVG canvas
    draw = SVG().addTo('#matrixTransformContainer').size('400', '400');
    
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
        step: 0.2,
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
    
    // Keep track of current mode for drag interaction
    let currentMode = 0;
    
    // Setup dragging for real-time curve modification
    setupDrag({
        element: controlPoint.node,
        onMove: (event) => {
            let c
            
            if(currentMode==0 || currentMode==1){
                const y = event.clientY - draw.node.getBoundingClientRect().top - 200;
                controlPoint.center(circleCenterX, y);
                 c = -y / 40;
            }else if (currentMode==2){
                const x = event.clientX - draw.node.getBoundingClientRect().left - 200;
                controlPoint.center(x, 0);
                 c = -x / 40;
            }else if (currentMode==3){
                const x = event.clientX - draw.node.getBoundingClientRect().left - 200;
                controlPoint.center(x, 0);
                 c = -Math.sqrt(Math.abs(x / 40));
            }
            const newCurvePath = drawMathFunction({
                mathFunc: mathFuncs[currentMode](c), // Use current mode with new c value
                start: -10,
                step: 0.05,
                end: 10,
                scale: 40
            });
            
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
            
            console.log('Selected function:', mathFuncs[modeIndex]);
            
            // Get current c value from control point position
            const currentC = -controlPoint.cy() / 40;
            
            // Animate curve change with current c value
            const newCurvePath = drawMathFunction({
                mathFunc: mathFuncs[modeIndex](currentC),
                start: -10,
                step: 0.05,
                end: 10,
                scale: 40
            });
            circleCenterX=circleCenterXList[modeIndex]
            curve.plot(newCurvePath);
            
            // Update vector field
            const newFieldPath = applyTransform(fieldFuncs[modeIndex], field, 10, 10, 0.8, 40);
            field.plot(newFieldPath);
        });
    });
    
    // Apply final transformation to center everything
    group.transform({ translate: [200, 200] });
}
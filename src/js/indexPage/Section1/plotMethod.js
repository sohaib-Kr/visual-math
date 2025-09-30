import { SVG } from "@svgdotjs/svg.js";
import katex from 'katex';

export function plotMethodAnim() {
    // State management
    const state = {
        draw: null,
        elements: {
            curveTangents: null,
            controlPoint: null,
            curve: null,
            field: null,
            controlPointTragectory: null,
        },
        currentMode: 0,
        currentC: 1,
        cutPoint: false,
        lastValidY: 0
    };

    // Configuration
    const config = {
        canvas: { width: 400, height: 400, center: 200 },
        scale: 40,
        tangent: { h: 0.0001, segmentLength: 15 },
        field: { height: 10, width: 10, step: 0.8, segmentLength: 15 },
        curve: { start: -10, end: 10, step: 0.05, xStep: 0.8 },
        animation: { duration: 300, fieldDuration: 400 }
    };

    // Mathematical functions
    const mathFuncs = [
        c => x => c * Math.exp(x),
        c => x => x * (Math.log(x * x) + c),
        c => x => Math.exp(x) * (Math.sin(x) + c),
        c => x => 1 + c * Math.exp(-x)
    ];

    const fieldFuncs = [
        (x, y) => y,
        (x, y) => y / x + 2,
        (x, y) => Math.exp(x) * (Math.sin(x) + 1),
        (x, y) => 1 - y
    ];

    const initialPositions = [
        { x: 0, y: -40, c: 1 },
        { x: 40, y: -40, c: 1 },
        { x: 0, y: 0, c: 0 },
        { x: 0, y: 0, c: -1 }
    ];

    const cMappers = [
        y => -y / config.scale,
        y => -y / config.scale,
        y => -y / config.scale,
        y => -(y / config.scale + 1)
    ];

    // LaTeX formulas for each mode
    const latexFormulas = [
        {
            solution: "y(x) =ce^{x} ",
            differential: "\\frac{dy}{dx} - y = 0 "
        },
        {
            solution: "y(x) = x(\\ln(x^2) + c) ",
            differential: "\\frac{dy}{dx} - \\frac{y}{x} = 2 "
        },
        {
            solution: "y(x) = e^{x}(\\sin(x) + c) ",
            differential: "\\frac{dy}{dx} = e^{x}(\\sin(x) + 1) "
        },
        {
            solution: "y(x) = 1 + ce^{-x} ",
            differential: "\\frac{dy}{dx} + y= 1 "
        }
    ];

    // Utility functions
    function drawMathFunction(mathFunc, start, step, end, scale) {
        let pathData = `M ${start * scale} ${-mathFunc(start) * scale}`;
        state.lastValidY = mathFunc(start);

        for (let x = start; x <= end; x += step) {
            const y = mathFunc(x);
            if (!isFinite(y)) {
                state.cutPoint = true;
                continue;
            }
            pathData += state.cutPoint 
                ? ` M ${x * scale} ${-y * scale}` 
                : ` L ${x * scale} ${-y * scale}`;
            state.cutPoint = false;
            state.lastValidY = y;
        }
        return pathData;
    }

    function drawTangentLine(mathFunc, t, start, end, scale) {
        const y_t = mathFunc(t);
        const derivative = (mathFunc(t + config.tangent.h) - mathFunc(t - config.tangent.h)) / (2 * config.tangent.h);
        const tangentFunc = x => derivative * (x - t) + y_t;
        const y_start = tangentFunc(start);
        const y_end = tangentFunc(end);

        return isFinite(y_start) && isFinite(y_end)
            ? `M ${start * scale} ${-y_start * scale} L ${end * scale} ${-y_end * scale}`
            : '';
    }

    function drawTangentField(mathFunc, xStart, xEnd, xStep, segmentLength, scale) {
        let pathData = '';
        const halfLength = segmentLength / (scale);

        for (let x = xStart; x <= xEnd; x += xStep) {
            const derivative = (mathFunc(x + config.tangent.h) - mathFunc(x - config.tangent.h)) / (2 * config.tangent.h);
            const dx = halfLength / Math.sqrt(1 + derivative * derivative);
            pathData += drawTangentLine(mathFunc, x, x - dx, x + dx, scale) + ' ';
        }
        return pathData;
    }

    function createSegmentField(height, width, step, scale) {
        let pathData = '';
        for (let x = -width; x <= width; x += step) {
            for (let y = -height; y <= height; y += step) {
                const scaledX = x * scale ;
                const scaledY = y * scale;
                pathData += `M ${scaledX - config.field.segmentLength} ${-scaledY} L ${scaledX + config.field.segmentLength} ${-scaledY} `;
            }
        }
        return state.draw.path(pathData).stroke({ color: '#333', width: 1 }).fill('none');
    }

    function applyTransform(mathFunc, height, width, step, scale) {
        let pathData = '';
        for (let x = -width; x <= width; x += step) {
            for (let y = -height; y <= height; y += step) {
                const scaledX = x * scale ;
                const scaledY = y * scale ;
                const angle = -Math.atan(mathFunc(x, y));
                const startX = scaledX + Math.cos(angle + Math.PI) * config.field.segmentLength;
                const startY = -scaledY + Math.sin(angle + Math.PI) * config.field.segmentLength;
                const endX = scaledX + Math.cos(angle) * config.field.segmentLength;
                const endY = -scaledY + Math.sin(angle) * config.field.segmentLength;
                pathData += `M ${startX} ${startY} L ${endX} ${endY} `;
            }
        }
        return pathData;
    }

    function updateLatexText() {
        const textContainer = document.getElementById('plotMethodAnimationText');
        const formulas = latexFormulas[state.currentMode];
        const solutionSpan = document.createElement('span');
        solutionSpan.innerHTML = `${formulas.solution}`;
        const differentialSpan = document.createElement('span');
        differentialSpan.innerHTML = `${formulas.differential}`;
        const cSpan=document.createElement('span');
        cSpan.innerText='c='
        katex.render(solutionSpan.innerHTML, solutionSpan);
        katex.render(differentialSpan.innerHTML, differentialSpan);
        katex.render(cSpan.innerHTML, cSpan);
        console.log(state.currentC)
        textContainer.innerHTML = `
            <div style="margin-top: 20px; font-size: 18px;">
                <div>
                    <strong>Differential Equation:</strong> ${differentialSpan.innerHTML}
                </div>
                <div style="margin-bottom: 10px;">
                    <strong>Solution:</strong> <span style="width: 250px; display: inline-block;">${solutionSpan.innerHTML}</span> ${cSpan.innerHTML} <span id="controlValue">${state.currentC.toFixed(2)}</span>
                </div>
            </div>
        `;
        
    }

    function updateVisualization(c) {
        const curvePath = drawMathFunction(mathFuncs[state.currentMode](c), config.curve.start, config.curve.step, config.curve.end, config.scale);
        const tangentsPath = drawTangentField(mathFuncs[state.currentMode](c), config.curve.start, config.curve.end, config.curve.xStep, config.tangent.segmentLength, config.scale);
        
        state.elements.curve.animate(config.animation.duration).attr({ opacity: 0 })
            .after(() => state.elements.curve.plot(curvePath).animate(config.animation.duration).attr({ opacity: 1 }));
        state.elements.curveTangents.animate(config.animation.duration).attr({ opacity: 0 })
            .after(() => {
                state.elements.curveTangents.plot(tangentsPath).animate(config.animation.duration).attr({ opacity: 1 })
            });
        
        updateLatexText();
    }

    function setupDrag(element, onMove) {
        let dragging = false;
        const mouseDown = e => { dragging = true; e.preventDefault(); };
        const mouseMove = e => dragging && onMove(e);
        const mouseUp = () => dragging = false;

        element.addEventListener('mousedown', mouseDown);
        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);
    }

    // Initialization
    state.draw = SVG().addTo('#plotMethodContainer').size(config.canvas.width, config.canvas.height);
    const group = state.draw.group();

    // Axes
    group.line(-config.canvas.center, 0, config.canvas.center, 0).stroke({ width: 2, color: '#000' });
    group.line(0, -config.canvas.center, 0, config.canvas.center).stroke({ width: 2, color: '#000' });

    // Field
    state.elements.field = createSegmentField(config.field.height, config.field.width, config.field.step, config.scale);
    state.elements.field.transform({ translate: [config.canvas.center, config.canvas.center] });
    setTimeout(() => {
        const initialPath = applyTransform(fieldFuncs[0], config.field.height, config.field.width, config.field.step, config.scale);
        state.elements.field.animate(800).plot(initialPath);
    }, 2000);

    // Curve and tangents
    const initialCurvePath = drawMathFunction(mathFuncs[0](1), config.curve.start, config.curve.step, config.curve.end, config.scale);
    state.elements.curve = group.path(initialCurvePath).stroke({ color: 'red', width: 2 }).fill('none');
    
    const initialTangentsPath = drawTangentField(mathFuncs[0](1), config.curve.start, config.curve.end, config.curve.xStep, config.tangent.segmentLength, config.scale);
    state.elements.curveTangents = group.path(initialTangentsPath).stroke({ color: 'blue', width: 3 }).fill('none');

    // Control point
    state.elements.controlPoint = group.circle(10).fill('blue').center(0, -config.scale);

    setupDrag(state.elements.controlPoint.node, event => {
        const y = event.clientY - state.draw.node.getBoundingClientRect().top - config.canvas.center;
        const pos = initialPositions[state.currentMode];
        const circleCenterX = state.currentMode === 1 ? config.scale : 0;
        
        state.elements.controlPoint.center(circleCenterX, y);
        const c = cMappers[state.currentMode](y);
        state.currentC=c;
        const curvePath = drawMathFunction(mathFuncs[state.currentMode](c), config.curve.start, config.curve.step, config.curve.end, config.scale);
        const tangentsPath = drawTangentField(mathFuncs[state.currentMode](c), config.curve.start, config.curve.end, config.curve.xStep, config.tangent.segmentLength, config.scale);
        document.getElementById('controlValue').textContent=`${state.currentC.toFixed(2)}`;
        state.elements.curve.plot(curvePath);
        state.elements.curveTangents.plot(tangentsPath);
    });

    // Mode switching
    Array.from(document.getElementsByClassName('mode')).forEach(element => {
        element.addEventListener('click', () => {
            const mode = parseInt(document.querySelector('input[name="mode"]:checked').value);
            state.currentMode = mode;
            const pos = initialPositions[mode];
            
            state.elements.controlPoint.animate(config.animation.fieldDuration).center(pos.x, pos.y);
            updateVisualization(pos.c);
            const newFieldPath = applyTransform(fieldFuncs[mode], config.field.height, config.field.width, config.field.step, config.scale);
            state.elements.field.animate(config.animation.fieldDuration).plot(newFieldPath);
            updateLatexText();
        });
    });

    group.transform({ translate: [config.canvas.center, config.canvas.center] });
    
    // Initialize the text display
    updateLatexText();
}
import { vMathAnimation } from "@/lib/library";
import {Vector} from './utils';
const anim = new vMathAnimation('innerProduct');
anim.setInit(function() {
    const draw = anim.frame;
    const main = draw.group();
    const scale=70
    let vectors = [];
    let showOperationButton = null;
    let innerProductDisplay = null;
    let innerProductBar = null; 
    const barYPosition = 200; 

    const arrowSymbol = draw.symbol()
        .path('M -20 -2 L 0 -2 V -10 L 20 0 V 0 L 0 10 V 2 L -20 2 Z')
        .attr({ fill: '#4285F4', 'fill-opacity': 0.7 });

    const projectionSymbol = draw.symbol()
        .path('M -20 -2 L 0 -2 V -10 L 20 0 V 0 L 0 10 V 2 L -20 2 Z')
        .attr({ fill: '#4CAF50', 'fill-opacity': 0.7 });

    function initInnerProductBar() {
        innerProductBar = draw.rect(0, 20)
            .move(400, barYPosition)  // Centered at x=400
            .attr({ fill: '#FF5722', opacity: 0.7 });
        
        // Add x-axis line for reference
        draw.line(-400, barYPosition + 30, 400, barYPosition + 30)
            .stroke({ width: 1, color: '#999', dasharray: '2,2' });
    }

    function updateInnerProductBar(value) {
        const width = Math.abs(value) * scale;
        let x = value > 0 ? 0 : -width;
        x+=400
        
        innerProductBar.width(width).x(x);
    }

    function scaleVector(vector1, vector2) {
        
        const L2 = Math.sqrt(
            vector2.coords.x * vector2.coords.x + 
            vector2.coords.y * vector2.coords.y
        );
        // Calculate new coordinates
        const newX = vector1.coords.x * L2;
        const newY = vector1.coords.y * L2;
        vector1.updateCoords({x:newX,y:newY})
    }

    function disableVectorDragging() {
        vectors.forEach(vector => {
            vector.elem.off('mousedown');
            vector.line.off('mousedown');
        });
    }

    function enableVectorDragging() {
        vectors.forEach(vector => {
            vector.elem.on('mousedown', () => vector.isDragging = true);
            vector.line.on('mousedown', () => vector.isDragging = true);
        });
    }

    function createVector(x, y,symbol=arrowSymbol) {
        const vector = new Vector({
            coords: { x, y },
            symbol,
            parent: main,
        });
        vector.isDragging=false

        vector.elem.on('mousedown', () => vector.isDragging = true);
        vector.line.on('mousedown', () => vector.isDragging = true);

        return vector;
    }

    function calculateProjection() {
        if (vectors.length < 2) return null;
        
        const v1 = vectors[0].coords;
        const v2 = vectors[1].coords;
        
        const dotProduct = v1.x * v2.x + v1.y * v2.y;
        const v2MagnitudeSquared = v2.x * v2.x + v2.y * v2.y;
        const scaleFactor = dotProduct / v2MagnitudeSquared;
        
        return {
            x: scaleFactor * v2.x,
            y: scaleFactor * v2.y,
            dotProduct: dotProduct,
            v2Magnitude: Math.sqrt(v2MagnitudeSquared)
        };
    }

    function animateProjection() {
        disableVectorDragging();
        const proj = calculateProjection();
        if (!proj) return;
        
        // Create the projected vector and add it to vectors array
        const projectedVector = createVector(proj.x, proj.y,projectionSymbol);
        projectedVector.isProjection = true;
        vectors.push(projectedVector);
        
        // Style the projected vector differently
        projectedVector.elem.attr({ fill: '#4CAF50', 'fill-opacity': 0.7 });
        projectedVector.line.stroke({ color: '#4CAF50', dasharray: '5,3' });
        
        // Animate the first vector to show projection
        vectors[0].animateTo(proj)
        
        // Update the bar to show the scaled projection
        updateInnerProductBar(proj.dotProduct / proj.v2Magnitude);
        
        return projectedVector;
    }

    function resetVectors() {
        if (vectors.length < 2) return;
        vectors[0].reset()
        vectors[2].elem.remove()
        enableVectorDragging();
    }

    function translateProjection() {
        const projVector = vectors[2];
        const proj = calculateProjection();
        const barX = (proj.dotProduct > 0 ? 1 : -1) * Math.abs(proj.dotProduct/proj.v2Magnitude) * scale + 400;
        projVector.updateCoords({x:barX,y:barYPosition + 30})
        .transform({
            translate: [barX-600, barYPosition + 30-400],
            rotate: 0  // Make it parallel to x-axis
        });
        
    projVector.line.animate(500)
        .plot(0, 0, proj.dotProduct/proj.v2Magnitude * scale, 0)
        .transform({
            translate: [barX-600, barYPosition + 30-400],
            rotate: 0,
            origin: [0, 0]
        })
    }
    function updateVectorPosition(vector, mouseX, mouseY) {
        const x = (mouseX - 600) / scale;
        const y = ( 400 -mouseY) / scale;
        vector.updateCoords({x,y},false)
        
        updateInnerProduct();
    }

    function updateInnerProduct() {
        if (vectors.length < 2) return;
        
        const v1 = vectors[0];
        const v2 = vectors[1];
        const dotProduct = v1.coords.x * v2.coords.x + 
                         v1.coords.y * v2.coords.y;
        
        // Update the text display
        if (!innerProductDisplay) {
            innerProductDisplay = draw.text(dotProduct.toFixed(2))
                .font({ size: 24, anchor: 'middle' })
                .center(0, -150)
                .attr({ fill: '#3A86FF' });
        } else {
            innerProductDisplay.text(dotProduct.toFixed(2));
        }
        
        // Update the bar visualization
        // updateInnerProductBar(dotProduct);
    }
        

    main.transform({ translate: [600, 400] });

    [[1,0],[0,1]].forEach(([x,y])=>{
        vectors.push(createVector(x, y));
    });
    draw.on('mousemove', (e) => {
        const mousePos = draw.point(e.clientX, e.clientY);
        vectors.forEach(vector => {
            if (vector.isDragging) {
                updateVectorPosition(vector, mousePos.x, mousePos.y);
            }
        });
    });
    
    draw.on('mouseup', () => {
        vectors.forEach(vector => {
            vector.isDragging = false;
        });
    });
    updateInnerProduct();
    anim.initSteps([
        () => {
            // Initialize the inner product bar
            initInnerProductBar();
            showOperationButton = anim.sideBar.createButton({
                name: 'Show Operation',
                listener: async () => {
                    if (showOperationButton.node.textContent === 'Show Operation') {
                        animateProjection();
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        scaleVector(vectors[2],vectors[1]);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        // translateProjection()
                        // await new Promise(resolve => setTimeout(resolve, 1000));
                        showOperationButton.node.textContent = 'Reset';
                    } else {
                        resetVectors();
                        showOperationButton.node.textContent = 'Show Operation';
                    }
                }
            });
        }
    ]);
});
export default anim;
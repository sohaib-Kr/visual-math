import { vMathAnimation } from "@/lib/library";
const anim = new vMathAnimation('innerProduct');
anim.setInit(function() {
    const draw = anim.frame;
    const main = draw.group();
    const scale = 70;
    let dragCircle = null;
    let isDragMode = false;
    let vectors = [];
    let toggleButton = null;
    let showOperationButton = null;
    let dragModeController = null;
    let innerProductDisplay = null;
    let projectionArrow = null;
    let innerProductBar = null; // New bar for inner product visualization
    const barYPosition = 200; // Y position for the inner product bar

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
        // Calculate lengths (magnitudes) of both vectors
        const L1 = Math.sqrt(
            vector1.originalCoords.x * vector1.originalCoords.x + 
            vector1.originalCoords.y * vector1.originalCoords.y
        );
        
        const L2 = Math.sqrt(
            vector2.originalCoords.x * vector2.originalCoords.x + 
            vector2.originalCoords.y * vector2.originalCoords.y
        );
        
        // Calculate new length
        const newLength = L1 * L2;
        
        
        // Calculate new coordinates
        const newX = vector1.originalCoords.x * L2;
        const newY = vector1.originalCoords.y * L2;
        const angle = Math.atan2(newY, newX) * 180 / Math.PI;
        
        // Animate the vector to new length
        vector1.elem.animate(500)
            .transform({
                translate: [newX * scale, newY * scale],
                rotate: angle,
                origin: [0, 0]
            });
            
        vector1.line.animate(500)
            .plot(0, 0, newX * scale, newY * scale);
        
        // Update vector's stored positions
        vector1.originalCoords = { x: newX, y: newY };
        vector1.headPosition = { x: newX * scale, y: newY * scale };
        
        // Return the new length
        return newLength;
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

    function createVector(x, y) {
        const angle = Math.atan2(y, x) * 180 / Math.PI;
        const vector = {
            elem: main.use(arrowSymbol)
                .transform({
                    translate: [x * scale, y * scale],
                    rotate: angle,
                    origin: [0, 0]
                }),
            line: main.line(0, 0, x * scale, y * scale)
                .stroke({ width: 2, color: '#4285F4' })
                .back(),
            originalCoords: { x, y },
            isDragging: false,
            headPosition: { x: x * scale, y: y * scale },
            savedPosition: { x, y }
        };

        vector.elem.on('mousedown', () => vector.isDragging = true);
        vector.line.on('mousedown', () => vector.isDragging = true);

        return vector;
    }

    function calculateProjection() {
        if (vectors.length < 2) return null;
        
        const v1 = vectors[0].originalCoords;
        const v2 = vectors[1].originalCoords;
        
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
        
        const angle = Math.atan2(proj.y, proj.x) * 180 / Math.PI;
        
        // Create the projected vector and add it to vectors array
        const projectedVector = createVector(proj.x, proj.y);
        projectedVector.isProjection = true;
        vectors.push(projectedVector);
        
        // Remove old projection visualization if it exists
        if (projectionArrow) {
            projectionArrow.elem.remove();
            projectionArrow.line.remove();
            projectionArrow = null;
        }
        
        // Style the projected vector differently
        projectedVector.elem.attr({ fill: '#4CAF50', 'fill-opacity': 0.7 });
        projectedVector.line.stroke({ color: '#4CAF50', dasharray: '5,3' });
        
        // Animate the first vector to show projection
        vectors[0].elem.animate(500)
            .transform({
                translate: [proj.x * scale, proj.y * scale],
                rotate: angle
            });
            
        vectors[0].line.animate(500)
            .plot(0, 0, proj.x * scale, proj.y * scale);
        
        // Update the bar to show the scaled projection
        updateInnerProductBar(proj.dotProduct / proj.v2Magnitude);
        
        return projectedVector;
    }

    function resetVectors() {
        if (vectors.length < 2) return;
        
        const v = vectors[0];
        const angle = Math.atan2(v.savedPosition.y, v.savedPosition.x) * 180 / Math.PI;
        
        // Animate the first vector back to its original position
        v.elem.animate(500)
            .transform({
                translate: [v.savedPosition.x * scale, v.savedPosition.y * scale],
                rotate: angle
            });
            
        v.line.animate(500)
            .plot(0, 0, v.savedPosition.x * scale, v.savedPosition.y * scale);
        
        // If we have a projected vector (vectors[2])
        if (vectors.length > 2 && vectors[2].isProjection) {
            const projVector = vectors[2];

                    projVector.elem.remove();
                    projVector.line.remove();
                    vectors.pop();
        }
        enableVectorDragging();
        
    }

    function translateProjection() {
        const projVector = vectors[2];
        const proj = calculateProjection();
        const barX = (proj.dotProduct > 0 ? 1 : -1) * Math.abs(proj.dotProduct/proj.v2Magnitude) * scale + 400;
        projVector.elem.animate(500)
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
        const y = (mouseY - 400) / scale;
        const angle = Math.atan2(y, x) * 180 / Math.PI;
        
        vector.originalCoords = { x, y };
        vector.savedPosition = { x, y };
        vector.headPosition = { x: mouseX - 600, y: mouseY - 400 };
        
        vector.elem.transform({
            translate: [x * scale, y * scale],
            rotate: angle
        });
        vector.line.plot(0, 0, x * scale, y * scale);
        
        updateInnerProduct();
    }

    function updateInnerProduct() {
        if (vectors.length < 2) return;
        
        const v1 = vectors[0];
        const v2 = vectors[1];
        const dotProduct = v1.originalCoords.x * v2.originalCoords.x + 
                         v1.originalCoords.y * v2.originalCoords.y;
        
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
        updateInnerProductBar(dotProduct);
    }

    function dragModeOn() {
        if (isDragMode) return;
        isDragMode = true;
        
        dragCircle = draw.circle(20)
            .attr({ 
                fill: '#4285F4',
                opacity: 0,
                'fill-opacity': 0.7
            })
            .center(0, 0);
            
        dragCircle.animate(300).attr({ opacity: 1 });
        
        function moveCircle(e) {
            const mousePos = draw.point(e.clientX, e.clientY);
            dragCircle.center(mousePos.x, mousePos.y);
        }
        
        function handleClick(e) {
            const mousePos = draw.point(e.clientX, e.clientY);
            const x = (mousePos.x - 600) / scale;
            const y = (mousePos.y - 400) / scale;
            
            vectors.push(createVector(x, y));
            
            if (vectors.length === 2) {
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
                
                if (toggleButton) toggleButton.node.disabled = true;
                if (dragModeController) {
                    dragModeController.off();
                    dragModeController = null;
                }
                
                showOperationButton.node.disabled = false;
                updateInnerProduct();
            }
        }
        
        draw.on('mousemove', moveCircle);
        draw.on('click', handleClick);
        
        return {
            off: () => {
                isDragMode = false;
                draw.off('mousemove', moveCircle);
                draw.off('click', handleClick);
                dragCircle.animate(300).attr({ opacity: 0 }).after(() => {
                    dragCircle.remove();
                    dragCircle = null;
                });
            }
        };
    }

    main.transform({ translate: [600, 400] });

    anim.initSteps([
        () => {
            // Initialize the inner product bar
            initInnerProductBar();
            
            toggleButton = anim.sideBar.createButton({
                name: 'Place Vectors',
                listener: () => {
                    if (dragModeController) {
                        dragModeController.off();
                        dragModeController = null;
                    } else {
                        dragModeController = dragModeOn();
                    }
                }
            });
            
            showOperationButton = anim.sideBar.createButton({
                name: 'Show Operation',
                listener: async () => {
                    if (showOperationButton.node.textContent === 'Show Operation') {
                        animateProjection();
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        scaleVector(vectors[1],vectors[2]);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        translateProjection()
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        showOperationButton.node.textContent = 'Reset';
                    } else {
                        resetVectors();
                        showOperationButton.node.textContent = 'Show Operation';
                    }
                }
            });
            showOperationButton.node.disabled = true;
        }
    ]);
});
export default anim;
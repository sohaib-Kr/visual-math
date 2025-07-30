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

    const arrowSymbol = draw.symbol()
        .path('M -20 -2 L 0 -2 V -10 L 20 0 V 0 L 0 10 V 2 L -20 2 Z')
        .attr({ fill: '#4285F4', 'fill-opacity': 0.7 });

    const projectionSymbol = draw.symbol()
        .path('M -20 -2 L 0 -2 V -10 L 20 0 V 0 L 0 10 V 2 L -20 2 Z')
        .attr({ fill: '#4CAF50', 'fill-opacity': 0.7 });

        function disableVectorDragging() {
            vectors.forEach(vector => {
                vector.elem.off('mousedown');  // Remove the mousedown event (drag start)
                vector.line.off('mousedown');  // Optional: Prevent dragging by line (if applicable)
            });
        }
        
        function enableVectorDragging() {
            vectors.forEach(vector => {
                vector.elem.on('mousedown', (e) => {
                    vector.isDragging = true;
                });
                vector.line.on('mousedown', (e) => {
                    vector.isDragging = true;
                });
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
            // Store original position for reset
            savedPosition: { x, y }
        };

        vector.elem.on('mousedown', (e) => {
            vector.isDragging = true;
        });

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
            y: scaleFactor * v2.y
        };
    }

    function animateProjection() {
        disableVectorDragging()
        const proj = calculateProjection();
        if (!proj) return;
        
        const angle = Math.atan2(proj.y, proj.x) * 180 / Math.PI;
        
        // Create projection arrow if it doesn't exist
        if (!projectionArrow) {
            projectionArrow = {
                elem: main.use(projectionSymbol)
                    .transform({
                        translate: [proj.x * scale, proj.y * scale],
                        rotate: angle,
                        origin: [0, 0]
                    })
                    .opacity(0),
                line: main.line(0, 0, proj.x * scale, proj.y * scale)
                    .stroke({ width: 2, color: '#4CAF50', dasharray: '5,3' })
                    .back()
                    .opacity(0)
            };
        }
        
        // Animate the projection arrow
        projectionArrow.elem.animate(500)
            .transform({
                translate: [proj.x * scale, proj.y * scale],
                rotate: angle
            })
            .opacity(1);
            
        projectionArrow.line.animate(500)
            .plot(0, 0, proj.x * scale, proj.y * scale)
            .opacity(1);
        
        // Animate the first vector to show projection
        vectors[0].elem.animate(500)
            .transform({
                translate: [proj.x * scale, proj.y * scale],
                rotate: angle
            });
            
        vectors[0].line.animate(500)
            .plot(0, 0, proj.x * scale, proj.y * scale);
        
        // Update the vector's current position (without changing originalCoords)
        vectors[0].headPosition = { 
            x: proj.x * scale, 
            y: proj.y * scale 
        };
    }

    function resetVectors() {
        if (vectors.length < 2) return;
        
        // Reset first vector to its saved position
        const v = vectors[0];
        const angle = Math.atan2(v.savedPosition.y, v.savedPosition.x) * 180 / Math.PI;
        
        v.elem.animate(500)
            .transform({
                translate: [v.savedPosition.x * scale, v.savedPosition.y * scale],
                rotate: angle
            });
            
        v.line.animate(500)
            .plot(0, 0, v.savedPosition.x * scale, v.savedPosition.y * scale).after(() => {
                enableVectorDragging()
            })
        
        // Update head position
        v.headPosition = { 
            x: v.savedPosition.x * scale, 
            y: v.savedPosition.y * scale 
        };
        
        // Hide projection arrow
        if (projectionArrow) {
            projectionArrow.elem.animate(300).opacity(0);
            projectionArrow.line.animate(300).opacity(0);
        }
    }

    function updateVectorPosition(vector, mouseX, mouseY) {
        const x = (mouseX - 600) / scale;
        const y = (mouseY - 400) / scale;
        const angle = Math.atan2(y, x) * 180 / Math.PI;
        
        // Update both current position and saved position
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
        
        if (!innerProductDisplay) {
            innerProductDisplay = draw.text(dotProduct.toFixed(2))
                .font({ size: 24, anchor: 'middle' })
                .center(0, -150)
                .attr({ fill: '#3A86FF' });
        } else {
            innerProductDisplay.text(dotProduct.toFixed(2));
        }
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
                listener: () => {
                    if (showOperationButton.node.textContent === 'Show Operation') {
                        animateProjection();
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
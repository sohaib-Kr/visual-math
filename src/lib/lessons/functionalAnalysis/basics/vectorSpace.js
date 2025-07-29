import { vMathAnimation } from "@/lib/library";
const anim = new vMathAnimation('vectorSpace');
anim.setInit(function(){
    const draw = anim.frame;
    const arrowSymbol = draw.symbol()
        .path('M -20 -2 L 0 -2 V -10 L 20 0 V 0 L 0 10 V 2 L -20 2 Z')
        .attr({...anim.config().indicationPoint});
    const main = draw.group();
    const scale = 70;
    
    let dragCircle = null;
    let isDragMode = false;
    let selectedArrows = [];
    let scalarInputs = [];
    let toggleButton = null;
    let resultantArrow = null;

    function animateArrow(arrow, newCoords) {
        const angle = Math.atan2(newCoords.y, newCoords.x) * 180 / Math.PI;
        arrow.elem.animate(500)
            .transform({
                translate: [newCoords.x * scale, newCoords.y * scale],
                rotate: angle,
                origin: [0, 0]
            });
        
        if (arrow.line) {
            arrow.line.animate(500)
                .plot(0, 0, newCoords.x * scale, newCoords.y * scale);
        }
    }

    function updateResultantVector() {
        if (selectedArrows.length < 2) return;
        
        // Get scaled vectors
        const vec1 = {
            x: selectedArrows[0].originalCoords.x * (parseFloat(selectedArrows[0].lastValidValue) || 0),
            y: selectedArrows[0].originalCoords.y * (parseFloat(selectedArrows[0].lastValidValue) || 0)
        };
        const vec2 = {
            x: selectedArrows[1].originalCoords.x * (parseFloat(selectedArrows[1].lastValidValue) || 0),
            y: selectedArrows[1].originalCoords.y * (parseFloat(selectedArrows[1].lastValidValue) || 0)
        };
        
        // Calculate sum
        const sum = {
            x: vec1.x + vec2.x,
            y: vec1.y + vec2.y
        };
        
        // Create or update resultant arrow
        if (!resultantArrow) {
            resultantArrow = {
                elem: main.use(arrowSymbol)
                    .attr({fill: '#4CAF50'}) // Green color for resultant
                    .transform({
                        translate: [sum.x * scale, sum.y * scale],
                        rotate: Math.atan2(sum.y, sum.x) * 180 / Math.PI,
                        origin: [0, 0]
                    }),
                line: main.line(0, 0, sum.x * scale, sum.y * scale)
                    .stroke({ width: 5, color: '#4CAF50', dasharray: '5,3' })
                    .back(),
                originalCoords: sum
            };
        } else {
            animateArrow(resultantArrow, sum);
        }
    }

    function createScalarInput(arrow, index) {
        const input = anim.sideBar.createTextInput({
            name: `Scalar ${index + 1}`,
            listener: (event) => {
                const value = event.target.value;
                if (/^[-+]?\d*\.?\d*$/.test(value)) {
                    const num = parseFloat(value);
                    if (!isNaN(num)) {
                        arrow.lastValidValue = value;
                        const newCoords = {
                            x: arrow.originalCoords.x * num,
                            y: arrow.originalCoords.y * num
                        };
                        animateArrow(arrow, newCoords);
                        updateResultantVector(); // Update sum when scalar changes
                    }
                } else {
                    event.target.value = arrow.lastValidValue || '';
                }
            }
        });
        arrow.input = input;
        scalarInputs.push(input);
        return input;
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
            const x = mousePos.x;
            const y = mousePos.y;
            dragCircle.center(x, y);
            
            const inExclusionZone = Math.abs(x - 600) < 35 && Math.abs(y - 400) < 35;
            dragCircle.attr({ fill: inExclusionZone ? '#FF3D00' : '#4285F4' });
        }
        
        function handleClick(e) {
            const mousePos = draw.point(e.clientX, e.clientY);
            const inExclusionZone = Math.abs(mousePos.x - 600) < 35 && Math.abs(mousePos.y - 400) < 35;
            if (inExclusionZone) return;
            
            const x = (mousePos.x - 600) / scale;
            const y = (mousePos.y - 400) / scale;
            
            const angle = Math.atan2(y, x) * 180 / Math.PI;
            
            const arrow = {
                elem: main.use(arrowSymbol)
                    .transform({
                        translate: [x * scale, y * scale],
                        rotate: angle,
                        origin: [0, 0]
                    }),
                line: main.line(0, 0, x * scale, y * scale)
                    .stroke({ width: 5, color: '#d97154' })
                    .back(),
                originalCoords: { x, y },
                lastValidValue: '1.0'
            };
            
            selectedArrows.push(arrow);
            createScalarInput(arrow, selectedArrows.length - 1);
            
            if (selectedArrows.length === 2) {
                // Create resultant vector
                updateResultantVector();
                
                // Remove toggle button
                if (toggleButton) {
                    toggleButton.kill();
                    toggleButton = null;
                }
                
                // Exit drag mode
                if (dragModeController) {
                    dragModeController.off();
                    dragModeController = null;
                }
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

    let dragModeController = null;

    anim.initSteps([
        () => {
            toggleButton = anim.sideBar.createButton({
                name: 'Toggle Drag Mode',
                listener: () => {
                    if (dragModeController) {
                        dragModeController.off();
                        dragModeController = null;
                    } else {
                        dragModeController = dragModeOn();
                    }
                }
            });
        }
    ]);
});
export default anim;

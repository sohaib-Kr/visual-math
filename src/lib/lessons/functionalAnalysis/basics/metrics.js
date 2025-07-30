import { vMathAnimation } from "@/lib/library";
const anim = new vMathAnimation('metrics');
anim.setInit(function() {
    const draw = anim.frame;
    const main = draw.group();
    const scale = 70;
    let dragCircle = null;
    let isDragMode = false;
    let placedPoints = [];
    let toggleButton = null;
    let dragModeController = null;
    let euclideanBar = null;
    let metricBar = null; // Second bar that changes with norm selection
    const fixedBarX = 0;
    const barYEuclidean = 400;
    const barYMetric = 430;

    // Norm system from "norms" animation
    let currentNorm = 'manhattan';
    let weightX = 1.0, weightY = 1.0, pValue = 1.0;
    let lastValidX = '1.0', lastValidY = '1.0', lastValidP = '1.0';
    let weightXInput, weightYInput, pValueInput;

    function initDistanceBars() {
        euclideanBar = draw.rect(0, 20)
            .move(fixedBarX, barYEuclidean)
            .attr({ fill: '#3A86FF', opacity: 0.7 });
        
        metricBar = draw.rect(0, 20)
            .move(fixedBarX, barYMetric)
            .attr({ fill: '#FF7B3D', opacity: 0.7 });
    }

    function calculateNormDistance(dx, dy) {
        switch(currentNorm) {
            case 'euclidean':
                return Math.sqrt(dx*dx + dy*dy);
            case 'manhattan':
                return Math.abs(dx) + Math.abs(dy);
            case 'maximum':
                return Math.max(Math.abs(dx), Math.abs(dy));
            case 'weighted':
                return Math.sqrt((weightX*dx)**2 + (weightY*dy)**2);
            case 'lp':
                return (Math.abs(dx)**pValue + Math.abs(dy)**pValue)**(1/pValue);
            default:
                return 0;
        }
    }

    function updateDistanceBars() {
        if (placedPoints.length < 2) return;
        
        const p1 = placedPoints[0];
        const p2 = placedPoints[1];
        const dx = p2.elem.x() - p1.elem.x();
        const dy = p2.elem.y() - p1.elem.y();
        
        euclideanBar.width(Math.sqrt(dx*dx + dy*dy));
        metricBar.width(calculateNormDistance(dx, dy));
    }

    function createFloatInput(name, initialValue, onChange, isP = false) {
        const input = anim.sideBar.createTextInput({
            name: name,
            listener: (event) => {
                const value = event.target.value;
                if (/^[+]?\d*\.?\d*$/.test(value) && value !== '') {
                    const num = parseFloat(value);
                    if (!isNaN(num) && num > 0) {
                        if (name === "Weight X") lastValidX = value;
                        else if (name === "Weight Y") lastValidY = value;
                        else if (isP) lastValidP = value;
                        onChange(num);
                        updateDistanceBars();
                    } else {
                        event.target.value = isP ? lastValidP : 
                                          (name === "Weight X" ? lastValidX : lastValidY);
                    }
                } else {
                    event.target.value = isP ? lastValidP : 
                                      (name === "Weight X" ? lastValidX : lastValidY);
                }
            }
        });
        input.node.value = initialValue;
        input.node.style.display = 'none';
        return input;
    }

    function switchNorm(normType) {
        currentNorm = normType;
        
        // Show/hide inputs based on active norm
        if (weightXInput && weightYInput && pValueInput) {
            weightXInput.node.style.display = normType === 'weighted' ? 'block' : 'none';
            weightYInput.node.style.display = normType === 'weighted' ? 'block' : 'none';
            pValueInput.node.style.display = normType === 'lp' ? 'block' : 'none';
        }
        
        updateDistanceBars();
    }

    function createPoint(x, y) {
        const point = draw.circle(10)
            .center(x, y)
            .attr({ 
                fill: '#4285F4',
                'fill-opacity': 0.7,
                cursor: 'move'
            });
        
        let isDragging = false;
        point.on('mousedown', () => {
            isDragging = true;
        });
        
        draw.on('mousemove', (e) => {
            if (!isDragging) return;
            const mousePos = draw.point(e.clientX, e.clientY);
            point.center(mousePos.x, mousePos.y);
            updateDistanceBars(); // Updated to update both bars
        });
        
        draw.on('mouseup', () => {
            isDragging = false;
        });
        
        return {
            elem: point,
            x: (x - 600) / scale,
            y: (y - 400) / scale
        };
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
            placedPoints.push(createPoint(mousePos.x, mousePos.y));
            
            if (placedPoints.length === 2) {
                initDistanceBars(); // Initialize both bars
                updateDistanceBars(); // Update them immediately
                if (toggleButton) {
                    toggleButton.node.disabled = true;
                }
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

    anim.initSteps([
        () => {
            // Add norm selection button group (from "norms" animation)
            anim.sideBar.createButtonGroup({
                buttons: [
                    { name: 'Euclidean', value: 'euclidean' },
                    { name: 'Manhattan', value: 'manhattan' },
                    { name: 'Maximum', value: 'maximum' },
                    { name: 'Weighted', value: 'weighted' },
                    { name: 'Lp Norm', value: 'lp' }
                ],
                listener: switchNorm
            });

            // Create inputs (hidden by default)
            weightXInput = createFloatInput("Weight X", "1.0", (value) => { weightX = value; });
            weightYInput = createFloatInput("Weight Y", "1.0", (value) => { weightY = value; });
            pValueInput = createFloatInput("p-value", "1.0", (value) => { pValue = value; }, true);

            toggleButton = anim.sideBar.createButton({
                name: 'Place Points',
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
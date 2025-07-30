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
    let metricBar = null;
    const fixedBarX = 0;
    const barYEuclidean = 400;
    const barYMetric = 430;

    // Norm system
    let currentNorm = 'manhattan';
    let weightX = 1.0, weightY = 1.0, pValue = 1.0;
    let lastValidX = '1.0', lastValidY = '1.0', lastValidP = '1.0';
    let weightXInput, weightYInput, pValueInput;

    // Metric circles
    let metricCircleGroup = null;
    const circleOpacity = 0.15;
    const circleColors = ['#FFB3B3', '#FFB3D1', '#F0A6FF', '#C0AAFF', '#A9B5FF'];

    function initDistanceBars() {
        euclideanBar = draw.rect(0, 20)
            .move(fixedBarX, barYEuclidean)
            .attr({ fill: '#3A86FF'});
        
        metricBar = draw.rect(0, 20)
            .move(fixedBarX, barYMetric)
            .attr({ fill: '#FF7B3D'});
    }

    function drawMetricCircles() {
        if (metricCircleGroup) metricCircleGroup.remove();
        metricCircleGroup = draw.group().back();

        for (let r = 2; r <= 10; r+=2) {
            const radius = r * scale;
            const color = circleColors[r/2-1];
            
            let shape;
            switch(currentNorm) {
                case 'euclidean':
                    shape = metricCircleGroup.circle(radius * 2).center(0, 0);
                    break;
                case 'manhattan':
                    shape = metricCircleGroup.polygon([
                        [radius, 0], [0, radius], [-radius, 0], [0, -radius]
                    ]);
                    break;
                case 'maximum':
                    shape = metricCircleGroup.polygon([
                        [radius, radius], [-radius, radius],
                        [-radius, -radius], [radius, -radius]
                    ]);
                    break;
                case 'weighted':
                    const a = radius / weightX;
                    const b = radius / weightY;
                    shape = metricCircleGroup.path(
                        `M ${a} 0 A ${a} ${b} 0 0 1 0 ${b}` +
                        `A ${a} ${b} 0 0 1 ${-a} 0` +
                        `A ${a} ${b} 0 0 1 0 ${-b}` +
                        `A ${a} ${b} 0 0 1 ${a} 0`
                    );
                    break;
                case 'lp':
                    const points = [];
                    for (let i = 0; i <= 100; i++) {
                        const theta = (i / 100) * Math.PI * 2;
                        const {x, y} = LpCircleEqu(pValue, theta, radius);
                        points.push([x, y]);
                    }
                    shape = metricCircleGroup.polygon(points);
                    break;
            }
            
            shape.fill('none').opacity(0.3).stroke({ color, width: 2 });
            metricCircleGroup.addTo(main);
        }
    }

    function LpCircleEqu(p, t, r = 1) {
        const cosTheta = Math.cos(t);
        const sinTheta = Math.sin(t);
        const absCos = Math.abs(cosTheta);
        const absSin = Math.abs(sinTheta);
        const denominator = Math.pow(absCos ** p + absSin ** p, 1 / p);
        return {
            x: r * Math.sign(cosTheta) * (absCos / denominator),
            y: r * Math.sign(sinTheta) * (absSin / denominator)
        };
    }

    function calculateNormDistance(dx, dy) {
        switch(currentNorm) {
            case 'euclidean': return Math.sqrt(dx*dx + dy*dy);
            case 'manhattan': return Math.abs(dx) + Math.abs(dy);
            case 'maximum': return Math.max(Math.abs(dx), Math.abs(dy));
            case 'weighted': return Math.sqrt((weightX*dx)**2 + (weightY*dy)**2);
            case 'lp': return (Math.abs(dx)**pValue + Math.abs(dy)**pValue)**(1/pValue);
            default: return 0;
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

    function switchNorm(normType) {
        currentNorm = normType;
        
        if (weightXInput && weightYInput && pValueInput) {
            weightXInput.node.style.display = normType === 'weighted' ? 'block' : 'none';
            weightYInput.node.style.display = normType === 'weighted' ? 'block' : 'none';
            pValueInput.node.style.display = normType === 'lp' ? 'block' : 'none';
        }
        
        drawMetricCircles();
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
            updateDistanceBars();
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
                initDistanceBars();
                updateDistanceBars();
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
            drawMetricCircles();
            
            anim.sideBar.createButtonGroup({
                buttons: [
                    { name: 'Euclidean', value: 'euclidean' },
                    // { name: 'Manhattan', value: 'manhattan' },
                    // { name: 'Maximum', value: 'maximum' },
                    // { name: 'Weighted', value: 'weighted' },
                    { name: 'Lp Norm', value: 'lp' }
                ],
                listener: switchNorm
            });

            // Create inputs exactly as in norms animation
            weightXInput = anim.sideBar.createTextInput({
                name: "Weight X",
                listener: (event) => {
                    const value = event.target.value;
                    if (/^[+]?\d*\.?\d*$/.test(value) && value !== '') {
                        const num = parseFloat(value);
                        if (!isNaN(num) && num > 0) {
                            lastValidX = value;
                            weightX = num;
                            if (currentNorm === 'weighted') {
                                drawMetricCircles();
                                updateDistanceBars();
                            }
                        } else {
                            event.target.value = lastValidX;
                        }
                    } else {
                        event.target.value = lastValidX;
                    }
                }
            });
            weightXInput.node.value = "1.0";
            weightXInput.node.style.display = 'none';

            weightYInput = anim.sideBar.createTextInput({
                name: "Weight Y",
                listener: (event) => {
                    const value = event.target.value;
                    if (/^[+]?\d*\.?\d*$/.test(value) && value !== '') {
                        const num = parseFloat(value);
                        if (!isNaN(num) && num > 0) {
                            lastValidY = value;
                            weightY = num;
                            if (currentNorm === 'weighted') {
                                drawMetricCircles();
                                updateDistanceBars();
                            }
                        } else {
                            event.target.value = lastValidY;
                        }
                    } else {
                        event.target.value = lastValidY;
                    }
                }
            });
            weightYInput.node.value = "1.0";
            weightYInput.node.style.display = 'none';

            pValueInput = anim.sideBar.createTextInput({
                name: "p-value",
                listener: (event) => {
                    const value = event.target.value;
                    if (/^[+]?\d*\.?\d*$/.test(value) && value !== '') {
                        const num = parseFloat(value);
                        if (!isNaN(num) && num > 0) {
                            lastValidP = value;
                            pValue = num;
                            if (currentNorm === 'lp') {
                                drawMetricCircles();
                                updateDistanceBars();
                            }
                        } else {
                            event.target.value = lastValidP;
                        }
                    } else {
                        event.target.value = lastValidP;
                    }
                }
            });
            pValueInput.node.value = "1.0";
            pValueInput.node.style.display = 'none';

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

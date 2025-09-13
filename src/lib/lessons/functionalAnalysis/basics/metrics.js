import { vMathAnimation } from "@/lib/library";
import {Point, createFloatInput} from './utils';  // Import the Vector class
const anim = new vMathAnimation('metrics');
anim.setInit(function() {
    const draw = anim.frame;
    const main = draw.group();
    const scale = 70;
    let placedVectors = [];  // Changed from placedPoints to placedVectors
    let euclideanBar = null;
    let metricBar = null;
    const fixedBarX = 0;
    const barYEuclidean = 400;
    const barYMetric = 430;

    // Vector symbol definition (like in previous scripts)
    const arrowSymbol = draw.symbol()
        .path('M -20 -2 L 0 -2 V -10 L 20 0 V 0 L 0 10 V 2 L -20 2 Z')
        .attr({ fill: '#4285F4', 'fill-opacity': 0.7 });

    // Norm system
    let currentNorm = 'manhattan';
    let weightX = 1.0, weightY = 1.0, pValue = 1.0;
    let weightXInput, weightYInput, pValueInput;

    // Metric circles
    let metricCircleGroup = null;
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

    function initDistanceBars() {
        euclideanBar = draw.rect(0, 20)
            .move(fixedBarX, barYEuclidean)
            .attr({ fill: '#3A86FF'});
        
        metricBar = draw.rect(0, 20)
            .move(fixedBarX, barYMetric)
            .attr({ fill: '#FF7B3D'});
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

    function createVector(x, y) {
        const vector = new Point({
            coords: { x: (x - 600) / scale, y: (y - 400) / scale },
            symbol: arrowSymbol,
            parent: main,
            scale,
            lineConfig: { width: 3, color: '#4285F4' }
        });

        return vector;
    }

    function updateDistanceBars() {
        if (placedVectors.length < 2) return;
        
        const v1 = placedVectors[0];
        const v2 = placedVectors[1];
        const dx = v2.coords.x - v1.coords.x;
        const dy = v2.coords.y - v1.coords.y;
        
        euclideanBar.width(Math.sqrt(dx*dx + dy*dy) * scale);
        metricBar.width(calculateNormDistance(dx, dy) * scale);
    }



    // Initialize with vectors instead of points
    [[1,0], [0,1]].forEach(([x,y]) => {
        placedVectors.push(createVector(600 + x * scale, 400 + y * scale).allowDrag(draw,updateDistanceBars));
    });

    initDistanceBars();
    updateDistanceBars();
    main.transform({ translate: [600, 400] });
    anim.initSteps([
        () => {
            drawMetricCircles();
            
            anim.sideBar.createButtonGroup({
                buttons: [
                    // { name: 'Euclidean', value: 'euclidean' },
                    { name: 'Manhattan', value: 'manhattan' },
                    { name: 'Maximum', value: 'maximum' },
                    { name: 'Weighted', value: 'weighted' },
                    { name: 'Lp Norm', value: 'lp' }
                ],
                listener: switchNorm
            });

            // Create inputs exactly as in norms animation
            weightXInput =  createFloatInput({name:"Weight X", initialValue:"1.0", onChange:(value) => {
                weightX = value;
                if (currentNorm === 'weighted') {
                    drawMetricCircles();
                    updateDistanceBars();
                }
            },anim});
            weightXInput.node.style.display = 'none';

            weightYInput = pValueInput = createFloatInput({name:"Weight Y", initialValue:"1.0", onChange:(value) => {
                weightY = value;
                if (currentNorm === 'weighted') {
                    drawMetricCircles();
                    updateDistanceBars();
                }
            },anim});
            weightYInput.node.style.display = 'none';

            pValueInput = createFloatInput({name:"p-value", initialValue:"1.0", onChange:(value) => {
                pValue = value;
                if (currentNorm === 'lp') {
                    drawMetricCircles();
                    updateDistanceBars();
                }
            },anim});
            pValueInput.node.style.display = 'none';
        }
    ]);
});
export default anim;

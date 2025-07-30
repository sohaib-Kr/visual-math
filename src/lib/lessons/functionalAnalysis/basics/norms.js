import { vMathAnimation } from "@/lib/library";
const anim = new vMathAnimation('norms');
anim.setInit(function() {

    const draw = anim.frame;
    const main = draw.group();
    const scale = 20;
    const normColor = '#3A86FF';
    let currentNorm = 'euclidean';
    let unitCircle, diamond, square, ellipse, lpShape;
    let weightX = 1.0, weightY = 2.0, pValue = 2.0;
    let lastValidX = '1.0', lastValidY = '2.0', lastValidP = '2.0';
    let radiusSlider;
    let weightXInput, weightYInput, pValueInput;
    
    main.transform({ translate: [600, 400] });

    function switchNorm(drawFunction, normType) {
        currentNorm = normType;
        
        // Show/hide inputs based on active norm
        if (weightXInput && weightYInput && pValueInput) {
            weightXInput.node.style.display = normType === 'weighted' ? 'block' : 'none';
            weightYInput.node.style.display = normType === 'weighted' ? 'block' : 'none';
            pValueInput.node.style.display = normType === 'lp' ? 'block' : 'none';
        }
        
        main.animate(300).opacity(0).after(() => {
            drawFunction();
            main.animate(300).opacity(1);
        });
    }

    function changeRadius(value) {
        const r = value * scale;
        
        if (currentNorm === 'euclidean') {
            unitCircle.attr({ r: r });
        } 
        else if (currentNorm === 'manhattan') {
            diamond.plot([
                [r, 0], [0, r], 
                [-r, 0], [0, -r]
            ]);
        }
        else if (currentNorm === 'maximum') {
            square.plot([
                [r, r], [-r, r],
                [-r, -r], [r, -r]
            ]);
        }
        else if (currentNorm === 'weighted') {
            updateEllipse();
        }
        else if (currentNorm === 'lp') {
            drawLpNorm(r);
        }
    }

    function updateEllipse() {
        const r = radiusSlider.value * scale;
        const a = r / weightX;
        const b = r / weightY;
        
        const pathCommands = [
            `M ${a} 0`,
            `A ${a} ${b} 0 0 1 0 ${b}`,
            `A ${a} ${b} 0 0 1 ${-a} 0`,
            `A ${a} ${b} 0 0 1 0 ${-b}`,
            `A ${a} ${b} 0 0 1 ${a} 0`
        ].join(' ');
        
        ellipse.plot(pathCommands);
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
                        if (currentNorm === 'weighted') updateEllipse();
                        else if (currentNorm === 'lp') drawLpNorm(radiusSlider.value * scale);
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
        input.node.style.display = 'none'; // Hidden by default
        return input;
    }

    function drawEuclidean() {
        main.clear();
        const r = radiusSlider.value * scale;
        unitCircle = main.circle({ r: r });
        unitCircle.center(0, 0);
        unitCircle.fill('none').stroke({ color: normColor, width: 2 });
    }

    function drawManhattan() {
        main.clear();
        const r = radiusSlider.value * scale;
        diamond = main.polygon([
            [r, 0], [0, r], [-r, 0], [0, -r]
        ]);
        diamond.fill('none').stroke({ color: normColor, width: 2 });
    }

    function drawMaximum() {
        main.clear();
        const r = radiusSlider.value * scale;
        square = main.polygon([
            [r, r], [-r, r], 
            [-r, -r], [r, -r]
        ]);
        square.fill('none').stroke({ color: normColor, width: 2 });
    }

    function drawWeighted() {
        main.clear();
        ellipse = main.path();
        updateEllipse();
        ellipse.fill('none').stroke({ color: normColor, width: 2 });
    }

    function LpCircleEqu(p, t, r = 1) {
        const cosTheta = Math.cos(t);
        const sinTheta = Math.sin(t);
        const absCos = Math.abs(cosTheta);
        const absSin = Math.abs(sinTheta);
        const denominator = Math.pow(absCos ** p + absSin ** p, 1 / p);

        const x = r * Math.sign(cosTheta) * (absCos / denominator);
        const y = r * Math.sign(sinTheta) * (absSin / denominator);

        return {x, y};
    }

    function drawLpNorm(radius = radiusSlider.value * scale) {
        main.clear();
        const segments = 100;
        const points = [];
        
        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            const {x, y} = LpCircleEqu(pValue, theta, radius);
            points.push([x, y]);
        }
        
        lpShape = main.polygon(points);
        lpShape.fill('none').stroke({ color: normColor, width: 2 });
    }

    anim.sideBar.createButtonGroup({
        buttons: [
            { name: 'Euclidean', value: 'euclidean' },
            // { name: 'Manhattan', value: 'manhattan' },
            // { name: 'Maximum', value: 'maximum' },
            // { name: 'Weighted', value: 'weighted' },
            { name: 'Lp Norm', value: 'lp' }
        ],
        listener: function(value) {
            if (value === 'euclidean') switchNorm(drawEuclidean, 'euclidean');
            else if (value === 'manhattan') switchNorm(drawManhattan, 'manhattan');
            else if (value === 'maximum') switchNorm(drawMaximum, 'maximum');
            else if (value === 'weighted') switchNorm(drawWeighted, 'weighted');
            else if (value === 'lp') switchNorm(() => drawLpNorm(), 'lp');
        }
    });

    // Radius slider
    radiusSlider = anim.sideBar.createRangeInput({
        name: "Radius",
        listener: function(event) {
            changeRadius(parseFloat(event.target.value));
        }
    }).node.children[1];

    radiusSlider.value = 10;
    // Create inputs (hidden by default)
    weightXInput = createFloatInput("Weight X", "1.0", (value) => { weightX = value; });
    weightYInput = createFloatInput("Weight Y", "2.0", (value) => { weightY = value; });
    pValueInput = createFloatInput("p-value", "2.0", (value) => { pValue = value; }, true);

    anim.initSteps([
        () => {
            main.opacity(0);
            drawEuclidean();
            main.animate(500).opacity(1);
        }
    ]);
});
export default anim;

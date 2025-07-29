import { vMathAnimation } from "@/lib/library";
const anim = new vMathAnimation('norms');
anim.setInit(function() {
    const draw = anim.frame;
    const main = draw.group();
    const scale = 20
    const normColor = '#3A86FF';
    let currentNorm = 'euclidean';
    let unitCircle, diamond, square, ellipse;
    let weightX = 1.0, weightY = 2.0;
    let lastValidX = '1.0', lastValidY = '2.0';
    let radiusSlider;
    
    main.transform({ translate: [600, 400] });

    function switchNorm(drawFunction, normType) {
        currentNorm = normType;
        main.animate(300).opacity(0).after(() => {
            drawFunction();
            main.animate(300).opacity(1);
        });
    }

    function changeRadius(value) {
        const r = value; // Direct radius value now (no division)
        
        if (currentNorm === 'euclidean') {
            unitCircle.attr({ r: r * scale }); // r×scale ensures (r,0) is on circle
        } 
        else if (currentNorm === 'manhattan') {
            diamond.plot([
                [r * scale, 0], [0, r * scale], 
                [-r * scale, 0], [0, -r * scale]
            ]);
        }
        else if (currentNorm === 'maximum') {
            square.plot([
                [r * scale, r * scale], [-r * scale, r * scale],
                [-r * scale, -r * scale], [r * scale, -r * scale]
            ]);
        }
        else if (currentNorm === 'weighted') {
            updateEllipse();
        }
    }

    function updateEllipse() {
        const r = radiusSlider.value;
        const a = r * scale / weightX; // Major axis
        const b = r * scale / weightY; // Minor axis
        
        const pathCommands = [
            `M ${a} 0`,
            `A ${a} ${b} 0 0 1 0 ${b}`,
            `A ${a} ${b} 0 0 1 ${-a} 0`,
            `A ${a} ${b} 0 0 1 0 ${-b}`,
            `A ${a} ${b} 0 0 1 ${a} 0`
        ].join(' ');
        
        ellipse.plot(pathCommands);
    }

    function createWeightInput(name, initialValue, onChange) {
        const input = anim.sideBar.createTextInput({
            name: name,
            listener: (event) => {
                const value = event.target.value;
                if (/^[+]?\d*\.?\d*$/.test(value) && value !== '') {
                    const num = parseFloat(value);
                    if (!isNaN(num) && num >= 0.1) {
                        if (name === "Weight X") lastValidX = value;
                        else lastValidY = value;
                        onChange(num);
                        if (currentNorm === 'weighted') updateEllipse();
                    } else {
                        event.target.value = (name === "Weight X") ? lastValidX : lastValidY;
                    }
                } else {
                    event.target.value = (name === "Weight X") ? lastValidX : lastValidY;
                }
            }
        });
        input.value = initialValue;
        return input;
    }

    function drawEuclidean() {
        main.clear();
        const r = radiusSlider.value;
        unitCircle = main.circle({ r: r * scale }); // Use current slider value
        unitCircle.center(0, 0);
        unitCircle.fill('none').stroke({ color: normColor, width: 2 });
    }

    function drawManhattan() {
        main.clear();
        const r = radiusSlider.value;
        diamond = main.polygon([
            [r * scale, 0], [0, r * scale], [-r * scale, 0], [0, -r * scale]
        ]);
        diamond.fill('none').stroke({ color: normColor, width: 2 });
    }

    function drawMaximum() {
        main.clear();
        const r = radiusSlider.value;
        square = main.polygon([
            [r * scale, r * scale], [-r * scale, r * scale], 
            [-r * scale, -r * scale], [r * scale, -r * scale]
        ]);
        square.fill('none').stroke({ color: normColor, width: 2 });
    }

    function drawWeighted() {
        main.clear();
        ellipse = main.path();
        updateEllipse();
        ellipse.fill('none').stroke({ color: normColor, width: 2 });
    }

    anim.sideBar.createButtonGroup({
        buttons: [
            { name: 'Euclidean', value: 'euclidean' },
            { name: 'Weighted', value: 'weighted' }
        ],
        listener: function(value) {
            if (value === 'euclidean') switchNorm(drawEuclidean, 'euclidean');
            else if (value === 'weighted') switchNorm(drawWeighted, 'weighted');
        }
    });

    // Radius slider (1-20 range)
    radiusSlider = anim.sideBar.createRangeInput({
        name: "Radius",
        min: 1,
        max: 20,
        step: 0.1,
        value: 1,
        listener: function(event) {
            changeRadius(parseFloat(event.target.value));
        }
    }).node.children[1];

    // Weight inputs
    createWeightInput("Weight X", "1.0", (value) => { weightX = value; });
    createWeightInput("Weight Y", "2.0", (value) => { weightY = value; });

    anim.initSteps([
        () => {
            main.opacity(0);
            drawEuclidean();
            main.animate(500).opacity(1);
        }
    ]);
});
export default anim;
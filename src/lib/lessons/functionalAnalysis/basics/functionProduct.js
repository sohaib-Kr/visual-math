import { vMathAnimation } from "@/lib/library";

const anim = new vMathAnimation('functionProduct');
anim.setInit(function() {
    const draw = anim.frame;
    const main = draw.group();
    const scale = 100;
    const maxX = 6.5; // Maximum x-range (6.5π)


    function plotFunctionAreas(mathFunc, start, end, step, scale) {
        // Create groups for positive and negative areas
        const greenFillGroup = draw.group();
        const redFillGroup = draw.group();
        
        let currentStart = start;
        let isPositive = mathFunc(start) >= 0;
        
        // Iterate through the function to find sign changes
        for (let x = start + step; x <= end; x += step) {
            const currentValue = mathFunc(x);
            const currentIsPositive = currentValue >= 0;
            
            // If sign changed, create a filled area for the previous segment
            if (currentIsPositive !== isPositive || x >= end - step) {
                const segmentEnd = (x >= end - step) ? end : x;
                
                if (isPositive) {
                    // Create green area for positive segment
                    const pathData = createFilledPath(mathFunc, currentStart, step, segmentEnd, scale);
                    greenFillGroup.path(pathData).attr({ 
                        fill: 'green', 
                        opacity: 0.5,
                        stroke: 'none'
                    });
                } else {
                    // Create red area for negative segment
                    const pathData = createFilledPath(mathFunc, currentStart, step, segmentEnd, scale);
                    redFillGroup.path(pathData).attr({ 
                        fill: 'red', 
                        opacity: 0.5,
                        stroke: 'none'
                    });
                }
                
                // Reset for next segment
                currentStart = segmentEnd;
                isPositive = currentIsPositive;
            }
        }
        
        return { greenFillGroup, redFillGroup };
    }
    
    function createFilledPath(mathFunc, start, step, end, scale) {
        let pathData = `M ${start * scale} ${-mathFunc(start) * scale}`;
        
        // Create the top curve
        for (let x = start + step; x <= end; x += step) {
            const y = mathFunc(x);
            if (!isFinite(y)) continue;
            pathData += ` L ${x * scale} ${-y * scale}`;
        }
        
        // Close the path by going down to x-axis and back to start
        pathData += ` L ${end * scale} 0 L ${start * scale} 0 Z`;
        
        return pathData;
    }


    function drawMathFunction({ mathFunc, start, step, end, fill = 'none' }) {
        let pathData = `M ${start * scale} ${-mathFunc(start) * scale}`;
        
        for (let x = start; x <= end; x += step) {
            const y = mathFunc(x);
            if (!isFinite(y)) continue;
            pathData += ` L ${x * scale} ${-y * scale}`;
        }
        
        if (fill !== 'none') {
            pathData += ` L ${end * scale} 0 L ${start * scale} 0 Z`;
        }
        return pathData;
    }


    
    const sineWave = main.path('').attr({ stroke: 'white', 'stroke-width': 3, fill: 'none' });

    const { greenFillGroup, redFillGroup } = plotFunctionAreas(
        x => Math.cos(x) * Math.sin(x), 
        0, 6.3, 0.1, scale
    );
    
    main.add(greenFillGroup);
    main.add(redFillGroup);


    const coverRect = main.rect(maxX * scale, 300) // Height should cover the graph
        .attr({ fill: anim.colorConfig().backgroundColor, x: 0, y: -150 }) // Adjust y to center vertically
        .transform({ translate: [0, 0] });


        sineWave.plot(
            drawMathFunction({
                mathFunc: x =>  Math.cos(x)*Math.sin(x),
                start: 0,
                step: 0.1,
                end: 6.3,
            })
        );
    let scrubber=anim.effects.scrubber({initialValue:300,animator:(value)=>{
        coverRect.width(maxX * scale - value * scale);
        coverRect.x(value * scale);
    }})
    function slideGraph(value) {
        const endX = maxX * value / 100;
        
        scrubber.play(endX)
        

        
    }

    
    anim.sideBar.createRangeInput({
        name: 'Reveal Graph',
        min: 0,
        max: 100,
        value: 100,
        listener: function(e) {
            slideGraph(e.target.value);
        }
    });
    
    // Position the graph
    main.transform({ translate: [100, 400] });

    slideGraph(0);

    anim.initSteps([
        () => {
            // Future animation steps can go here
        }
    ]);
});

export default anim;
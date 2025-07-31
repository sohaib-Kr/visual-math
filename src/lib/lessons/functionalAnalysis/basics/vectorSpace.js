import { vMathAnimation } from "@/lib/library";
const anim = new vMathAnimation('vectorSpace');
import {Vector} from './utils';
anim.setInit(function(){
    const draw = anim.frame;
    const arrowSymbol = draw.symbol()
        .path('M -20 -2 L 0 -2 V -10 L 20 0 V 0 L 0 10 V 2 L -20 2 Z')
        .attr({...anim.config().indicationPoint});
    const main = draw.group();
    const scale = 70;
    let selectedArrows = [];
    let scalarInputs = [];
    let resultantArrow = null;

    function updateResultantVector() {
        if (selectedArrows.length < 2) return;
        
        
        
        // Calculate sum
        const sum = {
            x: selectedArrows[0].coords.x + selectedArrows[1].coords.x,
            y: selectedArrows[0].coords.y + selectedArrows[1].coords.y
        };
        
        // Create or update resultant arrow
        if (!resultantArrow) {
            resultantArrow = new Vector({
                coords: sum,
                symbole: arrowSymbol,
                parent: main,
                scale,
                lineConfig: { width: 5, color: '#4CAF50', dasharray: '5,3' }
            });
        } else {
            resultantArrow.updateCoords(sum);
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
                        arrow.updateCoords(newCoords);
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

    main.transform({ translate: [600, 400] });

    [[1,0],[0,1]].forEach(([x,y])=>{
        const arrow = new Vector({
            coords: { x, y },
            symbol: arrowSymbol,
            parent: main,
            scale,
            lineConfig: { width: 5, color: '#d97154' }
        });
        arrow.lastValidValue= '1.0'
        arrow.originalCoords={x,y}
        selectedArrows.push(arrow);
        createScalarInput(arrow, selectedArrows.length - 1)
    })
    
    
    
    

    updateResultantVector()

    anim.initSteps([
        () => {
        }
    ]);
});
export default anim;

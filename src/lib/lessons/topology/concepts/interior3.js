import { vMathAnimation} from '../../../library.js';
import 'eve'
import Snap from 'snapsvg';

export const anim = new vMathAnimation(1200, 800, 'first', 'first');
{
	// ===== CONFIGURATION =====
	const { interiorColor, borderColor, indicatorColor, coverColor} = anim.colorConfig();
	const draw = anim.frame;
    
    // Create main group
	const group = draw.group();
    
    // Create main shape
    const mainShape=group.path('M 81 15 C 129 -39 243 -37 276 77 S 194 111 240 172 S 137 221 105 168 S 116 152 117 94 C 110 38 55 51 81 15')
        .attr({fill:interiorColor});
    
    // Create inside shape
    const insideShape=group.path('M 108 18 C 114 5 210 58 221 116 S 194 111 190 156 S 137 221 131 161 S 116 152 117 94 C 110 38 97 42 108 18')
        .attr({fill:'#ffaa00'});


	// Position group
	group.translate(250, 200);
    group.scale(2);

	// ===== ANIMATION STEPS =====
    var text;

    function shapeSwap(path){
        return [
            ()=>{
                insideShape.animate(400).attr({opacity:0})
                .after(()=>insideShape.plot(path))
            },
            ()=>{
                insideShape.animate(400).attr({opacity:1})
            }]
    }

	anim.initSteps([
        ()=>{},
        ()=>{
            // Create text element
            text=anim.fadeText(
                "we will consider any arbitrary open subset of this set"
            ).dmove(200,630)
        },
        // ...shapeSwap('M 150 43 C 140 54 270 11 216 98 S 195 86 155 114 S 112 106 128 63 C 133 37 175 3 150 43'),
        // ...shapeSwap('M 117 96 C 177 74 270 55 276 77 S 194 111 240 172 S 137 221 105 168 S 116 152 117 94'),
        // ...shapeSwap('M 131 98 C 214 -23 270 55 225 81 S 194 111 213 127 S 137 221 137 161 S 103 145 131 99'),
        ...shapeSwap('M 81 15 C 129 -39 243 -37 276 77 S 208 77 219 142 S 147 136 137 133 S 132 103 117 94 C 110 38 55 51 81 15'),
        ()=>{
            text.animate(400).attr({opacity:0})
        },
    //     ()=>{
    //         const clipper = draw.mask().add(insideShape).fill('transparent');
    //         mainShape.maskWith(clipper)
    //     }
    ()=>{
        const inverseInsideShape=group.path(mainShape.node.attributes.d.value+'z'+insideShape.node.attributes.d.value+'z')
        .attr({fill:'red',fillRule:'evenodd'})
    }
	]);
}

import { vMathAnimation, textStyles } from '@/lib/library.js';
import 'eve'
import Snap from 'snapsvg';
export const anim = new vMathAnimation(1200, 800, 'first', 'first');

{
	// ===== CONFIGURATION =====
	const { interiorColor, borderColor} = anim.colorConfig();
	const draw = anim.frame;
    const sp=Snap(draw.node)

let shape=sp.path(`M 0 100
 A 100 100 0 0 0 100 0
 A 100 100 0 0 0 0 -100
 A 100 100 0 0 0 -100 0
 A 100 100 0 0 0 0 100`).attr({fill:interiorColor})
shape.transform('t300,300')

let intersectAnimation=[
    `M 0 100
  L 100 0
  L 0 -100
  L -100 0
  L 0 100`,
  `M 0 100
  L 0 100
  L 0 -100
  L -100 0
  L 0 100`,
  `M 0 100
 L 100 0
 L 0 -100
 L -100 0
 Z`,
 `M 0 200
C 12.5 225 37.5 225 50 200
L 50 -200
C 37.5 -225 12.5 -225 0 -200
L 0 200`,
`M 0 200
C 12.5 225 37.5 225 50 200
C 50 -200 50 -200 -100 -200
C -133.33 -200  -133.33 -150  -100 -150
C 0 -150 0 -150 0 200`,
`M 0 200 
    C 12.5 225 37.5 225 50 200 
    C 49 -228 -121 -242 -150 0 
    C -150 30 -100 30 -106 2 
    C -100 -150 1 -171 0 200`,
'M 0 200 C 12.5 225 37.5 225 50 200 C 40 -277 -410 121 70 98 C 97 98 94 59 66 59 C -240 96 -25 -173 0 200',

]



let endPath
anim.initSteps([
()=>{
    let i=0
    let interval=setInterval(()=>{
        if(i<intersectAnimation.length){endPath=intersectAnimation[i]}
        else{
            clearInterval(interval)
            return null
        }
        i>0?shape.attr({d:intersectAnimation[i-1]}):NaN
        shape.animate({ d: endPath }, 800, mina.easelinear);
        i+=1
    },800)
}
])
}
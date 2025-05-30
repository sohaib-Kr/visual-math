import { VectorField, CartPlane } from '@/lib/utiles/vector';
import { vMathAnimation } from '@/lib/library.js';
import { VectorTransforms } from '@/lib/utiles/Transformations.js';
export const anim = new vMathAnimation(1200, 800, 'first', 'first');
let draw=anim.frame
let symb=draw.symbol().path('M 0 0 H 40 L 34 -8 L 37 -9 L 46 2 L 46 2 L 36 13 L 33 11 L 40 4 L 0 4 Z')
.attr({fill:'#009999'})
//create the cartesian plane
const plane=new CartPlane(anim.frame,{u:60,v:60})

//create the field of vectors and points
const vectors=new VectorField(symb,anim.frame,plane,5,5)


const point=draw.symbol().circle(10).fill('#00ffff')
const points=new VectorField(point,anim.frame,plane,5,5)
points.deformation(VectorTransforms.identity,false)
//create line
// points.appendShape({
//     points:[{x:2,y:8},{x:6,y:8},{x:3,y:5},{x:7,y:3}],
//     closed:false})
points.fadeIn()
points.label('array')
points.appendShape({
    points:[{x:4,y:9},{x:6,y:9},{x:8,y:7},{x:6,y:5},{x:9,y:4},{x:3,y:4},{x:3,y:6}],
    closed:true})
{
    anim.initSteps([
    // // ()=>{
    // //     points.fadeIn()
    // // },
    // // ()=>{},
    // // ()=>{
    // //     points.noField.forEach((vect)=>{
    // //         vect.elem.animate(300).attr({opacity:0.5})
    // //     })
    // //     vectors.deformation(VectorTransforms.vectorRotate,false)
    // // },
    // // ()=>{
    // //     vectors.fadeIn()
    // // },
    // // ()=>{
    // //     vectors.fadeOut()
    // // },
    // // ()=>{
    // //     points.noField.forEach((point)=>{
    // //         point.elem.animate(300).attr({opacity:1})
    // //     })
    // // },
    // // ()=>{
    // //     points.noField.forEach((point)=>{
    // //         point.elem.animate(1400).transform({rotate:90,origin:[0,0]})
    // //     })
    // // },
    // // ()=>{
    // //     points.fadeOut()
    // //     setTimeout(()=>points.deformation(VectorTransforms.identity,false),500)
    // // },
    ()=>{
        points.fadeIn()
        vectors.deformation(VectorTransforms.vectorExpansion,false)

    },
    ()=>{
        points.noField.forEach((point)=>{
            point.elem.animate(300).attr({opacity:0.5})
        })
        setTimeout(()=>vectors.fadeIn(),500)
    },
    ()=>{},
    ()=>{
        vectors.fadeOut()
        points.noField.forEach((point)=>{
            point.elem.animate(300).attr({opacity:1})
        })
        points.deformation(VectorTransforms.pointExpansion,true)
    },
    ()=>{
        points.fadeOut()
    },
    ()=>{
        points.deformation(VectorTransforms.identity,false) 
        points.fadeIn()
    },
    ()=>{
        points.noField.forEach((point)=>{
            point.elem.animate(300).attr({opacity:0.5})
        })
    },
    ()=>{
        vectors.deformation(VectorTransforms.vectorSkewX,false)
        vectors.fadeIn()
    },
    ()=>{
        vectors.fadeOut()
        points.noField.forEach((point)=>{
            point.elem.animate(700).attr({opacity:1})
        })
    },
    ()=>{
        points.deformation(VectorTransforms.pointSkewX,true)
    },
    ()=>{
        points.deformation(VectorTransforms.pointSkewY,true)

    },
    
    ()=>{
        points.deformation(VectorTransforms.pointExpansion,true)
    }
])
}

import { VectorField, CartPlane } from '../../../utiles/vector';
import { vMathAnimation } from '../../../library.js';
import { VectorTransforms } from '../../../utiles/Transformations.js';
export const anim = new vMathAnimation(1200, 800, 'first', 'first');
let draw=anim.frame
let arrow=draw.symbol().path('M 0 0 H 40 L 34 -8 L 37 -9 L 46 2 L 46 2 L 36 13 L 33 11 L 40 4 L 0 4 Z')
.attr({fill:'#009999'})
//create the cartesian plane
const plane=new CartPlane(anim.frame,{u:60,v:60})

//create the field of vectors and points
const vectors=new VectorField(arrow,anim.frame,plane,7,7)


const point=draw.symbol().circle(10).fill('#00ffff')
const points=new VectorField(point,anim.frame,plane,12,12)
points.deformation(VectorTransforms.identity,false)
anim.initSteps([
    ()=>{
        points.fadeIn()
    },
    ()=>{},
    ()=>{
        points.noField.forEach((vect)=>{
            vect.elem.animate(300).attr({opacity:0.5})
        })
        vectors.deformation(VectorTransforms.vectorRotate,false)
    },
    ()=>{
        vectors.fadeIn()
    },
    ()=>{
        vectors.fadeOut()
    },
    ()=>{
        points.noField.forEach((point)=>{
            point.elem.animate(300).attr({opacity:1})
        })
    },
    ()=>{
        points.noField.forEach((point)=>{
            point.elem.animate(1400).transform({rotate:90,origin:[0,0]})
        })
    },
    ()=>{
        points.fadeOut()
        setTimeout(()=>points.deformation(VectorTransforms.identity,false),500)
    },    ()=>{
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
            
        },
        ()=>{
            points.fadeOut()
            setTimeout(()=>{
                points.deformation(VectorTransforms.identity,false) 
                points.fadeIn()
            },500)
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
                point.elem.animate(300).attr({opacity:1})
            })
        },
        ()=>{
            points.deformation(VectorTransforms.pointSkewX,true)
        },
])


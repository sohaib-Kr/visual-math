import { VectorField, CartPlane } from '../../../vector.js';
import { vMathAnimation } from '../../../library.js';
import { VectorTransforms } from '../../../utiles/Transformations.js';
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
function getPath(){
    const sPoint=points.field[2][3].elem
const c1Point=points.field[0][3].elem   
const c2Point=points.field[1][2].elem
const ePoint=points.field[4][1].elem
let sx=sPoint.bbox().x+sPoint.transform().translateX
let sy=sPoint.bbox().y+sPoint.transform().translateY
console.log(sPoint.transform())
let c1x=c1Point.bbox().x+c1Point.transform().translateX
let c1y=c1Point.bbox().y+c1Point.transform().translateY
let c2x=c2Point.bbox().x+c2Point.transform().translateX
let c2y=c2Point.bbox().y+c2Point.transform().translateY
let ex=ePoint.bbox().x+ePoint.transform().translateX
let ey=ePoint.bbox().y+ePoint.transform().translateY
return `M ${sx} ${sy} C ${c1x} ${c1y} ${c2x} ${c2y} ${ex} ${ey}`
}

const shape=points.group.path(getPath())
.attr({stroke:'white',strokeWidth:4}).fill('none')
setInterval(()=>shape.animate(50).plot(getPath()),50)

{
    anim.initSteps([
    // ()=>{
    //     points.fadeIn()
    // },
    // ()=>{},
    // ()=>{
    //     points.noField.forEach((vect)=>{
    //         vect.elem.animate(300).attr({opacity:0.5})
    //     })
    //     vectors.deformation(VectorTransforms.vectorRotate,false)
    // },
    // ()=>{
    //     vectors.fadeIn()
    // },
    // ()=>{
    //     vectors.fadeOut()
    // },
    // ()=>{
    //     points.noField.forEach((point)=>{
    //         point.elem.animate(300).attr({opacity:1})
    //     })
    // },
    // ()=>{
    //     points.noField.forEach((point)=>{
    //         point.elem.animate(1400).transform({rotate:90,origin:[0,0]})
    //     })
    // },
    // ()=>{
    //     points.fadeOut()
    //     setTimeout(()=>points.deformation(VectorTransforms.identity,false),500)
    // },
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
            point.elem.animate(300).attr({opacity:1})
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

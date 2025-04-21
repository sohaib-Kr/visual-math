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

points.appendShape({
    points:[{x:11,y:13},{x:13,y:16},{x:13,y:14}],
    closed:true})

points.appendShape({
    points:[{x:10,y:9},{x:7,y:9},{x:9,y:14},{x:6,y:14},{x:6,y:11}],
    closed:false})

anim.initSteps([
    ()=>{
        points.fadeIn()
    },
    ()=>{
        points.deformation(VectorTransforms.pointSkewX,true)
    },
    ()=>{
        points.deformation(VectorTransforms.pointSkewY,true)

    },
    
    ()=>{
        points.deformation(VectorTransforms.pointExpansion,true)
    },
    ()=>{
        points.deformation(VectorTransforms.randomTrans,true)
    },
    ()=>{
        points.deformation(VectorTransforms.identity,true)
    }
])
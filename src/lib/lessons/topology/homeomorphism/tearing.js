import { VectorField, CartPlane } from '../../../utiles/vector';
import { vMathAnimation } from '../../../library.js';
import { VectorTransforms } from '../../../utiles/Transformations.js';
export const anim = new vMathAnimation(1200, 800, 'first', 'first');
let draw=anim.frame
let arrow=draw.symbol().path('M 0 0 H 40 L 34 -8 L 37 -9 L 46 2 L 46 2 L 36 13 L 33 11 L 40 4 L 0 4 Z')
.attr({fill:'#9999ff'})
//create the cartesian plane
const plane=new CartPlane(anim.frame,{u:60,v:60})

//create the field of vectors and points
const vectors=new VectorField(arrow,anim.frame,plane,7,7)


const point=draw.symbol().circle(10).fill('#00ffff')
const points=new VectorField(point,anim.frame,plane,12,12)
points.deformation(VectorTransforms.identity,false)

let i=points.appendShape({
    points:[{x:8,y:8},{x:8,y:10},{x:6,y:12}],
    closed:false,
})

let j=points.appendShape({
    points:[{x:5,y:17},{x:4,y:14},{x:6,y:12}],
    closed:false,
})
clearInterval(i.interval)   
clearInterval(j.interval)

anim.initSteps([
    ()=>{
        points.fadeIn()
    },
    ()=>{
        vectors.deformation(VectorTransforms.vectorTearX,false)
    },
    ()=>{
        points.noField.forEach((point)=>{
            point.elem.animate(300).attr({opacity:0.5})
        })
        i.shape.animate(300).attr({opacity:0.5})
        j.shape.animate(300).attr({opacity:0.5})
        setTimeout(()=>vectors.fadeIn(),700)
    },
    ()=>{},
    ()=>{
        vectors.fadeOut()
        setTimeout(()=>{
            i.shape.animate(300).attr({opacity:1})
            j.shape.animate(300).attr({opacity:1})
            points.noField.forEach((point)=>{
                point.elem.animate(300).attr({opacity:1})
            })  
        },700)
        
    },
    ()=>{
        points.deformation(VectorTransforms.pointTearX,true)
        i.shape.animate(700).dmove(-100,0)
        j.shape.animate(700).dmove(100,0)
        
    },
])
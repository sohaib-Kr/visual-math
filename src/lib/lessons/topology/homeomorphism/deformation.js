import { VectorField, CartPlane } from '../../../vector.js';
import { vMathAnimation } from '../../../library.js';
import { Transforms } from '../../../utiles/Transformations.js';
export const anim = new vMathAnimation(1200, 800, 'first', 'first');
let draw=anim.frame
let symb=draw.symbol().path('M 0 0 H 40 L 34 -8 L 37 -9 L 46 2 L 46 2 L 36 13 L 33 11 L 40 4 L 0 4 Z')
.attr({fill:'#009999'})
const plane=new CartPlane(anim.frame,{u:60,v:60})
const field=new VectorField(symb,anim.frame,plane,10,10)
{
    field.fadeIn()
    field.deformation(Transforms.vectorRotate,true)
}

const point=draw.symbol().circle(10).fill('#00ffff')
// const pointsField=new VectorField(point,[60,60],anim.frame)
// pointsField.fadeIn()
// pointsField.deformation(Transforms.pointRotate,true)

field.noField.forEach((vect)=>{
    vect.holder.node.addEventListener('click',()=>{
        console.log({x:vect.x,y:vect.y,angle:180*Math.atan(vect.y/vect.x)/Math.PI})
      })
})
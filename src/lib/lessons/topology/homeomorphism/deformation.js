import { VectorField, CartPlane } from '../../../vector.js';
import { vMathAnimation } from '../../../library.js';
export const anim = new vMathAnimation(1200, 800, 'first', 'first');
let draw=anim.frame
let symb=draw.symbol().path('M 0 0 H 40 L 34 -8 L 37 -9 L 46 2 L 46 2 L 36 13 L 33 11 L 40 4 L 0 4 Z').attr({fill:'red'})
const field=new VectorField(symb,[60,60],anim.frame)
const plane=new CartPlane(anim.frame)
function scaleX(data){
    return{
        dx:0,
        dy:0,
        scale:(17+data.x)/34,
        rotate:2*data.y+2*data.x
    }
}
{
    // field.fadeIn()
    // setTimeout(()=>{field.deformation(scaleX,true)},2000)

}
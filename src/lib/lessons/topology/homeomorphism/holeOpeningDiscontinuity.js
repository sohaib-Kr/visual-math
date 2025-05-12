import { VectorField, CartPlane } from '@/lib/utiles/vector/index.js';
import { vMathAnimation } from '@/lib/library.js';
import { VectorTransforms } from '@/lib/utiles/Transformations.js';
export const anim = new vMathAnimation({width:1200, height:800, parent:'first', id:'first'});
let draw=anim.frame
let arrow=draw.symbol().path('M 0 0 H 40 L 34 -8 L 37 -9 L 46 2 L 46 2 L 36 13 L 33 11 L 40 4 L 0 4 Z')
.attr({fill:'#9999ff'})
//create the cartesian plane
const plane=new CartPlane({draw, unit:{u:30,v:30}})

//create the field of vectors and points
const vectors=new VectorField({symbol:arrow, parentSVG:draw, plane, lineWidth:7, columnHeight:7})


const point=draw.symbol().circle(10).fill('#00ffff')
const points=new VectorField({symbol:point, parentSVG:draw, plane, lineWidth:12, columnHeight:12})


function openCircle({circle,duration}){
    let max=20
    let step=0
    let ax=200
    let bx=-200
    let cx=0
    let dx=0
    let i=setInterval(()=>{
        if(step>=max) clearInterval(i)
        ax+=5
        bx-=5
        cx+=5
        dx-=5
        step+=1
        circle.plot(`
            M ${ax} 0 
            A 1 1 0 0 0 ${bx} 0 
            A 1 1 0 0 0 ${ax} 0 
            H ${cx}
            A 1 1 0 0 1 ${dx} 0 
            A 1 1 0 0 1 ${cx} 0 Z`)
    },duration/max)
}
const circle=points.group.path('M 200 0 A 1 1 0 0 0 -200 0 A 1 1 0 0 0 200 0 H 0 A 1 1 0 0 1 0 0 A 1 1 0 0 1 0 0 Z')
.fill('purple','evenodd')
// .attr({
//     opacity:0,
// })
points.label('array')
points.fadeIn()



anim.initSteps([
    ()=>{
        vectors.deformation({mathFunc:VectorTransforms.vectorOpeningHole, smoothness:false})
    },
    ()=>{
        points.fadeIn()
    },
    ()=>{
        vectors.deformation({mathFunc:VectorTransforms.vectorOpeningHole, smoothness:true})
        points.noField.forEach((point)=>{point.elem.animate(300).attr({opacity:0.5})})
    },
    ()=>{
        vectors.fadeIn()
    },
    ()=>{
        vectors.fadeOut()
        setTimeout(()=>points.noField.forEach((point)=>{point.elem.animate(300).attr({opacity:1})}),300)
    },
    ()=>{
        points.deformation({mathFunc:VectorTransforms.pointOpeningHole, smoothness:true})
    },
    ()=>{
        points.fadeOut()
    },
    ()=>{
        points.deformation({})
    },
    ()=>{
firstOpenSet.elem.attr({opacity:1})
        circle.animate(500).attr({opacity:1})
    },
    ()=>{
        points.deformation({mathFunc:VectorTransforms.pointOpeningHole, smoothness:true})
        openCircle({circle,duration:700})
    }
    
])
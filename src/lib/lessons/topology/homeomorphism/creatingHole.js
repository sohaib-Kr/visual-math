import { VectorField, CartPlane } from '../../../utiles/vector';
import { vMathAnimation } from '../../../library.js';
import { VectorTransforms } from '../../../utiles/Transformations.js';
export const anim = new vMathAnimation({width:1200, height:800, parent:'first', id:'first'});
let draw=anim.frame
let arrow=draw.symbol().path('M 0 0 H 40 L 34 -8 L 37 -9 L 46 2 L 46 2 L 36 13 L 33 11 L 40 4 L 0 4 Z')
.attr({fill:'#9999ff'})
//create the cartesian plane
const plane=new CartPlane({draw, unit:{u:60,v:60}})

//create the field of vectors and points
const vectors=new VectorField({symbol:arrow, parentSVG:draw, plane, lineWidth:7, columnHeight:7})


const point=draw.symbol().circle(10).fill('#00ffff')
const slidingArrowParent=vectors.group.group()
const slidingArrow=slidingArrowParent.use(arrow).fill('#orange')

const points=new VectorField({symbol:point, parentSVG:draw, plane, lineWidth:12, columnHeight:12})



function slideArrow({target, duration=2000,callback=()=>{},smoothness=true}){
    let elem=vectors.field[target.x][target.y]
    let pos=vectors.getCurrentPos(elem)
    let theta
    if(target.x>7){
        theta=-Math.atan(elem.y/elem.x)*180/Math.PI
    }
    else{
        theta=180-Math.atan(elem.y/elem.x)*180/Math.PI
    }
    if(smoothness==true){
        return slidingArrow.animate(duration).ease('-').transform({translate:[pos.x,pos.y],rotate:theta}).after(()=>{
        callback()
        })
    }
    else{
        return slidingArrow.transform({translate:[pos.x,pos.y],rotate:theta}).after(()=>{
            callback()
            })
    }
}

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
.fill('white','evenodd')
.attr({
    opacity:0,
})


slideArrow({target:{x:2,y:8},smoothness:false})
anim.delay=2000
anim.initSteps([
    ()=>{
        vectors.deformation({mathFunc:VectorTransforms.vectorOpeningHole, smoothness:false})
        vectors.noField.forEach((vector)=>vector.holder.animate(300).attr({opacity:0.3}))
    },
    ()=>{
        slideArrow({target:{x:14,y:12}})

    },
    ()=>{
        slideArrow({target:{x:14,y:2}})
    },
    ()=>{
        slideArrow({target:{x:7,y:7},
            callback:()=>{
                slidingArrow.animate(1).transform({rotate:180,origin:[0,0]}).after(()=>{
                    slideArrow({target:{x:5,y:9}})
                })
            }})
    },
    // ()=>{
    //     points.fadeIn()
    // },
    // ()=>{
    //     vectors.deformation({mathFunc:VectorTransforms.vectorOpeningHole, smoothness:true})
    //     points.noField.forEach((point)=>{point.elem.animate(300).attr({opacity:0.5})})
    // },
    // ()=>{
    //     vectors.fadeIn()
    // },
    // ()=>{
    //     vectors.fadeOut()
    //     setTimeout(()=>points.noField.forEach((point)=>{point.elem.animate(300).attr({opacity:1})}),300)
    // },
    // ()=>{
    //     points.deformation({mathFunc:VectorTransforms.pointOpeningHole, smoothness:true})
    // },
    // ()=>{
    //     points.fadeOut()
    // },
    // ()=>{
    //     circle.animate(500).attr({opacity:1})
    // },
    // ()=>{
    //     openCircle({circle,duration:700})
    // }
    
])
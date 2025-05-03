import { VectorField, CartPlane } from '../../../utiles/vector/index.js';
import { vMathAnimation } from '../../../library.js';
export const anim = new vMathAnimation({width:1200, height:800, parent:'first', id:'first'});

const draw=anim.frame
const plane=new CartPlane({draw, unit:{u:30,v:30}})

//so in order to create an instance of topo path class we need to pass:
// the coded path which is of the form 'first command |a| second command |b| go up |z| go down |y|'
// the initial data which is an object connects every point name (like a, b or z) to a coordinate array [x,y]
// the attr param just describes hte stye of the path element

let path=anim.createTopoPath({
    codedPath:`M |a| Q 0 0 |b|`,
    initialData:{a:[100,-100],b:[-100,100]},
    attr:{stroke:'red','stroke-width':5,fill:'none'}})
plane.append(path.group)


// //the first useful methode for topoPath is shape updater which take a matching set as a parameter
// //the matching set is an object that connects every point name (like a, b or z) to a path element 
// // that describes the trajectory of the point
// // and returns a function that updates the shape according to a time variable t that goes from 0 to 1
// //here we create the 2 paths describing the trajectory:

// let firstPath=plane.plane.path('M 0 0 L 300 300')
// let secondPath=plane.plane.path('M 0 0 L 100 -200')

// //now we call the createShapeUpdater method
// let x=path.createShapeUpdater({a:firstPath,b:secondPath})

// //the variable x stores the returned function which is the desired animation function
// //we use it inside a setInterval to animate the shape
// let t=0
// {
//     let I=setInterval(()=>{
//         x(t)
//         t+=0.01
//         if(t==1){
//             clearInterval(I)
//         }
//     },50)
// }

//the second useful method is draggable which let us interact with the shape by draggins some of its points
//it takes 2 parameters:
//the first is an array of point names that we want to make draggable
//and then we add the center of the plane where the path is puted
path.draggable(['a','b'],plane.center)

//to disable the draggable feature we can use the disableDraggable method


setTimeout(()=>{
    path.disableDraggable()
},2000)
setTimeout(()=>{
    path.draggable(['a','b'],plane.center)
},4000)
setTimeout(()=>{
    path.disableDraggable()
},6000)


anim.initSteps([
])
import * as utiles from './utiles'
import { SVG } from '@svgdotjs/svg.js'

/**
 * VectorField class for creating and managing a grid of vectors
 */
export class VectorField {
    /**
     * @param {SVGElement} symbol - The SVG symbol to use for each vector
     * @param {number[]} displayRule - [columns, rows] for the grid
     * @param {SVG} parentSVG - The parent SVG container
     */
     
    constructor(symbol, parentSVG,plane,lineWidth,columnHeight) {
        
        this.plane=plane
        //the field attribute holds all the vectors ordered in a 2d array line by line
        //the noField attribute holds all the vectors ordered in a 1d array
        this.field = []
        this.noField = []
        this.group = parentSVG.group()
        
        // Calculate grid dimensions
        const lineLength = parseInt(window.getComputedStyle(parentSVG.node).width) / this.plane.unit.u   
        const columnLength = parseInt(window.getComputedStyle(parentSVG.node).height) / this.plane.unit.v

        // Create vector grid
        for (let i = 0; i < lineWidth*2+1; i++) {
            const column = []
            for (let j = 0; j < columnHeight*2+1; j++) {
                const vector = {
                    x: i-lineWidth,
                    y: j-columnHeight,
                    holder: this.group.group().attr({opacity:0}),
                }
                vector.elem = vector.holder.use(symbol)
                    .move((i-lineWidth) * this.plane.unit.u, (columnHeight-j) * this.plane.unit.v)
                    .transform({scale:[1,1]})
                
                
                column.push(vector)
                this.noField.push(vector)
                vector.holder.node.setAttribute('coords',"x:"+vector.x+"y:"+vector.y)
            }
            this.field.push(column)
        } 
        this.group.transform({translate:[this.plane.center.x,this.plane.center.y]})
    }
    label(mode){
        if(mode=='array'){
            this.field.forEach((column,i)=>{
                column.forEach((vector,j)=>{
                    vector.holder.text("x:"+i+"y:"+j).fill('white')
                    .move((i-(parseInt(this.field.length/2))) * this.plane.unit.u, (parseInt(this.field.length/2)-j) * this.plane.unit.v)
                })
            })
        }
        else if(mode=='cartesian'){
            this.noField.forEach((vector)=>{
                vector.holder.text("x:"+vector.x+"y:"+vector.y).fill('white')
                .dmove(vector.x* this.plane.unit.u, (-vector.y) * this.plane.unit.v)
            })
        }
    }

    /**
     * Fade in all vectors in the field
     */
     fadeIn() {       
        this.noField.forEach((vect)=>{
           vect.holder.animate(500).attr({opacity:1})
         })
    }

    fadeOut() {       
        this.noField.forEach((vect)=>{
           vect.holder.animate(500).attr({opacity:0})
         })
    }

    /**
     * Apply deformation to all vectors based on a mathematical function
     * @param {Function} mathFunc - Function that returns {dx, dy, scale, rotate}
     * @param {boolean} smoothness - Whether to apply smooth animation
     */
    deformation(mathFunc, smoothness) {
        if (smoothness){
            this.noField.forEach((vector) => {
                const output = mathFunc(vector)
                vector.elem.animate(700).transform({
                    scale:[output.scale,1],
                    rotate:output.rotate,
                    translate:[output.dx,output.dy],
                    origin:'top left'
                })
            })
        }
        else{this.noField.forEach((vector) => {
            const output = mathFunc(vector)
            vector.elem.transform({
                scale:[output.scale,1],
                rotate:output.rotate,
                translate:[output.dx,output.dy],
                origin:'top left'
            })
        })}
    }


    animateMotion({path,duration=1000,callback=()=>{}}){
        this.noField.forEach((vector)=>{
            vector.elem.add(`<animateMotion dur="${duration}ms"
      repeatCount="indefinite"
      path="${path}" />`)
      setTimeout(()=>{
        vector.elem.node.innerHTML=''
        callback()
    },duration)
        })
    }

    appendShape({points,closed}){
        function getCurrentPos(point){
            point=point.elem
            let x=point.bbox().x+point.transform().translateX
            let y=point.bbox().y+point.transform().translateY
            return {x,y}
        }
        function getPath(points){
            let {x,y}=getCurrentPos(points[0])
            let path=`M ${x} ${y}`
            for (let  i= 0;  i< points.length-2; i+=2) {
                let c=getCurrentPos(points[i+1])
                let e=getCurrentPos(points[i+2])
                path+=`S ${c.x} ${c.y} ${e.x} ${e.y}`
            }
            if(closed){
                path+=`S ${getCurrentPos(points[0]).x} ${getCurrentPos(points[0]).y} ${getCurrentPos(points[0]).x} ${getCurrentPos(points[0]).y}`
            }
            return path
        }
        let shape
        if(closed){
            shape=this.group.path(getPath(points.map((coords)=>this.field[coords.x][coords.y])))
            .fill('white')
        }
        else{
            console.log(points)
            shape=this.group.path(getPath(points.map((coords)=>this.field[coords.x][coords.y])))
            .fill('none')
            .stroke({color:'white',width:3})
        }
        return(setInterval(()=>{
            shape.animate(20).plot(getPath(points.map((coords)=>this.field[coords.x][coords.y])))
        },50))
    }
}




export class CartPlane{
    constructor (draw,unit){
        let width=parseInt(window.getComputedStyle(draw.node).width)
        let height=parseInt(window.getComputedStyle(draw.node).height)
        this.plane=draw.group()
        this.plane.line(width/2,0,width/2,height).stroke({
            color: '#f6f3f4',
            width: 2,
            linecap: 'round'
        })
        this.plane.line(0,height/2,width,height/2).stroke({
            color: '#f6f3f4',
            width: 2,
            linecap: 'round'
        })
        this.unit=unit
        this.center={x:width/2,y:height/2}
    }
    getCartData(field){
        let width=  parseInt(window.getComputedStyle(this.plane.node).width)
        let height= parseInt(window.getComputedStyle(this.plane.node).height)
        let data=[]
        field.forEach((vact)=>{
            data.push({x:vact.x*this.unit.u-width/2,y:vact.y*this.unit.v-height/2})
        })
        return data
    }



}
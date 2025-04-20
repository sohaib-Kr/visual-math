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
        const group = parentSVG.group()
        
        // Calculate grid dimensions
        const lineLength = parseInt(window.getComputedStyle(parentSVG.node).width) / this.plane.unit.u   
        const columnLength = parseInt(window.getComputedStyle(parentSVG.node).height) / this.plane.unit.v

        // Create vector grid
        for (let i = 0; i < lineWidth*2-2; i++) {
            const line = []
            for (let j = 0; j < columnHeight*2-2; j++) {
                const vector = {
                    x: i-lineWidth,
                    y: j-columnHeight,
                    holder: group.group().attr({opacity:0}),
                }
                vector.elem = vector.holder.use(symbol)
                    .move(i * this.plane.unit.u, (columnHeight*2-4-j) * this.plane.unit.v)
                    .transform({scale:[0.1,1]})
                line.push(vector)
                this.noField.push(vector)
            }
            this.field.push(line)
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
                    translate:[output.dx,output.dy]
                })
            })
        }
        else{this.noField.forEach((vector) => {
            const output = mathFunc(vector)
            vector.elem.transform({
                scale:[output.scale,1],
                rotate:output.rotate,
                translate:[output.dx,output.dy]
            })
        })}
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
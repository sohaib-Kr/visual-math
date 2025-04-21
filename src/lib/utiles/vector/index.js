import { SVG } from '@svgdotjs/svg.js'
import { fadeIn } from './fade.js'
import { fadeOut } from './fade.js'
import { deformation } from './deformation.js'
import { animateMotion } from './animateMotion.js'
import { appendShape } from './appendShape.js'
import { label } from './label.js'

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
    fadeIn(...params){
        return fadeIn.bind(this)(...params)
    }
    fadeOut(...params){
        return fadeOut.bind(this)(...params)
    }
    deformation(...params){
        return deformation.bind(this)(...params)
    }
    animateMotion(...params){
        return animateMotion.bind(this)(...params)
    }
    appendShape(...params){
        return appendShape.bind(this)(...params)
    }
    label(...params){
        return label.bind(this)(...params)
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
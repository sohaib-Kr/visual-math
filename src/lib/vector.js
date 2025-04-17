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
    constructor(symbol, displayRule, parentSVG) {
        this.field = []
        this.noField = []
        const group = parentSVG.group()
        
        // Calculate grid dimensions
        const lineLength = parseInt(window.getComputedStyle(parentSVG.node).width) / displayRule[0]
        const columnLength = parseInt(window.getComputedStyle(parentSVG.node).height) / displayRule[1]

        // Create vector grid
        for (let i = 0; i < lineLength - 1; i++) {
            const line = []
            for (let j = 0; j < columnLength - 1; j++) {
                const vector = {
                    x: i,
                    y: j,
                    elem: group.use(symbol)
                        .move(i * displayRule[0], j * displayRule[1])
                        .attr({ opacity: 0 })
                }
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
        let i = 0
        const interval = setInterval(() => {
            if (i >= this.field.length) {
                clearInterval(interval)
                return
            }

            try {
                this.field[i].forEach((vector) => {
                    vector.elem.animate(400).attr({ opacity: 1 })
                })
            } catch (e) {
                console.error('Error in fadeIn:', e)
            }
            
            i++
        }, 50)
    }

    /**
     * Apply deformation to all vectors based on a mathematical function
     * @param {Function} mathFunc - Function that returns {dx, dy, scale, rotate}
     * @param {boolean} smoothness - Whether to apply smooth animation
     */
    deformation(mathFunc, smoothness) {
        if (!smoothness) return

        this.noField.forEach((vector) => {
            const output = mathFunc(vector)
            vector.elem.animate(1000)
                .dmove(output.dx, output.dy)
                .scale(output.scale, 1)
                .rotate(output.rotate)
        })
    }
}

export class CartPlane{
    constructor (draw){
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
    }
}

import * as utiles from './utiles'
export class Animation {
    constructor(height, width, parent, id) {
        this.wrapper = document.createElement('div');
        this.wrapper.innerHTML = `
            <div id="${id}Animation" class="animationWrapper">
              <svg class="animation" id="${id}Frame"></svg>
              <div class="animationControl"></div>
            </div>`;
        document.getElementById(parent).appendChild(this.wrapper);
        this.frame = SVG(`#${id}Frame`).size(height, width);
        this.step = 0;
        this.delay = 1000;
        this.engine = [() => {
            this.step += 1;
            this.step < this.engine.length ? (() => {
                document.getElementById('indexer').innerText = this.step;
                this.engine[this.step]();
                setTimeout(() => this.engine[0](), this.delay);
            })() : NaN;
        }];
    }

    fadeNextStep(...args){
        utiles.fadeNextStep.bind(this)(...args)
    }
    initSteps(steps) {
        this.engine = this.engine.concat(steps);
    }
    arrow(sx, sy, ex, ey, cx, cy, color, vivusConfirmed){
        return utiles.arrow(this.frame,sx, sy, ex, ey, cx, cy, color, vivusConfirmed)
    }
    createDynamicText(text){
        return utiles.createDynamicText(this.frame,text)
    }
    createDynamicLatex(text){
        return utiles.createDynamicLatex(this.frame,text)
    }
    colorConfig(){
        return utiles.colorConfig(this.frame)
    }
    updateMousePosition(event) {
        let mousePositionElement = document.getElementById('mouse');
        // Get the bounding rectangle of the canvas
        const rect =this.frame.node.getBoundingClientRect()
        // Calculate the mouse position relative to the canvas
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        // Update the text inside the <p> element
        mousePositionElement.textContent = `Mouse Position: (${mouseX.toFixed(2)}, ${mouseY.toFixed(2)})`;
    }
} 
export const textStyles=utiles.textStyles
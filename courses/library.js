
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
        this.frame.attr({style: 'background-color: #170734;padding: 50px;border-radius: 50px;'})
        this.step = 0;
        this.delay = 1000;
        this.engine = [() => {
            this.step += 1;
            this.step < this.engine.length ? (() => {
                document.getElementById('indexer').innerText = this.step;
                try{this.engine[this.step]();
                setTimeout(() => this.engine[0](), this.delay);}catch(e){console.error('error at step '+this.step+' '+e)}
            })() : NaN;
        }];
    }

    fadeNextStep(...args){
        utiles.fadeNextStep.bind(this)(...args)
    }
    initSteps(steps) {
        this.engine = this.engine.concat(steps);
    }
    arrow(...params){
        return utiles.arrow.bind(this)(...params)
    }
    createDynamicText(...params){
        return utiles.createDynamicText.bind(this)(...params)
    }
    createDynamicLatex(...params){
        return utiles.createDynamicLatex.bind(this)(...params)
    }
    colorConfig(){
        return utiles.colorConfig(this.frame)
    }
    latex(...params){
        return utiles.latex.bind(this)(...params)
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
    shakeAnimation(...params){
        return utiles.shakeAnimation.bind(this)(...params)
    }
    fadeText(...params){
        return utiles.fadeText.bind(this)(...params)
    }
    fadeBounce(...params){
        return utiles.fadeBounce.bind(this)(...params)
    }
} 
export const textStyles=utiles.textStyles

import * as utiles from './utiles'
import { SVG } from '@svgdotjs/svg.js'
export class vMathAnimation {
    #pause=false
    #control
    #id
    constructor({width, height, parent, id}){
        this.#id=id
        if (process.env.NODE_ENV === 'development') {
            if (!(document.getElementById(parent) instanceof HTMLElement)) {
                throw new Error('cannot create animation frame: parent does not exist')
            }
        }
        let parentElement=document.getElementById(parent)
        let ofsetWidth=parseInt(window.getComputedStyle(parentElement).width)
        this.wrapper = document.createElement('div');
        this.wrapper.innerHTML = `
            <div id="${id}Animation" class="animationWrapper">
              <svg class="animation" id="${id}Frame"></svg>
              <div class="animationControl"></div>
            </div>`;
            this.wrapper.style.transformOrigin='top left'
            this.wrapper.style.transform='scale('+(ofsetWidth/width)+')'
        parentElement.appendChild(this.wrapper);
        this.frame = SVG(`#${id}Frame`).size(width,height);
        this.frame.attr({style: 'background-color:'+this.colorConfig().backgroundColor+';border-radius: 50px;'})
        this.step = 0;
        this.delay = 1000;
        this.next=null
        this.engine = [() => {
            this.step += 1;
            this.step < this.engine.length ? (() => {
                try{this.engine[this.step]();
                if(this.#pause==false){
                    this.next=setTimeout(() => this.engine[0](), this.delay)
                }}catch(e){console.error('error at step '+this.step+' '+e.stack)}
            })() : NaN;
        }];
    }
    pause(){
        this.#pause=true
        clearInterval(this.next)
    }
    play(){
        this.#pause=false
        this.engine[0]()
    }
    addControl({name,type,listener}){
        let control={node:null,listener,kill:null}
        let input
        if(type=='range'){
            input=document.createElement('input')
            input.type='range'
            input.min=0
            input.max=100
            input.value=0
            input.addEventListener('input',control.listener)
            control.kill=()=>{
                input.removeEventListener('click',control.listener)
                {
                    let t=1
                    let I=setInterval(()=>{
                        input.style.opacity=t
                        console.log(input.style.opacity)
                        t-=0.04
                        if(t<0){
                            clearInterval(I)
                            control.node.remove()
                        }
                    },20)
                }
            }
        }
        else if(type=='button'){
            input=document.createElement('button')
            input.textContent=name
            input.addEventListener('click',control.listener)
            control.kill=()=>{
                input.removeEventListener('click',control.listener)
                {
                    let t=1
                    let I=setInterval(()=>{
                        input.style.opacity=t
                        console.log(input.style.opacity)
                        t-=0.04
                        if(t<0){
                            clearInterval(I)
                            control.node.remove()
                        }
                    },20)
                }
            }
        }
        control.node=input
        document.getElementById(this.#id).querySelector('.control').appendChild(input)
        input.style.opacity=0
        {
            let t=0
            let I=setInterval(()=>{
                input.style.opacity=t
                t+=0.1
                if(t>1){
                    clearInterval(I)
                }
            },20)
        }
        return control
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
    createTopoPath(params){
        return new utiles.TopoPath({frame:this.frame,...params})
    }

} 
export const textStyles=utiles.textStyles
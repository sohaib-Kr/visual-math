
import * as utiles from './utiles'
import { SVG } from '@svgdotjs/svg.js'
import { gsap } from 'gsap'


gsap.config({easeDefault:'power2.inOut'})
// vMathAnimation class provides an interface for the svg animation frame
//every instance of vMathAnimation is an animation frame. it provides all the methods to control the animation (play, pause, restart....)
//it also provides all the utiles functions to create and animate svg elements (create text, plane, vector field, arrow, latex .....)
//it also provides a control panel to let the user interact with the animation 

export class vMathAnimation {
    #pause=false
    #id
    constructor(id){
        this.#id=id
        //check if the animation holder exists (it should be a div element with the specified id)
        if (process.env.NODE_ENV === 'development') {
            if (!(document.getElementById(id) instanceof HTMLElement)) {
                throw new Error('cannot create animation frame: parent does not exist')
            }
        }

        //get the parent element and calculate the scale factor so that the svg frame fits inside the element
        let parentElement=document.getElementById(id)
        let ofsetWidth=parseInt(window.getComputedStyle(parentElement).width)
        let ofsetHeight=parseInt(window.getComputedStyle(parentElement).height)

        //create the animation frame element
        this.wrapper = document.createElement('div');
        this.wrapper.innerHTML = `
            <div id="${id}Animation" class="animationWrapper">
              <svg class="animation" id="${id}Frame"></svg>
              <div class="animationControl"></div>
            </div>`;
            this.wrapper.style.height='100%'
            this.wrapper.children[0].style.transformOrigin='top left'
            this.wrapper.children[0].style.transform='scale('+(ofsetWidth/1200)+','+(ofsetHeight/800)+')'
        parentElement.appendChild(this.wrapper);

        //using SVG.js we load the svg frame element and configure it
        this.frame = SVG(`#${id}Frame`).size(1200,800);
        this.frame.attr({style: 'background-color:'+this.colorConfig().backgroundColor+';border-radius: 50px;'})

        //iniitalizing animation variables and the engine[0] function (the main animation loop)
        this.step = 0;
        this.delay = 1000;
        this.next=null
        this.engine = [() => {
            this.step += 1;
            this.step < this.engine.length ? (() => {
                try{this.engine[this.step]();
                if(this.#pause==false){
                    this.next=setTimeout(() => this.engine[0](), this.delay)
                }}catch(e){console.error('error in animation: '+this.#id+' at step '+this.step+' '+e.stack)}
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
        //this function create a control object that holds the node element of the input,
        // the listener function that runs when the user interact with it and the kill function that remove the input and its event listeners
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
                input.removeEventListener('input',control.listener)
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
        document.getElementById(this.#id).parentElement.querySelector('.control').children[1].appendChild(input)
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
    createTextSpace(){
        let textSpace=document.getElementById(this.#id)
        .parentElement.querySelector('.control').children[0]
        .appendChild(document.createElement('div'))
        textSpace.classList.add('textSpace')
        textSpace.style.position='relative'
        textSpace.style.width='80%'
        let obj={
            update:function(newText,fade=false,latex=false){
 
                if(fade){
                    let tween=gsap.to(textSpace,{duration:0.5,y:-10,opacity:0,onComplete:()=>{
                        textSpace.innerHTML=newText
                        gsap.to(textSpace,{duration:0.5,y:10,opacity:1})
                    }})
                }
                else{
                    textSpace.innerHTML=newText
                }
                if(latex){
                    katex.render(newText,textSpace,{throwOnError:true,displayMode:false})
                }
                return this
            }

        }
        return obj
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
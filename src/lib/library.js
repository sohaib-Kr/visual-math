
import * as utiles from './utiles'
import { SVG } from '@svgdotjs/svg.js'
import { gsap } from 'gsap'
import katex from 'katex'


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
            </div>`;
            this.wrapper.style.width='100%'
            this.wrapper.style.aspectRatio='3/2'
            this.wrapper.style.backgroundColor=this.colorConfig().backgroundColor
            this.wrapper.style.borderRadius='50px'
            this.wrapper.style.overflow='hidden'
            this.wrapper.children[0].style.transformOrigin='top left'
            
                this.wrapper.children[0].style.transform='scale('+(ofsetWidth/1200)+')'
        parentElement.appendChild(this.wrapper);
        this.node=this.wrapper.querySelector('.animation')
        gsap.fromTo(this.wrapper.parentNode.parentNode,{opacity:0},{duration:0.8,opacity:1})
        //using SVG.js we load the svg frame element and configure it
        this.frame = SVG(`#${id}Frame`).size(1200,800);

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
    addControl({name, type, listener,latex=false}) {
        let control = {node: null, listener, kill: null};
        let input;
        
        if (type === 'range') {
            let wrapper=document.createElement('div')
            wrapper.className='flex items-center gap-2'
            wrapper.innerHTML='<span>'+name+'</span><input type="range" min="0" max="100" value="0">'
            input = wrapper;
            input.style.position='relative'
            input.style.right='10%'
            input.children[1].style.width='75%'
            input.children[1].style.marginTop='10px'
            input.children[1].style.marginBottom='10px'
            input.children[1].addEventListener('input', control.listener,{passive:true});
            input.children[0].style.fontFamily='poppins'
            input.children[0].style.fontSize='20px'
            input.children[0].style.color='#718096'
            input.children[0].style.marginTop='10px'
            input.children[0].style.marginBottom='10px'
            wrapper.querySelector('input').className='rangeInput'
            
            if(latex){
                katex.render(name, input.children[0], {throwOnError: true, displayMode: false});
            }
            control.kill = () => {
                input.children[1].removeEventListener('input', control.listener);
                gsap.to(input,{duration:0.5,y:-10,opacity:0,onComplete:()=>input.remove()})
            };
        } 
        else if (type === 'button') {
            input = document.createElement('button');
            input.className='font-[poppins] my-[15px] p-[13px] leading-none px-[9px] text-[21px] cursor-pointer w-fit rounded-md bg-[#b6638b] text-white';
            input.textContent = name;
            input.addEventListener('mouseover', () => {
                gsap.to(input,{duration:0.3,backgroundColor:'#9c4971'})
            });
            input.addEventListener('mouseleave', () => {
                gsap.to(input,{duration:0.3,backgroundColor:'#b6638b'})
            });
            input.addEventListener('click', control.listener);
            control.kill = () => {
                input.removeEventListener('click', control.listener);
                gsap.to(input,{duration:0.5,y:-10,opacity:0,onComplete:()=>input.remove()})
            };
        }
        else if (type === 'text') {
            input = document.createElement('input');
input.type = 'text';
input.placeholder = name || '';

// Add styling to the input element
Object.assign(input.style, {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    width: '200px',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    color: '#333',
    margin: '4px 0'
});

// Add focus styles
input.addEventListener('focus', () => {
    input.style.borderColor = '#4285f4';
    input.style.boxShadow = '0 0 0 2px rgba(66, 133, 244, 0.2)';
});

input.addEventListener('blur', () => {
    input.style.borderColor = '#ccc';
    input.style.boxShadow = 'none';
});
            input.addEventListener('input', control.listener);
            control.kill = () => {
                input.removeEventListener('input', control.listener);
                gsap.to(input,{duration:0.5,y:-10,opacity:0,onComplete:()=>input.remove()})
            };
        }
        
        control.node = input;
        const container = document.getElementById(this.#id).parentElement.querySelector('.control').children[1];
        container.appendChild(input);
        gsap.to(input,{duration:0.5,y:10,opacity:1})
        
        return control;
    }
    createTextSpace() {
        let textSpace = document.getElementById(this.#id)
            .parentElement.querySelector('.control').children[0]
            .appendChild(document.createElement('div'));
        textSpace.className=('textSpace font-[merriweather] text-gray-600 text-[18px]  tracking-[1px] leading-[1.8] mb-7');
    
        let obj = {
            textSpace,
            update: function({newText, fade = false, latex = false,callback=()=>{}}) {
                if (!latex) {
                    if (fade) {
                        let tween = gsap.to(textSpace, {
                            duration: 0.5,
                            y: -10,
                            opacity: 0,
                            onComplete: () => {
                                textSpace.innerHTML = newText;
                                callback()
                                gsap.to(textSpace, {duration: 0.5, y: 10, opacity: 1});
                            }
                        });
                    } else {
                        textSpace.innerHTML = newText;
                        callback()
                    }
                } else if (fade) {
                    gsap.to(textSpace, {
                        duration: 0.5,
                        y: -10,
                        opacity: 0,
                        onComplete: () => {
                            textSpace.innerHTML = '';
                            katex.render(newText, textSpace, {throwOnError: true, displayMode: false});
                            gsap.to(textSpace, {duration: 0.5, y: 10, opacity: 1});
                        }
                    });
                } else {
                    textSpace.innerHTML = '';
                    katex.render(newText, textSpace, {throwOnError: true, displayMode: false});
                }
                return this;
            },
    
            // New addLatex method
            addLatex: function(arrayOfLatex) {
                // Get current text content
                let currentContent = textSpace.textContent;
                // Split by pipe character and trim whitespace
                let textParts = currentContent.split('|').map(part => part.trim());
                // Combine text parts with latex spans
                let newHTML = '';
                for (let i = 0; i < textParts.length; i++) {
                    newHTML += textParts[i];
                    // Add LaTeX span if we have a corresponding latex string
                    if (arrayOfLatex[i]) {
                        newHTML += ` <span class="latex-equation">${arrayOfLatex[i]}</span> `;
                    }
                }
                
                // Update the content
                textSpace.innerHTML = newHTML;
                
                // Render all LaTeX spans
                const latexSpans = textSpace.querySelectorAll('.latex-equation');
                latexSpans.forEach((span, index) => {
                    try {
                        katex.render(arrayOfLatex[index], span, {
                            throwOnError: true,
                            displayMode: false
                        });
                    } catch (e) {
                        console.error("KaTeX rendering error:", e);
                        span.textContent = arrayOfLatex[index];
                    }
                });
                
                return this;
            }
        };
        return obj;
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
    createScrubber(params){
        return new utiles.Scrubber({...params})
    }
    emphasize(...params){
        return utiles.emphasize(...params)
    }
    vivusRender(...params){
        return utiles.vivusRender(...params)
    }
    config(){
        return {
            path1:{stroke:'#98FF98','stroke-width':3,fill:'none','stroke-linecap':'round',opacity:0},
            path2:{stroke:'white','stroke-width':3,fill:'none','stroke-linecap':'round',opacity:0},
            indicationLine:{stroke:'white','stroke-width':2,fill:'none',opacity:0},
            indicationPoint:{fill:'#ff8000',r:9}
        }
    }
    playAgain(init){
        gsap.to(this.wrapper.parentNode.parentNode,{duration:0.8,opacity:0,onComplete:()=>{
            this.wrapper.parentNode.parentNode.children[0].children[0].innerHTML=''
            this.wrapper.parentNode.parentNode.children[0].children[1].innerHTML=''
            this.wrapper.parentNode.parentNode.style.opacity=1
            this.wrapper.remove()
            init().engine[0]()
        }})
    }
    kill(init){
        this.pause()
        gsap.to(this.wrapper.parentNode.parentNode,{duration:0.8,opacity:0,onComplete:()=>{
            this.wrapper.parentNode.parentNode.children[0].children[0].innerHTML=''
            this.wrapper.parentNode.parentNode.children[0].children[1].innerHTML=''
            this.wrapper.parentNode.parentNode.style.opacity=1
            this.wrapper.remove()
            return init()
        }})
    }
} 
export const textStyles=utiles.textStyles
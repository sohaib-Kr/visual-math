
import * as utiles from './utiles';
import { SVG } from '@svgdotjs/svg.js';
import { gsap } from 'gsap';
import katex from 'katex';

gsap.config({ easeDefault: 'power2.inOut' });

/**
 * vMathAnimation class provides an interface for the SVG animation frame
 * Every instance of vMathAnimation is an animation frame that provides:
 * - Animation control methods (play, pause, restart)
 * - SVG element creation and animation utilities
 * - A control panel for user interaction
 */
export class vMathAnimation {
    #pause = false;
    #id;

    constructor(id) {
        this.#id = id;

        this.frameInit()
        
        this.init=null
    }
    frameInit(){
        // Check if animation holder exists
        if (process.env.NODE_ENV === 'development') {
            if (!(document.getElementById(this.#id) instanceof HTMLElement)) {
                throw new Error('Cannot create animation frame: parent does not exist');
            }
        }

        // Get parent element and calculate scale factor
        const parentElement = document.getElementById(this.#id);
        const ofsetWidth = parseInt(window.getComputedStyle(parentElement).width);

        // Create animation frame element
        this.wrapper = document.createElement('div');
        this.wrapper.innerHTML = `
            <div id="${this.#id}Animation" class="animationWrapper">
                <svg class="animation" id="${this.#id}Frame"></svg>
            </div>`;

        this.wrapper.style.width = '100%';
        this.wrapper.style.aspectRatio = '3/2';
        this.wrapper.style.backgroundColor = this.colorConfig().backgroundColor;
        this.wrapper.style.borderRadius = '50px';
        this.wrapper.style.overflow = 'hidden';
        this.wrapper.children[0].style.transformOrigin = 'top left';
        this.wrapper.children[0].style.transform = `scale(${ofsetWidth / 1200})`;

        parentElement.appendChild(this.wrapper);
        this.node = this.wrapper.querySelector('.animation');
        gsap.fromTo(this.wrapper.parentNode.parentNode, { opacity: 0 }, { duration: 0.8, opacity: 1 });

        // Initialize SVG frame with SVG.js
        this.frame = SVG(`#${this.#id}Frame`).size(1200, 800);

        // Initialize animation variables and engine
        this.step = 0;
        this.delay = 1000;
        this.next = null;
        this.engine = [() => {
            this.step += 1;
            if (this.step < this.engine.length) {
                try {
                    this.engine[this.step]();
                    if (!this.#pause) {
                        this.next = setTimeout(() => this.engine[0](), this.delay);
                    }
                } catch (e) {
                    console.error(`Error in animation: ${this.#id} at step ${this.step} ${e.stack}`);
                }
            }
        }];
        this.sideBar=utiles.sideBar(this.#id)
        this.elements=utiles.createElementsInstance(this.frame)
        this.effects=utiles.createEffectsInstance()
    }
    setInit(init){
        this.init=init
    }

    pause() {
        this.#pause = true;
        clearTimeout(this.next);
    }

    play() {
        this.#pause = false;
        this.engine[0]();
    }
    initSteps(steps) {
        this.engine = this.engine.concat(steps);
    }
    colorConfig(){
        return utiles.colorConfig(this.frame)
    }
    config(){
        return {
            path1:{stroke:'#98FF98','stroke-width':3,fill:'none','stroke-linecap':'round',opacity:0},
            path2:{stroke:'white','stroke-width':3,fill:'none','stroke-linecap':'round',opacity:0},
            indicationLine:{stroke:'white','stroke-width':2,fill:'none',opacity:0},
            indicationPoint:{fill:'#ff8000',r:9}
        }
    }
    playAgain(){
        gsap.to(this.wrapper.parentNode.parentNode,{duration:0.8,opacity:0,onComplete:()=>{
            this.wrapper.parentNode.parentNode.children[0].children[0].innerHTML=''
            this.wrapper.parentNode.parentNode.children[0].children[1].innerHTML=''
            this.wrapper.parentNode.parentNode.style.opacity=1
            this.wrapper.remove()
            this.frameInit()
            this.init()
            this.step=0
            this.engine[0]()
        }})
    }
    kill(){
        this.pause()
        gsap.to(this.wrapper.parentNode.parentNode,{duration:0.8,opacity:0,onComplete:()=>{
            this.wrapper.parentNode.parentNode.children[0].children[0].innerHTML=''
            this.wrapper.parentNode.parentNode.children[0].children[1].innerHTML=''
            this.wrapper.parentNode.parentNode.style.opacity=1
            this.wrapper.remove()
        }})
    }
} 
export const textStyles=utiles.textStyles
import {textStyles} from './textConfig.mjs'
import gsap from 'gsap'
import Vivus from 'vivus'
import {emphasize} from './emphasize.js'


//the scrubber object creates a scrubbing effect
//it takes an initial Value and an animator function
//the animator function will be called in every frame of the animation

class Scrubber{
    #animator
    #currentValue
    #currentInterval
    #callback
    #onUpdate
    constructor({initialValue,animator,callback=()=>{},onUpdate=(x)=>{}}){
        this.#currentValue=initialValue
        this.#animator=animator
        this.#callback=callback
        this.#onUpdate=onUpdate
    }
    play(target){
        this.#currentInterval&&this.#currentInterval.kill()
        let change=target-this.#currentValue
        let cur=this.#currentValue
        let obj=this
        this.#currentInterval=gsap.to({},{
            duration:0.1,
            onUpdate:function(){
                obj.#animator(cur+this.progress()*change)
                obj.#currentValue=cur+this.progress()*change
                obj.#onUpdate(obj.#currentValue)
            },
            onComplete:()=>{
                obj.#currentInterval=null
                obj.#callback()
            }
        })
    }
}


export function createEffectsInstance() {
    return {
        shakeAnimation({ element, degree = 3, frequency = 100, callback = () => {}, delay = 0 }) {
            if (process.env.NODE_ENV === 'development') {
                if (!(element instanceof SVG)) {
                    throw new Error('cannot shake: element is not an SVG')
                }
            }
            element.animate({ duration: 200, delay }).after(callback)
                .rotate(degree)
                .animate(frequency)
                .rotate(-2 * degree)
                .animate(frequency)
                .rotate(2 * degree)
                .animate(frequency)
                .rotate(-2 * degree)
                .animate(frequency)
                .rotate(2 * degree)
                .animate(frequency)
                .rotate(-degree);
        },

        // This function schedules element to delete after the next step in vMathAnimation engine array
        fadeNextStep(...args) {
            let now = this.step;
            args.forEach(arg => {
                let I = setInterval(() => {
                    this.step == now + 1 ? (arg.animate(500).attr({ opacity: 0 }).after(() => arg.remove()), clearInterval(I)) : NaN;
                }, 100);
            });
        },

        fadeText(text) {
            let textElement = this.frame.text(text).attr(textStyles.explanation);
            textElement.animate(300).attr({ opacity: 1 });
            return textElement;
        },

        fadeBounce({ shape, callback = () => {} }) {
            shape.transform({ scale: [0.7, 0.7] });
            shape.animate({ duration: 300, easing: '<>' }).transform({ scale: [1.3, 1.3] }).attr({ opacity: 1 })
                .animate({ duration: 200 }).transform({ scale: [1, 1] })
                .animate({ duration: 200, easing: '<>' }).transform({ scale: [1.1, 1.1] })
                .animate({ duration: 100 }).transform({ scale: [1, 1] })
                .animate({ duration: 100, easing: '<>' }).transform({ scale: [1.05, 1.05] })
                .animate({ duration: 50 }).transform({ scale: [1, 1] })
                .after(callback);
            return shape;
        },
        scrubber({initialValue,animator,callback=()=>{},onUpdate=(x)=>{}}){
            return new Scrubber({initialValue,animator,callback,onUpdate})
        },

        vivus({elem,duration=50,callback=()=>{},onReady=()=>{}}={}){
            let id='newIdNeverCreatedBefore'
            elem.id=id
            let styles=[]
            Array.from(elem.children).forEach((child,index)=>{
                styles.push(child.style)
            })
            new Vivus(id, {
                type: 'oneByOne',
                duration: duration,
                pathTimingFunction: Vivus.LINEAR, // Add this for consistent timing
                onReady: function() {
                    elem.id = '';
                    onReady()
                },
            },
            ()=>{
                Array.from(elem.children).forEach((child,index)=>{
                    child.style=styles[index]
                })
                callback()
            }
        );
        },
        emphasize(...params){
            return emphasize(...params)
        }
    };
}
//the scrubber object creates a scrubbing effect
//it takes an initial data object, an animator function and a duration
//the animator function will be called in every frame of the animation
//the duration indicats how many seconds it takes for a 100 units of value change
import {animateWithRAF} from '../library'
export class Scrubber{
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
        this.#currentInterval&&this.#currentInterval.stop()
        let change=target-this.#currentValue
        let t=0
        let cur=this.#currentValue
        this.#currentInterval=animateWithRAF((timestamp,deltaTime)=>{
            t+=0.1
            console.log(t)
            this.#animator(cur+t*change)
            this.#currentValue=cur+t*change
            this.#onUpdate(this.#currentValue)
            if(t>=1){
                this.#currentInterval.stop()
                this.#callback()
            }
        })
    }
}
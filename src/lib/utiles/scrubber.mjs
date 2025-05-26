//the scrubber object creates a scrubbing effect
//it takes an initial data object, an animator function and a duration
//the animator function will be called in every frame of the animation
//the duration indicats how many seconds it takes for a 100 units of value change
import gsap from 'gsap'
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
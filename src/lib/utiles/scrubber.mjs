//the scrubber object creates a scrubbing effect
//it takes an initial data object, an animator function and a duration
//the animator function will be called in every frame of the animation
//the duration indicats how many seconds it takes for a 100 units of value change
export class Scrubber{
    #animator
    #duration
    #currentValue
    #currentInterval
    #callback
    #onUpdate
    constructor({initialValue,animator,duration,callback=()=>{},onUpdate=(x)=>{}}){
        this.#currentValue=initialValue
        this.#animator=animator
        this.#duration=duration
        this.#callback=callback
        this.#onUpdate=onUpdate
    }
    play(target){
        this.#currentInterval&&clearInterval(this.#currentInterval)
        let change=target-this.#currentValue
        let dur=Math.abs(change)/100*this.#duration
        let t=0
        let cur=this.#currentValue
        this.#currentInterval=setInterval(()=>{
            t+=0.1
            this.#animator(cur+t*change)
            this.#currentValue=cur+t*change
            this.#onUpdate(this.#currentValue)
            if(t>=1){
                clearInterval(this.#currentInterval)
                this.#callback()
            }
        },dur/10)
    }
}
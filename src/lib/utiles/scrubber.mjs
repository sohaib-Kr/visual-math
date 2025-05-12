//the scrubber object creates a scrubbing effect
//it takes an initial data object, an animator function and a duration
//the animator function will be called in every frame of the animation
//the duration indicats how many seconds it takes for a 100 units of value change
export class Scrubber{
    #animator
    #duration
    #currentValue
    constructor({initialValue,animator,duration}){
        this.#currentValue=initialValue
        this.#animator=animator
        this.#duration=duration
    }
    play(target){
        let change=target-this.#currentValue
        let dur=Math.abs(change)/100*this.#duration
        let t=0
        let cur=this.#currentValue
        let interval=setInterval(()=>{
            t+=0.1
            this.#animator(cur+t*change)
            this.#currentValue=cur+t*change
            console.log(cur+t*change)
            if(t>=1){
                clearInterval(interval)
            }
        },dur/10)
    }
}
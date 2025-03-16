import {textStyles} from './textConfig.mjs'
export function shakeAnimation(element, degree, frequency, callback, delay) {
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
}


export function fadeNextStep(...args){
    let now = this.step;
    args.forEach(arg => {
        let I=setInterval(()=>{
            this.step==now+1 ? (arg.animate(500).attr({opacity: 0}).after(()=>arg.remove()), clearInterval(I)) : NaN;
        }, 100);
    });
}

export function fadeText(text){
    let textElement=this.frame.text(text).attr(textStyles.explanation);
    textElement.animate(300).attr({opacity: 1});
    return textElement
}

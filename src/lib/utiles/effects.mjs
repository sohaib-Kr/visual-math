import {textStyles} from './textConfig.mjs'
export function shakeAnimation({element, degree=3, frequency=100, callback=()=>{}, delay=0}) {
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
}

//this function schedules element to delete after the next step in vMathAnimation engine array
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

export function fadeBounce({shape, callback=()=>{}}){
    shape.transform({scale: [0.7, 0.7]});
    shape.animate({duration:300,easing:'<>'}).transform({scale: [1.3, 1.3]}).attr({opacity: 1})
    .animate({duration: 200}).transform({scale: [1, 1]})
    .animate({duration:200,easing:'<>'}).transform({scale: [1.1, 1.1]})
    .animate({duration: 100}).transform({scale: [1, 1]})
    .animate({duration:100,easing:'<>'}).transform({scale: [1.05, 1.05]})
    .animate({duration: 50}).transform({scale: [1, 1]})
    .after(callback)
    return shape
}

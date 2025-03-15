export function emphasize(draw,element){
    let emphasizeBackground=draw.rect(draw.width(),draw.height()).attr({
        fill:'#DAACF6',
        opacity: 0.3,
    })
    emphasizeBackground.after(element);
    let f=0;
    let I=setInterval(()=>{
        f+=1;
        element.attr({
            style:`filter: brightness(${f/53+1}) drop-shadow(0 0 ${f/3}px #D3D3D3);`,
        });
        f>10 ? clearInterval(I) : null;
    }, 10);
    return () => {
        emphasizeBackground.animate(200).attr({
            opacity: 0,
        }).after(() => emphasizeBackground.remove());
        element.attr({
            style:'',
        });
    }
}


export function shakeAnimation(draw,element, degree, frequency, callback, delay) {
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

function createDynamicText(draw,text){
    if(draw){
        let x = draw.text(function (add) {
            text.forEach((elem) => {
                add.tspan(elem);
            });
        });
        return x;
    }
}

function latex(draw,inputString,elem) {
    let holder=draw.foreignObject(100,50,'<div></div>')
    elem.appendChild(holder.node)
    return katex.render(inputString, holder.node, {
        throwOnError: false
    });
}

function createDynamicLatex(draw,text){
    if(draw){
        let  x=draw.group()
        text.forEach((elem) => {
            let holder=x.nested()
            latex(elem, holder.node)
        });
        return x;
    }
}
export {createDynamicText,latex,createDynamicLatex}
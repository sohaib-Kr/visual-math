function createDynamicText(text){
    let x = this.frame.text(function (add) {
        text.forEach((elem) => {
            add.tspan(elem);
        });
    });
    return x;
}

function latex(inputString,elem) {
    let holder=this.frame.foreignObject(100,50,'<div></div>')
    elem.appendChild(holder.node)
    return katex.render(inputString, holder.node, {
        throwOnError: false
    });
}

function createDynamicLatex(text){
    let  x=this.frame.group()
    text.forEach((elem) => {
        let holder=x.nested()
        this.latex(elem, holder.node)
    });
    return x;
}
export {createDynamicText,latex,createDynamicLatex}
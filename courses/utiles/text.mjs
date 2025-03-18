function createDynamicText(text){
    let x = this.frame.text(function (add) {
        text.forEach((elem) => {
            add.tspan(elem);
        });
    });
    return x;
}

function latex(inputString,parent,textStyle) {
    const regularText=inputString.split('/').filter((elem,index)=>index%2==0)
    const latexText=inputString.split('/').filter((elem,index)=>index%2==1)
    let result=document.createElement('p')
    regularText.forEach((elem,index)=>{
        result.innerHTML+=elem+'<span class="latex"></span>'
    })
    const latexSpanList=result.querySelectorAll('.latex')
    latexText.forEach((elem,index)=>{
        katex.render(elem, latexSpanList[index], {
            throwOnError: true,
            displayMode: false
        });
    })
    let holder=this.frame.foreignObject(1000,1000,'<div></div>')
    console.log(result)
    Object.assign(result.style,textStyle)
    holder.node.appendChild(result)
    parent.appendChild(holder.node)
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
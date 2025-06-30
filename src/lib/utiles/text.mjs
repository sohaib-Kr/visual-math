import katex from 'katex';
function createDynamicText(text){
    //separate the text into span tags to be able to manipulate them independently
    let x = this.frame.text(function (add) {
        text.forEach((elem) => {
            add.tspan(elem);
        });
    });
    return x;
}

function latex(inputString,parent,textStyle) {
    //here we separate the input string into regular text and latex text
    //regular text is the text that will be displayed as is
    //latex text is the text that will be rendered using katex
    //the input string should be a string of the form 'text/_text/_text'
    //where / is the separator between regular text and latex text
    if (process.env.NODE_ENV === 'development') {
        if (parent instanceof HTMLElement) {
            throw new Error('cannot create latex: parent does not exist')
        }
    }
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
    return holder
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
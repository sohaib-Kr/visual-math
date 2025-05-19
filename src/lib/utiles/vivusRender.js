import Vivus from 'vivus';


export function vivusRender({elem,duration=60}){
    let id='newIdNeverCreatedBefore'
    elem.id=id
    let originalStyle=Array.from(elem.children).map((child)=>child.style)
    new Vivus(id, {
        type: 'oneByOne',
        duration,
        animTimingFunction: Vivus.EASE_OUT,
        onReady:()=>{
            elem.id=''
            Array.from(elem.children).forEach((child,index)=>{
                child.style=originalStyle[index]
            })
        }
    })
    
}

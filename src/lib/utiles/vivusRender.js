import Vivus from 'vivus';


export function vivusRender({elem,duration=100}={}){
    let id='newIdNeverCreatedBefore'
    elem.id=id
    new Vivus(id, {
        type: 'sync',
        duration,
        animTimingFunction: Vivus.EASE_OUT,
        onReady:()=>{
            elem.id=''
        }},
        ()=>{
            console.log('complete')
            Array.from(elem.children).forEach((child,index)=>{
                child.style['stroke-dasharray']='none'
            })
        })
    
}

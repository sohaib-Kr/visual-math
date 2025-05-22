import Vivus from 'vivus';


export function vivusRender({elem,duration=100}={}){
    let id='newIdNeverCreatedBefore'
    elem.id=id

    new Vivus(id, {
        type: 'oneByOne',
        duration: duration,
        pathTimingFunction: Vivus.LINEAR, // Add this for consistent timing
        forceRender: true, // Ensure clean rendering
        onReady: function() {
            elem.id = '';
        },
    },
    ()=>{
        Array.from(elem.children).forEach((child,index)=>{
            child.style['stroke-dasharray']='none'
        })
    });
}

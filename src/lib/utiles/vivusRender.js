import Vivus from 'vivus';


export function vivusRender({elem,duration=50,callback=()=>{},onReady=()=>{}}={}){
    let id='newIdNeverCreatedBefore'
    elem.id=id
    let styles=[]
    Array.from(elem.children).forEach((child,index)=>{
        styles.push(child.style)
    })
    new Vivus(id, {
        type: 'oneByOne',
        duration: duration,
        pathTimingFunction: Vivus.LINEAR, // Add this for consistent timing
        onReady: function() {
            elem.id = '';
            onReady()
        },
    },
    ()=>{
        Array.from(elem.children).forEach((child,index)=>{
            child.style=styles[index]
        })
        callback()
    }
);
}

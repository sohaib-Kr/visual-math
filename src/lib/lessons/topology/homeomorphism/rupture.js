shape=snap.path('M 0 0 A 100 100 0 1 0 0 -1 L 70 -1 A 30 30 0 1 1 70 0 L 0 0').attr({fill:interiorColor})
line=snap.path('M 0 0 L 70 0').attr({stroke:interiorColor,strokeWidth:4})


shape.transform('t300,300')
line.transform('t300,300')

intersectAnimation=[
    'M 0 0 A 100 100 0 1 0 9 -38 L 76 -20 A 30 30 0 1 1 70 0 L 0 0',
    'M 0 0 A 100 100 0 1 0 0 -1 L 70 -1 A 30 30 0 1 1 70 0 L 0 0',
    'M 0 0 A 100 100 0 1 0 0 -1 L 100 -1 A 1 1 0 1 1 100 0 L 0 0'
]





var executes=[
()=>{
    i+=1
    i<executes.length ? (()=>{executes[i]();setTimeout(executes[0],delay)})() : NaN 
},
()=>{
    let i=0
    interval=setInterval(()=>{
        if(i<intersectAnimation.length){endPath=intersectAnimation[i]}
        else{
            clearInterval(interval)
            return null
        }
        i>0?shape.attr({d:intersectAnimation[i-1]}):NaN
        shape.animate({ d: endPath }, 800, mina.easelinear);
        i+=1
    },800)
}
]

window.onload=function(){
    executes[0]()
    snap.node.addEventListener('mousemove', updateMousePosition);
}
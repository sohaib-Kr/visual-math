shape=snap.path(`M 0 100
 A 100 100 0 0 0 100 0
 A 100 100 0 0 0 0 -100
 A 100 100 0 0 0 -100 0
 A 100 100 0 0 0 0 100`).attr({fill:interiorColor})
shape.transform('t300,300')

intersectAnimation=[
    `M 0 100
  L 100 0
  L 0 -100
  L -100 0
  L 0 100`,
  `M 0 100
  L 0 100
  L 0 -100
  L -100 0
  L 0 100`,
  `M 0 100
 L 100 0
 L 0 -100
 L -100 0
 Z`,
 `M 0 200
C 12.5 225 37.5 225 50 200
L 50 -200
C 37.5 -225 12.5 -225 0 -200
L 0 200`,
`M 0 200
C 12.5 225 37.5 225 50 200
C 50 -200 50 -200 -100 -200
C -133.33 -200  -133.33 -150  -100 -150
C 0 -150 0 -150 0 200`,
`M 0 200 
    C 12.5 225 37.5 225 50 200 
    C 49 -228 -121 -242 -150 0 
    C -150 30 -100 30 -106 2 
    C -100 -150 1 -171 0 200`,
'M 0 200 C 12.5 225 37.5 225 50 200 C 40 -277 -410 121 70 98 C 97 98 94 59 66 59 C -240 96 -25 -173 0 200',

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
import gsap from 'gsap'

let elems=document.getElementsByClassName('toolTipLink')
for(let elem of elems){
    let box=document.getElementById(`${elem.getAttribute('data-title')}toolTip`)
    elem.addEventListener('mouseover',function(){
        gsap.to(box,{duration:0.5,y:10,opacity:1})
        console.log(box)
    })
    elem.addEventListener('mouseout',function(){
        gsap.to(box,{duration:0.5,y:-10,opacity:0})
    })
}
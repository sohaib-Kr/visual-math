
//create the main shape and its cover
var center=[300,100]
var group=draw.group()
var mainCircle=group.circle(0).center(...center).fill(interiorColor)
var remainCircle=group.circle(0).center(...center).attr({opacity:0})
var openPoint=group.circle(0).center(...center).fill('white')
var cover=[]
var restCircles=[]
for (let i = 1; i < 5; i++) {
	let coverElem=group.group()
	coverElem.circle(0).center(...center).fill('purple').attr({'data-after':(0.5/i)*300})
	coverElem.circle(0).center(...center).fill('white')
	cover.push(coverElem)
}
for (let i = 0; i < 3; i++) {
	restCircles.push(group.circle(0).fill('purple'))
	restCircles.push(group.circle(0).fill('purple'))
	restCircles.push(group.circle(0).fill('purple'))

}
let coverElem=group.group()
coverElem.circle(0).center(...center).fill('purple').attr({'data-after':5})
coverElem.circle(0).center(...center).fill('white')
cover.push(coverElem)
group.translate(30,200)



// create text instances

var executes=[
()=>{
	i+=1
	i<executes.length ? (()=>{executes[i]();setTimeout(executes[0],delay)})() : NaN	
},
()=>{
	mainCircle.animate(500).attr({r:260}).animate(300).attr({r:200})
},
()=>{
	openPoint.animate(300).attr({r:6})
	arrow=createArrow(600,280,340,290,500,180,indicatorColor,true)
	text=group.text('this shape is not a circle, it is actually  a circle without its center point, thus not open nor closed').move(620,80)
},
()=>{
	text.remove()
	arrow.remove()
	text=group.text('we will try to construct a cover like the previous example').move(620,80)
},
()=>{
	text.remove()
	arrow.remove()
	text=draw.text('now we will construct a cover for the intervall S that is irreducible to a finite sub-cover').move(520,370)
},
()=>{
	text.remove()
	cover.forEach((elem)=>{
		elem.children()[1].animate(500).attr({r:elem.children()[0].attr('data-after')})
		elem.children()[0].animate(500).attr({r:200})
	})
},
()=>{
	cover.forEach((elem,index)=>{
		if(index<cover.length-1){
		    elem.animate(1100).move(500+100*index,-200)
		    elem.children().forEach((el)=>el.animate(900).scale(0.2))
		}
		else{
		    elem.animate(1100).move(1050,-200)
		    elem.children().forEach((el)=>el.animate(900).scale(0.2))
		}
	})
	restCircles.forEach((elem,index)=>{
		elem.move(900+30*index,cover[0].children()[0].cy()-200)
		    console.log(cover[0].children()[0].cx())
		elem.animate(400).attr({r:9})
	})
}
]

window.onload=function(){
	executes[0]()
	draw.node.addEventListener('mousemove', updateMousePosition);
}
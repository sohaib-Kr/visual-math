
var shape=draw.circle(200).fill(interiorColor).stroke({color:interiorColor,width:4,dasharray:'5,3'}).move(50,50)
var limit=draw.circle(200).fill('transparent').stroke({color:borderColor,width:4}).attr({'stroke-opacity':0}).move(50,50)
var executes=[
()=>{
	i+=1
	i<executes.length ? (()=>{executes[i]();setTimeout(executes[0],delay)})() : NaN
	
},
()=>{
	shape.animate(400).attr({stroke:indicatorColor})
	arrow=createArrow(550,360,260,160,450,180,indicatorColor)
	new Vivus('arrow',{
		type:'oneByOne',
		duration:40,
		animTimingFunction:Vivus.EASE_OUT,
	})
	text=draw.text('as we can see all the limit point do not belong to the circle.\nWhich is why it is considered an open subset')
	.move(570,380)
},
()=>{
	arrow.remove()
	text.remove()
	shape.animate(300).attr({stroke:interiorColor})
	arrow=createArrow(450,450,140,260,250,500,borderColor)
	new Vivus('arrow',{
		type:'oneByOne',
		duration:40,
		animTimingFunction:Vivus.EASE_OUT,
	})
	limit.animate(400).attr({'stroke-opacity':1})
	text=draw.text('now consider all the point that are adjacent to the circle (limit points)')
},
()=>{
	arrow.remove()
	text.remove()
	shape.animate(600).move(50,-50)
	limit.animate(800).move(50,300)
	text=draw.text('The exterior of S is the union of both its interior and its limit points denoted ext(S)\n ext(S)=limit(S)Uinter(S)').move(500,350)
},
()=>{
	shape.animate(600).move(50,50)
	limit.animate(800).move(50,50).animate().attr({stroke:interiorColor})
}
]
window.onload=function(){
	executes[0]()
	draw.node.addEventListener('mousemove', updateMousePosition);
}
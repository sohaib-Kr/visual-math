
var triangle=draw.symbol().polygon('0,0 200,0 200,200').move(0,20)
var interior=draw.use(triangle).fill(interiorColor).stroke({dasharray:'5,3',width:3}).attr({stroke:interiorColor})
var exterior=draw.polyline('40,0 200,0 200,140').fill('none').stroke({width:3,linejoin:'round'}).attr({stroke:interiorColor}).move(40,20)




var executes=[
()=>{
	i+=1
	i<executes.length ? (()=>{executes[i]();setTimeout(executes[0],delay)})() : NaN
	
},
()=>{
	exterior.animate(400).attr({stroke:indicatorColor})
	arrow=createArrow(450,150,220,20,300,0,indicatorColor)
	new Vivus('arrow',{
		type:'oneByOne',
		duration:40,
		animTimingFunction:Vivus.EASE_OUT,
	})
	text=draw.text('points on this border belongs to \n the subset').move(470,150)
},
()=>{
	interior.animate(400).attr({stroke:indicatorColor})
	exterior.animate(400).attr({stroke:interiorColor})
	arrow.remove()
	arrow=createArrow(300,300,110,150,130,280,indicatorColor)
	new Vivus('arrow',{
		type:'oneByOne',
		duration:40,
		animTimingFunction:Vivus.EASE_OUT,
	})
	text.remove()
	text=draw.text('points on this border do not belong to \n the subset').move(320,320)
},
()=>{
	text.remove()
	arrow.remove()
	text=draw.text('So we can identify two parts of this subset.All the points that are in the border of the triangle\n and All the points that are inside the triangle but not in its border')
	.move(400,300)
	interior.animate(500).attr({stroke:interiorColor})
},
()=>{
	text.remove()
	interior.animate(1000).move(300,70)
	exterior.animate(1000).move(340,370)
	text=draw.text('this is the part containing all the points that are inside the subset and not in its border.\nObviously this is an open subset as we saw here.it`s called the interior of S denoted interior(S)')
	.move(550,170)
	text=draw.text('this is the part containing all the points that are in the border of the triangle.\nObviously this is a closed subset as we saw here.it`s called the derived set of S denoted derived(S)')
	.move(550,420)
}
]
window.onload=function(){
	executes[0]()
	draw.node.addEventListener('mousemove', updateMousePosition);
}
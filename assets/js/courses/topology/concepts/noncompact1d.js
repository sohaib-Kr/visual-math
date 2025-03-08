
//create the main shape and its cover
var group=draw.group()
var mainSegment=group.line(0,0,0,0).stroke({color:'#d9d9d9',width:8,linecap:'round'})
var interval=group.line(200,0,200,0).stroke({color:interiorColor,width:8,linecap:'round'})
	var remainSegment=group.line(740,0,740,0).stroke({color:'green',width:8,linecap:'round'}).attr({opacity:0})
var closedCorner=group.circle(0).center(200,0).fill(interiorColor)
var openCorner=group.circle(0).center(800,0).fill('white').stroke({color:interiorColor,width:4})
var cover=[]
var restCircles=[]
for (let i = 1; i < 12; i++) {
	let coverElem=group.group()
	coverElem.line(170,0,170,0).stroke({color:'purple',width:8,linecap:'round'}).attr({'data-after':800-(1/i)*600})
	coverElem.circle(0).center(170,0).fill('white').stroke({color:'purple',width:2})
	coverElem.circle(0).center(800-(1/i)*600,0).fill('white').stroke({color:'purple',width:2})
	cover.push(coverElem)
}
let coverElem=group.group()
coverElem.line(170,0,170,0).stroke({color:'purple',width:8,linecap:'round'}).attr({'data-after':800})
coverElem.circle(0).center(170,0).fill('white').stroke({color:'purple',width:2})
coverElem.circle(0).center(800,0).fill('white').stroke({color:'purple',width:2})
cover.push(coverElem)
group.translate(30,200)



// create text instances
var limits=[
	group.text('0').move(200,-50),
	group.text('1').move(800,-50)
]




var executes=[
()=>{
	i+=1
	i<executes.length ? (()=>{executes[i]();setTimeout(executes[0],delay)})() : NaN	
},
()=>{
	mainSegment.animate(500).plot(0,0,1000,0)
},
()=>{
	interval.animate(500).plot(200,0,800,0)
},
()=>{
	closedCorner.animate(300).attr({r:15}).animate(200).attr({r:11})
	openCorner.animate(300).attr({r:15}).animate(200).attr({r:11})
	arrow=createArrow(500,370,390,220,360,330,interiorColor)

	new Vivus('arrow',{
		type:'oneByOne',
		duration:40,
		animTimingFunction:Vivus.EASE_OUT,
	})
	text=draw.text('consider this interval from 0 to 1 \nThis interval contains 0 but does not contain 1 so it`s not open nor closed').move(520,370)
},
()=>{
	text.remove()
	arrow.remove()
	text=draw.text('now we will construct a cover for the intervall S that is irreducible to a finite sub-cover').move(520,370)
},
()=>{
	text.remove()
},
()=>{
	cover.forEach((elem)=>{
		elem.children()[0].animate(500).plot(170,0,parseInt(elem.children()[0].attr('data-after')),0)
		elem.children()[1].animate(300).attr({r:15}).animate(200).attr({r:11})
		elem.children()[2].animate(300).attr({r:15}).animate(200).attr({r:11})
	})
},
()=>{
	group.animate(500).transform({translateY:-150},true)
	cover.forEach((elem,index)=>{
		index<cover.length-1 ? elem.animate(1000).dmove(0,30*(index+1)) :(
			restCircles=[group.circle(0).center(400,30*index+20).fill('purple').animate({duration:500,delay:1000}).attr({r:4}),
			group.circle(0).center(400,30*index+40).fill('purple').animate({duration:500,delay:1000}).attr({r:6}),
			group.circle(0).center(400,30*index+60).fill('purple').animate({duration:500,delay:1000}).attr({r:8})],
			elem.animate(1000).dmove(0,30*(index+1)+80) 
	)})
},
()=>{
	cover.forEach((elem,index)=>{
		index<cover.length-1 ? group.text('I'+index+' = ]-0.2,1-1/'+index+'[').move(40,30*index+20) :(
			group.text('union of all In').move(40,30*(index+1)+80)
	)
		
	})
},
()=>{
	group.find('text').forEach((elem)=>elem.remove())
},
()=>{
	draw.text('now it`s obvious that no matter how you choose you finite sub-cover it will never be enough to contain S\n the union of any finite collection of this intervals defined by In=]-0.2,1-1/n[ will be equal to the biggest interval in terms of inclusion\n which will never contain [0,1[').move(900,200)
},
()=>{
	cover[cover.length-1].children().forEach((elem)=>elem.animate(300).after(()=>elem.remove()).attr({opacity:0}))
	restCircles.forEach((elem)=>elem._element.animate(300).attr({opacity:0}))
},
()=>{
	cover.forEach((elem,index)=>{
		elem ? elem.animate(1000).dmove(0,-30*(index+1)):NaN
	})
},
()=>{
	remainSegment.attr({opacity:1})
	remainSegment.animate(500).plot(740,0,800,0)
	remainSegment.animate(700).dmove(0,100)
}
]

window.onload=function(){
	executes[0]()
	draw.node.addEventListener('mousemove', updateMousePosition);
}
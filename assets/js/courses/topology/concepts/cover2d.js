
//create the main shape and its cover
var cover=[]
for (let i = 0; i < 4; i++) {
	cover.push(draw.polygon('0,0 360,0 360,100 0,100').move(0,i*100).fill(coverColor))
}
var shape=draw.path('M150,50 C250,20, 350,50, 350,150 C350,250, 250,350, 150,350 C50,350, 20,250, 20,150 C20,50, 50,20, 150,50 Z')
.fill(interiorColor)



// create text instances

var text=draw.group()

var deltas=[]
for (let i = 0; i < 7; i++) {
	i%2==0 ? deltas.push({text:('delta'+(i/2+1)),attr:{opacity:0,class:'delta'}}) : deltas.push({text:' U ',attr:{opacity:0,class:'union'}})
}
var deltasEquation=createDynamicText(deltas).move(900,400)




var coverFamily=createDynamicText([{text:'{Ui}i<4',attr:{opacity:0}},{text:' < S',attr:{opacity:0}}]).move(deltasEquation.x(),deltasEquation.y())




var executes=[
()=>{
	i+=1
	i<executes.length ? (()=>{executes[i]();setTimeout(executes[0],delay)})() : NaN	
},



()=>{deltasEquation
	cover.forEach((elem,index)=>{
		elem.animate(1000).dmove(370,30*index)
		shakeAnimation(elem,3,100,()=>text.text(' alpha'+(index+1)).move(750,20+130*index),100*index)
	})
},


()=>{
	cover.forEach((elem,index)=>{elem.animate(1000).dmove(-370,-30*index)})
},


()=>{
    text.children().forEach((span,index)=>{
		let child=deltasEquation.children()[2*index]
		span.animate(500).move(child.x(),child.y())
	})
},
()=>{
	Array.from(SVG.find('.union')).forEach((elem)=>{
		elem.animate(600).attr({opacity:1})
	})
},
()=>{
	text.children().forEach((elem)=>{
		elem.animate(400).move(deltasEquation.x(),deltasEquation.y()).attr({opacity:0})
	})
	Array.from(SVG.find('.union')).forEach((elem)=>{
		elem.animate(400).move(deltasEquation.x(),deltasEquation.y()).attr({opacity:0})
	})
	coverFamily.children()[0].animate({duration:400,delay:200}).attr({opacity:1})
},
()=>{
	coverFamily.children()[1].animate({duration:400,delay:200}).attr({opacity:1})
}
]
window.onload=function(){
	executes[0]()
	draw.node.addEventListener('mousemove', updateMousePosition);
}
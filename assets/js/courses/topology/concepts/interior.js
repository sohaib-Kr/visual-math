const firstAnimation = new Animation('svgJs', 1200, 600, 'first', 'first');
{
	let { interiorColor, indicatorColor, borderColor, coverColor } = visualMath;	
	var draw=firstAnimation.frame
	let group=draw.group()
	let circle=group.circle(200).fill(interiorColor).center(0,0)
	let interior=group.circle(198)
	.fill('transparent')
	.stroke({width:4,dasharray:'3,5',})
	.attr({stroke:'white'}).center(0,0)

	let exterior=group.path('M 0 -99 A 100 100 0 0 1 99 0').fill('none').stroke({width:4,linejoin:'round'}).attr({stroke:borderColor})
	group.translate(200,200)

	// Define text content
	const texts = {
		borderPoints: 'points on this border belongs to \n the subset',
		nonBorderPoints: 'points on this border do not belong to \n the subset',
		explanation: 'So we can identify two parts of this subset.All the points that are in the border of the triangle\n and All the points that are inside the triangle but not in its border',
		interior: 'this is the part containing all the points that are inside the subset and not in its border.\nObviously this is an open subset as we saw here.it`s called the interior of S denoted interior(S)',
		limitPoints: 'this is the part containing all the points that are limit points inside the triangle.'
	};

	// Define text styles
	const textStyles = {
		main: {
			'font-family': 'Palatino, serif',
			'font-size': 20,
			'font-weight': 300,
			'fill': '#2A9D8F',
			'leading': 1.4
		},
		explanation: {
			'font-family': 'Palatino, serif',
			'font-size': 22,
			'font-weight': 500,
			'fill': '#264653',
			'leading': 1.6
		}
	};

	firstAnimation.initSteps([
	()=>{},
()=>{
	firstAnimation.junk(
		arrowSvg(450,150,310,170,360,150,indicatorColor,true),
		draw.text(texts.borderPoints)
			.move(470,150)
			.attr(textStyles.main)
	)
},
()=>{},
()=>{
	firstAnimation.junk(
		arrowSvg(450,350,200,310,300,380,indicatorColor,true),
		draw.text(texts.nonBorderPoints)
			.move(470,350)
			.attr(textStyles.main)
	)
},
()=>{},
()=>{
	firstAnimation.junk(
		draw.text(texts.explanation)
			.move(400,300)
			.attr(textStyles.explanation)
	)
},
()=>{
	group.animate(1000).dx(200)
	exterior.animate(1000).dy(300)
	draw.text(texts.interior)
		.move(600,200)
		.attr(textStyles.explanation)
	draw.text(texts.limitPoints)
		.move(600,450)
		.attr(textStyles.explanation)
}
])
}
window.onload=function(){
	firstAnimation.engine[0]()
	draw.node.addEventListener('mousemove', updateMousePosition);
}
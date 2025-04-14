import { vMathAnimation, textStyles } from '../../../library.js';

export const anim = new vMathAnimation(1200, 800, 'first', 'first');
{
	// ===== CONFIGURATION =====
	const { interiorColor, borderColor} = anim.colorConfig();
	const draw = anim.frame;

	// ===== TEXT CONTENT =====


	// ===== SHAPE CREATION =====
	const center = [300, 100];
	const group = draw.group();

	// Create main circle
	const mainCircle = group.circle(0)
		.center(...center)
		.fill(interiorColor);

	// Create point
	let pos={cx:350,cy:100}
	const point = group.circle(0)
		.attr(pos)
		.fill(borderColor)

	const openBall=group.circle(0)
	.attr(pos)
	.fill('transparent')
	.stroke({color:borderColor,width:2,dasharray:'2,2'})




	// Position group
	group.translate(30, 200);

	// ===== ANIMATION STEPS =====
	anim.initSteps([
		// Initial state
		() => {},

		// Draw main circle
		() => {
			mainCircle.animate(500).attr({ r: 250 }).animate(300).attr({ r: 200 });
		},

		() => {
			point.animate(300).attr({ r: 6 });
		},
		()=>{
			openBall.animate(300).attr({r:70})
		},

		//first transition
		()=>{
			openBall.animate(400).attr({opacity:0})
			point.animate(400).attr({opacity:0})
		},
		()=>{
			pos.cx=450
			point.attr(pos).animate(400).attr({opacity:1})
		},
		()=>{
			mainCircle.animate(400).transform({relative:true,translate:[-150,0]}).attr({r:400})
		},
		()=>{
			openBall.attr({r:40}).attr(pos).animate(400).attr({opacity:1})
		},




		//second transition
		()=>{
			openBall.animate(400).attr({opacity:0})
			point.animate(400).attr({opacity:0})
		},
		()=>{
			pos.cx=490
			point.attr(pos).animate(400).attr({opacity:1})
		},
		()=>{
			mainCircle.animate(400).transform({relative:true,translate:[-50,0]}).attr({r:500})
		},
		()=>{
			openBall.attr({r:40}).attr(pos).animate(400).attr({opacity:1})
		},




		//third transition
		()=>{
			openBall.animate(400).attr({opacity:0})
			point.animate(400).attr({opacity:0})
		},
		()=>{
			pos.cx=520
			point.attr(pos).animate(400).attr({opacity:1})
		},
		()=>{
			mainCircle.animate(400).transform({relative:true,translate:[-50,0]}).attr({r:600})
		},
		()=>{
			openBall.attr({r:40}).attr(pos).animate(400).attr({opacity:1})
		},





	]);
}

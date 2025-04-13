import { Animation, textStyles } from '../../../library.js';

const anim = new Animation(1200, 600, 'first', 'first');
{
	// ===== CONFIGURATION =====
	const { interiorColor, indicatorColor, borderColor } = anim.colorConfig();
	let draw = anim.frame;

	// ===== TEXT CONTENT =====
	const texts = {
		borderPoints: 'points on this border belongs to \n the subset',
		nonBorderPoints: 'points on this border do not belong to \n the subset',
		explanation: 'So we can identify two parts of this subset.\n All the points that are in the border of the triangle\n' +
					'and All the points that are inside the triangle but not in its border',
		interior:String.raw`this is the part containing all the points that are 
		inside the subset and not in its border.
			Obviously this is an open subset as we saw here.
			It is called The interior of /S/ also denoted by /S^\circ/`,
		limitPoints: 'this is the part containing all the points that are limit points inside the triangle.'
	};


	// ===== SHAPE CREATION =====
	const group = draw.group();

	// Create main circle
	const circle = group.circle(200)
		.fill(interiorColor)
		.center(0, 0)
		.stroke({width:4, color: interiorColor,dasharray: '5,5'})
		.attr({opacity: 0});

	// Create exterior path
		const exterior=draw.defs().group()
		const exteriorCircle=exterior.circle(200).center(0, 0)
		.fill('none')
		.stroke({width:4, color: borderColor,linejoin: 'round'})
		.attr({opacity: 0});
		const exteriorClipper=exterior.polygon([[0,0],[200,0],[0,-200]]).fill('yellow')
		exteriorCircle.clipWith(exteriorClipper)
		const exteriorResult=group.use(exterior).center(0, 0)

	// Position group
	group.translate(200, 200);

	// ===== ANIMATION STEPS =====
	anim.initSteps([
		// Initial state
		() => {},
		()=> {
			anim.fadeBounce(circle)
			anim.fadeBounce(exteriorCircle)
		},
		// Show border points
		() => {
			anim.fadeNextStep(
				anim.arrow(450, 150, 310, 170, 360, 150, indicatorColor, true),
				anim.fadeText(texts.borderPoints)
					.move(470, 150)
					.attr(textStyles.explanation)
			);
		},

		// Transition
		() => {},

		// Show non-border points
		() => {
			anim.fadeNextStep(
				anim.arrow(450, 350, 200, 310, 300, 380, indicatorColor, true),
				anim.fadeText(texts.nonBorderPoints)
					.move(470, 350)
					.attr(textStyles.explanation)
			);
		},

		// Transition
		() => {},

		// Show explanation
		() => {
			anim.fadeNextStep(
				anim.fadeText(texts.explanation)
					.move(400, 300)
					.attr(textStyles.explanation)
			);
		},

		// Final state
		() => {
			group.animate(1000).translate(30,-30);
			exteriorResult.animate(1000).move(0,350);
			
			const interior=draw.nested()
				.move(400, 130)
				
			anim.fadeText(texts.limitPoints)
				.move(400, 460)
				.attr(textStyles.explanation);
			anim.latex(texts.interior, interior.node,textStyles.latex)
		}

	]);
}
 
// ===== EVENT HANDLERS =====
window.onload = function() {
	anim.engine[0]();
	
	const handleMouseMove = (event) => {
		anim.updateMousePosition(event);
	};
	
	anim.frame.node.addEventListener('mousemove', handleMouseMove);
};
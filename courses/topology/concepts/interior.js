import { Animation, textStyles } from '../../library.js';

const firstAnimation = new Animation(1200, 600, 'first', 'first');
{
	// ===== CONFIGURATION =====
	const { interiorColor, indicatorColor, borderColor } = firstAnimation.colorConfig();
	var draw = firstAnimation.frame;

	// ===== TEXT CONTENT =====
	const texts = {
		borderPoints: 'points on this border belongs to \n the subset',
		nonBorderPoints: 'points on this border do not belong to \n the subset',
		explanation: 'So we can identify two parts of this subset. All the points that are in the border of the triangle\n' +
					'and All the points that are inside the triangle but not in its border',
		interior: 'this is the part containing all the points that are inside the subset and not in its border.\n' +
				 'Obviously this is an open subset as we saw here. It\'s called the interior of S denoted interior(S)',
		limitPoints: 'this is the part containing all the points that are limit points inside the triangle.'
	};


	// ===== SHAPE CREATION =====
	const group = draw.group();

	// Create main circle
	const circle = group.circle(200)
		.fill(interiorColor)
		.center(0, 0);

	// Create interior circle
	const interior = group.circle(198)
		.fill('transparent')
		.stroke({
			width: 4,
			dasharray: '3,5'
		})
		.attr({ stroke: 'white' })
		.center(0, 0);

	// Create exterior path
	const exterior = group.path('M 0 -99 A 100 100 0 0 1 99 0')
		.fill('none')
		.stroke({
			width: 4,
			linejoin: 'round'
		})
		.attr({ stroke: borderColor });

	// Position group
	group.translate(200, 200);

	// ===== ANIMATION STEPS =====
	firstAnimation.initSteps([
		// Initial state
		() => {},

		// Show border points
		() => {
			firstAnimation.fadeNextStep(
				firstAnimation.arrow(450, 150, 310, 170, 360, 150, indicatorColor, true),
				draw.text(texts.borderPoints)
					.move(470, 150)
					.attr(textStyles.explanation)
			);
		},

		// Transition
		() => {},

		// Show non-border points
		() => {
			firstAnimation.fadeNextStep(
				firstAnimation.arrow(450, 350, 200, 310, 300, 380, indicatorColor, true),
				draw.text(texts.nonBorderPoints)
					.move(470, 350)
					.attr(textStyles.explanation)
			);
		},

		// Transition
		() => {},

		// Show explanation
		() => {
			firstAnimation.fadeNextStep(
				draw.text(texts.explanation)
					.move(400, 300)
					.attr(textStyles.explanation)
			);
		},

		// Final state
		() => {
			group.animate(1000).dx(200);
			exterior.animate(1000).dy(300);
			
			draw.text(texts.interior)
				.move(600, 200)
				.attr(textStyles.explanation);
				
			draw.text(texts.limitPoints)
				.move(600, 450)
				.attr(textStyles.explanation);
		}
	]);
}

// ===== EVENT HANDLERS =====
window.onload = function() {
	firstAnimation.engine[0]();
	
	const handleMouseMove = (event) => {
		firstAnimation.updateMousePosition(event);
	};
	
	draw.node.addEventListener('mousemove', handleMouseMove);
};
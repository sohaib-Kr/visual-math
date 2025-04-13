import { vMathAnimation, textStyles } from '../../../library.js';

export const anim = new vMathAnimation(1200, 800, 'first', 'first');
{
	// ===== CONFIGURATION =====
	const { interiorColor, indicatorColor,coverColor,mainSegmentColor,segmentColor,segmentBorderColor,coverSegmentColor,coverSegmentBorderColor } = anim.colorConfig();
	const draw = anim.frame;

	// ===== TEXT CONTENT =====
	const texts = {
		initial: 'consider this interval from 0 to 1 \nThis interval contains 0 but does not contain 1 so it\'s not open nor closed',
		coverIntro: 'now we will construct a cover for the interval S \n that is irreducible to a finite sub-cover',
		conclusion: 'we can deduce that no matter how you choose you finite sub-cover it will never be enough to contain S\n' +
				   'the union of any finite collection of this intervals defined by /I_n=]-0.2,1-\\frac{1}{n}[/ will be equal to the biggest\n interval in terms of inclusion\n' +
				   'which will never contain [0,1['
	};

	// ===== SHAPE CREATION =====
	const group = draw.group();

	// Create main segment
	const mainSegment = group.line(0, 0, 0, 0)
		.stroke({ color: mainSegmentColor, width: 8, linecap: 'round' });

	// Create interval
	const interval = group.line(200, 0, 200, 0)
		.stroke({ color: segmentColor, width: 8, linecap: 'round' });

	// Create remaining segment
	const remainSegment = group.line(740, 0, 740, 0)
		.stroke({ color: segmentColor, width: 8, linecap: 'round' })
		.attr({ opacity: 0 });

	// Create corners
	const closedCorner = group.circle(0)
		.center(200, 0)
		.fill(segmentColor);

	const openCorner = group.circle(0)
		.center(800, 0)
		.fill(segmentBorderColor)
		.stroke({ color: segmentColor, width: 4 });

	// Create cover elements
	const cover = [];
	const restCircles = [];
	
	for (let i = 1; i < 12; i++) {
		const coverElem = group.group();
		coverElem.line(170, 0, 170, 0)
			.stroke({ color: coverSegmentColor, width: 8, linecap: 'round' })
			.attr({ 'data-after': 800 - (1/i) * 600 });
		coverElem.circle(0)
			.center(170, 0)
			.fill(coverSegmentBorderColor)
			.stroke({ color: coverSegmentColor, width: 2 });
		coverElem.circle(0)
			.center(800 - (1/i) * 600, 0)
			.fill(coverSegmentBorderColor)
			.stroke({ color: coverSegmentColor, width: 2 });
		cover.push(coverElem);
	}

	// Add final cover element
	const finalCoverElem = group.group();
	finalCoverElem.line(170, 0, 170, 0)
		.stroke({ color: coverColor, width: 8, linecap: 'round' })
		.attr({ 'data-after': 800 });
	finalCoverElem.circle(0)
		.center(170, 0)
		.fill('white')
		.stroke({ color: coverColor, width: 2 });
	finalCoverElem.circle(0)
		.center(800, 0)
		.fill('white')
		.stroke({ color: coverColor, width: 2 });
	cover.push(finalCoverElem);

	// Position group
	group.translate(30, 200);

	// Create text instances
	const limits = [
		group.text('0').move(200, -50),
		group.text('1').move(800, -50)
	];

	// ===== ANIMATION STEPS =====
	anim.initSteps([
		// Initial state
		() => {},

		// Draw main segment
		() => {
			mainSegment.animate(500).plot(0, 0, 1000, 0);
		},

		// Draw interval
		() => {
			interval.animate(500).plot(200, 0, 800, 0);
		},

		// Show corners and initial text
		() => {
			closedCorner.animate(300).attr({ r: 15 }).animate(200).attr({ r: 11 });
			openCorner.animate(300).attr({ r: 15 }).animate(200).attr({ r: 11 });
			anim.fadeNextStep(
				anim.arrow(500, 370, 390, 220, 360, 330, indicatorColor, true),
				anim.fadeText(texts.initial)
					.move(520, 370)
					.attr(textStyles.explanation)
			);
		},

		// Show cover introduction
		() => {
			anim.fadeNextStep(
				anim.fadeText(texts.coverIntro)
					.move(520, 370)
					.attr(textStyles.explanation)
			);
		},

		// Draw cover elements
		() => {
			cover.forEach((elem) => {
				elem.children()[0].animate(500).plot(170, 0, parseInt(elem.children()[0].attr('data-after')), 0);
				elem.children()[1].animate(300).attr({ r: 15 }).animate(200).attr({ r: 11 });
				elem.children()[2].animate(300).attr({ r: 15 }).animate(200).attr({ r: 11 });
			});
		},

		// Move cover elements and add rest circles
		() => {
			group.animate(500).transform({ translateY: -150 }, true);

			cover.forEach((elem, index) => {
				if (index < cover.length - 1) {
					elem.animate(1000).dmove(0, 30 * (index + 1));
				} else {
					restCircles.push(
						group.circle(0).center(400, 30 * index + 20).fill(coverSegmentColor).animate({ duration: 500, delay: 1000 }).attr({ r: 4 }),
						group.circle(0).center(400, 30 * index + 40).fill(coverSegmentColor).animate({ duration: 500, delay: 1000 }).attr({ r: 6 }),
						group.circle(0).center(400, 30 * index + 60).fill(coverSegmentColor).animate({ duration: 500, delay: 1000 }).attr({ r: 8 })
					);
					elem.animate(1000).dmove(0, 30 * (index + 1) + 80);
				}
			});
		},

		()=>{},
		// Remove final cover element and rest circles
		() => {
			
			cover[cover.length - 1].children().forEach((elem) => 
				elem.animate(300).after(() => elem.remove()).attr({ opacity: 0 })
			);
			restCircles.forEach((elem) => 
				elem._element.animate(300).attr({ opacity: 0 })
			);
		},

		// Reset cover positions
		() => {
			cover.forEach((elem, index) => {
				if (elem) {
					elem.animate(1000).dmove(0, -30 * (index + 1));
				}
			});
			group.animate({delay: 300,duration: 1000}).transform({ translateY: 150 }, true);
		},

		// Show remaining segment
		() => {
			remainSegment.attr({ opacity: 1 });
			remainSegment.animate(500).plot(740, 0, 800, 0);
			remainSegment.animate(700).dmove(0, 100);
		},
		()=>{
			anim.arrow(280, 450, 750, 310, 500, 300, indicatorColor, true)
			let holder=draw.nested()
				.move(50, 470)
				.attr({opacity:0})
			anim.latex(texts.conclusion,holder.node,textStyles.latex)
			holder.animate(300).attr({opacity:1})

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
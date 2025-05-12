import { vMathAnimation, textStyles } from '@/lib/library.js';

export const anim = new vMathAnimation(1200, 800, 'first', 'first');
{
	// ===== CONFIGURATION =====
	const { interiorColor, indicatorColor, coverColor, backgroundColor} = anim.colorConfig();
	const draw = anim.frame;

	// ===== TEXT CONTENT =====
	const texts = {
		initial: 'this shape is not a circle, it is actually a circle without its center point, thus not open nor closed',
		coverIntro: 'we will try to construct a cover like the previous example',
		conclusion: 'now we will construct a cover for the interval S that is irreducible to a finite sub-cover'
	};

	// ===== SHAPE CREATION =====
	const center = [300, 100];
	const group = draw.group();

	// Create main circle
	const mainCircle = group.circle(0)
		.center(...center)
		.fill(interiorColor);

	// Create remaining circle
	const remainCircle = group.circle(0)
		.center(...center)
		.attr({ opacity: 0 });

	// Create open point
	const openPoint = group.circle(0)
		.center(...center)
		.fill(backgroundColor)

	// Create cover elements
	const cover = [];
	const restCircles = [];

	// Create initial cover elements
	for (let i = 1; i < 5; i++) {
		const coverElem = group.group();
		coverElem.circle(0)
			.center(...center)
			.fill(coverColor)
			.attr({ 'data-after': (0.5/i) * 300 });
		coverElem.circle(0)
			.center(...center)
			.fill(backgroundColor)
		cover.push(coverElem);
	}

	// Create rest circles
	for (let i = 0; i < 3; i++) {
		restCircles.push(
			group.circle(0).fill(coverColor)
		);
	}

	// Add final cover element
	const finalCoverElem = group.group();
	finalCoverElem.circle(0)
		.center(...center)
		.fill(coverColor)
		.attr({ 'data-after': 5 });
	finalCoverElem.circle(0)
		.center(...center)
		.fill(backgroundColor)
	cover.push(finalCoverElem);

	// Position group
	group.translate(30, 200);

	// ===== ANIMATION STEPS =====
	anim.initSteps([
		// Initial state
		() => {},

		// Draw main circle
		() => {
			mainCircle.animate(500).attr({ r: 260 }).animate(300).attr({ r: 200 });
		},

		// Show open point and initial text
		() => {
			openPoint.animate(300).attr({ r: 6 });
			anim.fadeNextStep(
				anim.arrow(600, 280, 340, 290, 500, 180, indicatorColor, true),
				anim.fadeText(texts.initial)
					.move(620, 80)
					.attr(textStyles.explanation)
			);
		},

		// Show cover introduction
		() => {
			anim.fadeNextStep(
				anim.fadeText(texts.coverIntro)
					.move(620, 80)
					.attr(textStyles.explanation)
			);
		},

		// Show conclusion
		() => {
			anim.fadeNextStep(
				anim.fadeText(texts.conclusion)
					.move(520, 370)
					.attr(textStyles.explanation)
			);
		},

		// Draw cover elements
		() => {
			cover.forEach((elem) => {
				elem.children()[1].animate(500).attr({ r: elem.children()[0].attr('data-after') });
				elem.children()[0].animate(500).attr({ r: 200 });
			});
		},

		// Move cover elements and add rest circles
		() => {
			cover.forEach((elem, index) => {
				if (index < cover.length - 1) {
					elem.animate(1100).move(500 + 100 * index, -200);
					elem.children().forEach((el) => el.animate(900).scale(0.2));
				} else {
					elem.animate(1100).move(1050, -200);
					elem.children().forEach((el) => el.animate(900).scale(0.2));
				}
			});
			restCircles.forEach((elem, index) => {
				elem.move(940 + 30 * index, cover[0].children()[0].cy() - 260);
				elem.animate({duration:400,delay:400*index+1100}).attr({ r: 5+3*index });
			});
		},
		()=>{},
		()=>{
			cover.forEach((elem,index)=>index !=3 ? elem.animate(1100).attr({opacity:0}).after(()=>elem.node.remove()):null);
			restCircles.forEach((elem,index)=>{
				elem.animate(1100).attr({opacity:0}).after(()=>elem.node.remove());
			});
		},
		()=>{
			console.log(cover[3])
			cover[3].animate(800).center(...center).animate().scale(5)
		}
	]);
}

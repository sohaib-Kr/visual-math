import { Animation, textStyles } from './library.js';

const firstAnimation = new Animation(1200, 500, 'first', 'first');
{
    // ===== CONFIGURATION =====
    const { interiorColor, indicatorColor, borderColor, coverColor } = firstAnimation.colorConfig();
    var draw = firstAnimation.frame;

    // ===== TEXT CONTENT =====
    const texts = {
        introduction: 'this is the set S, a closed interval. \n we will try to construct an infinite open cover for S.',
        explanation: 'We will use an infinite family of open disks to cover the interval S.\n' +
                    'The dashed circle around the disks indicates the open boundary of the disk.',
        infinite: 'There exist an infinite number of open disks.',
        conclusion: 'We can consider this family of sets (disks) as a subcover of S. thus, S is compact.'
    };

    // ===== SHAPE CREATION =====
    const group = draw.group();

    // Create covers
    const cover = [];
    for(let i = 0; i < 12; i++) {
        cover.push(group.circle(100)
            .center(i * 90, 0)
            .stroke({
                color: coverColor,
                width: 3,
                dasharray: "6,2"
            })
            .fill({ color: coverColor })
            .attr({ opacity: 0 })
        );
    }

    // Create main segment and interval
    const mainSegment = group.line(0, 0, 1000, 0)
        .stroke({
            color: '#d9d9d9',
            width: 8,
            linecap: 'round'
        })
        .attr({ opacity: 0 });

    const interval = group.line(200, 0, 200, 0)
        .stroke({
            color: '#874CC3',
            width: 8,
            linecap: 'round'
        })
        .attr({ opacity: 0 });

    // Position group
    group.translate(100, 300);

    // ===== ANIMATION STEPS =====
    firstAnimation.initSteps([
        // Show main segment
        () => {
            mainSegment.animate(500).attr({ opacity: 1 });
        },

        // Show interval
        () => {
            interval.animate(200)
                .attr({ opacity: 1 })
                .delay(200)
                .plot(200, 0, 700, 0);
        },

        // Show introduction
        () => {
            firstAnimation.fadeNextStep(
                firstAnimation.arrow(600, 150, 500, 270, 450, 150, indicatorColor, true),
                draw.text(texts.introduction)
                    .move(630, 150)
                    .attr(textStyles.explanation)
            );
        },

        // Show first cover
        () => {
            cover[0].move(100, -200).scale(1.3);
            cover[0].animate(500).attr({ opacity: 1 });
        },

        // Show explanation
        () => {
            firstAnimation.fadeNextStep(
                draw.text(texts.explanation)
                    .move(350, 140)
                    .attr(textStyles.explanation)
            );
        },

        // Reposition first cover
        () => {
            cover[0].animate(500)
                .transform({ scale: 1 })
                .center(0, 0);
        },

        // Show remaining covers
        () => {
            cover.filter((elem, index) => index != 0)
                .forEach((elem, index) => {
                    elem.animate(500)
                        .attr({ opacity: 1 })
                        .delay(200 * index);
                });
        },

        // Show infinite text
        () => {
            firstAnimation.fadeNextStep(
                firstAnimation.arrow(300, 200, 700, 200, 500, 200, coverColor, true),
                draw.text(texts.infinite)
                    .move(300, 140)
                    .attr(textStyles.explanation)
            );
        },

        // Fade some covers
        () => {
            cover.filter((elem, index) => index < 2 || index > 8)
                .forEach((elem) => {
                    elem.animate(500).attr({ opacity: 0.5 });
                });
        },

        // Transition
        () => {},

        // Show conclusion
        () => {
            firstAnimation.fadeNextStep(
                draw.text(texts.conclusion)
                    .move(300, 140)
                    .attr(textStyles.explanation)
            );
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
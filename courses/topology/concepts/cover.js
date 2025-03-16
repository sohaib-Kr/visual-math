import { Animation, textStyles } from './library.js';

const firstAnimation = new Animation(1000, 500, 'first', 'first');
{
    // ===== CONFIGURATION =====
    const { interiorColor, indicatorColor, borderColor, coverColor } = firstAnimation.colorConfig();
    const draw = firstAnimation.frame;

    // ===== TEXT CONTENT =====
    const texts = {
        introduction: 'this is the set S',
        deltas: ['\\alpha_{1}', '\\alpha_{2}', '\\alpha_{3}'],
        unions: '\\cup',
        coverFamily: {
            set: '\\{U_i\\}_{i<4 }',
            relation: '\\supset S'
        }
    };


    // Create covers
    const cover = [];
    for (let i = 0; i < 3; i++) {
        cover.push(
            draw.polygon('0,0 270,0 270,100 0,100')
                .move(0, i * 100)
                .fill(coverColor)
        );
    }

    
    // ===== SHAPE CREATION =====
    // Create main shape
    const shape = draw.path('M 150 50 C 180 0 315 119 218 140 C 163 150 277 269 139 274 C 4 266 94 210 23 162 C -41 100 92 127 150 50 Z')
    .fill(interiorColor);
    

    // ===== TEXT GROUPS =====
    // Create alpha text group
    const textGroup = draw.group().attr({ opacity: 0 });
    cover.forEach((elem, index) => {
        const holder = textGroup.nested();
        holder.move(680, 20 + 130 * index);
        firstAnimation.latex(texts.deltas[index], holder.node);
    });

    // Create equation elements
    const deltas = [];
    for (let i = 0; i < 5; i++) {
        i % 2 == 0 
            ? deltas.push('a_' + (i/2 + 1))
            : deltas.push('U_');
    }
    
    const deltasEquation = firstAnimation.createDynamicText(deltas)
        .move(500, 400)
        .attr({ opacity: 0 });

    const latexDeltas = firstAnimation.createDynamicLatex(
        deltas.filter((elem, index) => index % 2 == 1)
            .map(() => texts.unions)
    ).attr({ opacity: 0 });

    // Position union symbols
    latexDeltas.children().forEach((elem, index) => {
        elem.x(deltasEquation.children()[2 * index + 1].x());
        elem.y(deltasEquation.children()[2 * index + 1].y());
    });

    // Create cover family elements
    const coverFamily = firstAnimation.createDynamicText(['{Ui}_____', 'U S'])
        .move(500, 400);
    coverFamily.children().forEach((elem) => {
        elem.attr({ opacity: 0 });
    });

    const latexCoverFamily = firstAnimation.createDynamicLatex([
        texts.coverFamily.set,
        texts.coverFamily.relation
    ]);
    latexCoverFamily.children().forEach((elem, index) => {
        elem.x(coverFamily.children()[index].x());
        elem.y(coverFamily.children()[index].y());
        elem.attr({ opacity: 0 });
    });

    // ===== ANIMATION STEPS =====
    firstAnimation.initSteps([
        // Initial state
        () => {},

        // Show set S
        () => {
            firstAnimation.fadeNextStep(
                firstAnimation.arrow(400, 300, 200, 200, 300, 200, indicatorColor, true),
                draw.text(texts.introduction)
                    .move(450, 300)
                    .attr(textStyles.explanation)
            );
        },

        // Move covers
        () => {
            cover.forEach((elem, index) => {
                elem.animate(1000).dmove(370, 30 * index);
                firstAnimation.shakeAnimation(elem, 3, 100, () => {}, 100 * index);
            });
        },

        // Show alpha text
        () => {
            textGroup.animate(500).attr({ opacity: 1 });
        },

        // Reset covers
        () => {
            cover.forEach((elem, index) => {
                elem.animate(1000).dmove(-370, -30 * index);
            });
        },

        // Move text to equation
        () => {
            textGroup.children().forEach((span, index) => {
                const child = deltasEquation.children()[2 * index];
                span.animate(500).move(child.x(), child.y());
            });
        },

        // Show union symbols
        () => {
            latexDeltas.animate(500).attr({ opacity: 1 });
            for(let i = 1; i < 5; i += 2) {
                deltasEquation.children()[i].animate(500).attr({ opacity: 1 });
            }
        },

        // Transition to cover family
        () => {
            textGroup.children().forEach((elem) => {
                elem.animate(400)
                    .move(deltasEquation.x(), deltasEquation.y())
                    .attr({ opacity: 0 });
            });
            
            latexDeltas.animate(500).attr({ opacity: 0 });
            latexCoverFamily.children()[0]
                .animate({ duration: 400, delay: 200 })
                .attr({ opacity: 1 });
        },

        // Show final relation
        () => {
            latexCoverFamily.children()[1]
                .animate({ duration: 400, delay: 200 })
                .attr({ opacity: 1 });
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

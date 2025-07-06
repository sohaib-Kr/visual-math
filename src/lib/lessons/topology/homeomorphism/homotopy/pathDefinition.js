import { CartPlane } from '@/lib/utiles/vector/index.js';
import { vMathAnimation } from '@/lib/library.js';
import gsap from 'gsap';


const anim = new vMathAnimation('pathDefinition');

anim.setInit(function() {
    const draw = anim.frame;
    const plane = new CartPlane({ draw, unit: { u: 30, v: 30 } });
    const config = anim.config();

    // Create main path
    let mainPath = anim.elements.dynamicPath({
        codedPath: `M |a| C |b| |c| |d|`,
        initialData: { a: [0, 0], b: [0, 0], c: [100, 0], d: [100, 0] },
        attr: config.path1
    });

    // Create shadow group and append main path
    let mainPathShadowGroup = mainPath.group.clone().addTo(plane.plane);
    let mainPathShadow = mainPathShadowGroup.children()[0];
    plane.append(mainPath.group);

    // Create second path
    let secondPath = anim.elements.dynamicPath({
        codedPath: `M |a| C |b| |c| |d| C |e| |f| |g|`,
        initialData: { a: [0, 0], b: [0, 0], c: [100, 0], d: [0, 0], e: [100, 0], f: [100, 0], g: [100, 0] },
        attr: config.path1
    });
    plane.append(secondPath.group);

    // Initialize variables
    let textHolder;
    let lambdaHolder;

    // Create lambda indicators and text
    let lambda1Indicator = plane.plane.circle(0).attr({ fill: '#ff778a' }).center(400, -250);
    let lambda2Indicator = plane.plane.circle(0).attr({ fill: '#ff778a' }).center(100, -100);
    let lambda1text = anim.elements.latexText({inputString:'/\\lambda(1)',textStyle:{ fontFamily: 'poppins', fontSize: '20px', color: '#ff99a7' }})
        .move(430, -250).attr({ opacity: 0 });
    let lambda2text = anim.elements.latexText({inputString:'/\\lambda(0)',textStyle:{ fontFamily: 'poppins', fontSize: '20px', color: '#ff99a7' }})
        .move(40, -140).attr({ opacity: 0 });
    plane.append(lambda1text)
    plane.append(lambda2text)

    // Create arrow holder
    let arrowHolder = anim.elements.dynamicPath({
        codedPath: `M |a| L |b|`,
        initialData: { a: [0, 0], b: [100, -100] },
        attr: config.indicationLine
    });
    plane.append(arrowHolder.group);

    // Create indicators
    let mainPathIndicator = plane.plane.circle()
        .attr({ ...config.indicationPoint, opacity: 0 })
        .center(100, -100);

    let shadowPathIndicator = plane.plane.circle()
        .attr({ ...config.indicationPoint, opacity: 0 })
        .center(0, 0);
        let emph

    plane.append(shadowPathIndicator);
// Initialize animation steps
anim.initSteps([
    () => {
        textHolder = anim.sideBar.createText();
        textHolder.update({
            newText: 'Here are examples of different paths in the plane |',
            fade: true,
            callback: () => {
                textHolder.addLatex(['R^2']);
            }
        });
        
        anim.effects.vivus({
            elem: mainPath.group.node,
            onReady: () => {
                mainPath.shape.attr({ opacity: 1 });
            }
        });
        
        anim.effects.vivus({
            elem: mainPathShadowGroup.node,
            onReady: () => {
                mainPathShadow.attr({ opacity: 0.5 });
            }
        });
        
        anim.effects.vivus({
            elem: secondPath.group.node,
            onReady: () => {
                secondPath.shape.attr({ opacity: 0.5 });
            }
        });
    },
    () => {},
    () => {
        anim.delay = 1500;
        let aPath = plane.plane.path('M 0 0 L -100 -50');
        let bPath = plane.plane.path('M 0 0 L -100 -50');
        let cPath = plane.plane.path('M 100 0 L 200 -250');
        let dPath = plane.plane.path('M 100 0 L 200 -250');
        let x = mainPath.createShapeUpdater({ a: aPath, b: bPath, c: cPath, d: dPath });
        x.runUpdater({ callback: () => x.kill(), timeFunc: 'easeOut2', duration: 1.2 });
    },
    () => {
        let aPath = plane.plane.path('M -100 -50 L -100 200');
        let bPath = plane.plane.path('M -100 -50 L -300 200');
        let cPath = plane.plane.path('M 200 -250 L -300 -100');
        let dPath = plane.plane.path('M 200 -250 L -100 -100');
        let x = mainPath.createShapeUpdater({ a: aPath, b: bPath, c: cPath, d: dPath });
        x.runUpdater({ callback: () => x.kill(), timeFunc: 'easeOut2', duration: 1.2 });
    },
    () => {
        let aPath = plane.plane.path('M -100 200 L 200 200');
        let bPath = plane.plane.path('M -300 200 L 0 200');
        let cPath = plane.plane.path('M -300 -100 L 0 -100');
        let dPath = plane.plane.path('M -100 -100 L -200 -100');
        let x = mainPath.createShapeUpdater({ a: aPath, b: bPath, c: cPath, d: dPath });
        x.runUpdater({ callback: () => x.kill(), timeFunc: 'easeOut2', duration: 1.2 });
    },
    () => {
        let aPath = plane.plane.path('M 200 200 L 100 -100');
        let bPath = plane.plane.path('M 0 200 L 300 -100');
        let cPath = plane.plane.path('M 0 -100 L 200 -250');
        let dPath = plane.plane.path('M -200 -100 L 400 -250');
        let x = mainPath.createShapeUpdater({ a: aPath, b: bPath, c: cPath, d: dPath });
        x.runUpdater({ callback: () => x.kill(), timeFunc: 'easeIn2', duration: 1.2 });
    },
    () => {
        textHolder.update({
            newText: 'Use the range slider to change the value of |.',
            fade: true,
            callback: () => {
                textHolder.addLatex(['x']);
            }
        });
        lambdaHolder = anim.sideBar.createText().update({
            newText: '\gamma \left( 0.00 \right)=\left( 1.00,1.00 \right)',
            fade: true,
            latex: true
        });
        
        anim.pause();
        draw.animate(500).transform({
            origin: [400, -300],
            scale: 1.7
        }).after(() => {
            lambda1Indicator.animate(500).attr({ r: 7 });
            lambda2Indicator.animate(500).attr({ r: 7 });
            lambda1text.animate(500).attr({ opacity: 1 });
            lambda2text.animate(500).attr({ opacity: 1 });
        });

        let arrowHolderUpdate = arrowHolder.createShapeUpdater({ a: mainPath.shape, b: mainPathShadow });
        let length = mainPath.shape.length();
        let shadowLength = mainPathShadow.length();
        
        mainPathIndicator.animate(500).attr({ opacity: 1 });
        shadowPathIndicator.animate(500).attr({ opacity: 1 });
        arrowHolder.shape.animate(500).attr({ opacity: 0.5 });

        function sceww(x) {
            arrowHolderUpdate.update(x / 100);
            let data = mainPath.shape.pointAt(x * length / 100);
            mainPathIndicator.center(data.x, data.y);
            let shadowData = mainPathShadow.pointAt(x * shadowLength / 100);
            shadowPathIndicator.center(shadowData.x, shadowData.y);
        }

        emph = anim.effects.emphasize([
            arrowHolder.shape,
            mainPathIndicator,
            shadowPathIndicator
        ], {
            resultStyle: [
                { opacity: 1, filter: 'drop-shadow(0 0 15px white) brightness(1.2)' },
                { opacity: 1, filter: 'drop-shadow(0 0 15px white) brightness(1.2)' },
                { opacity: 1, filter: 'drop-shadow(0 0 15px white) brightness(1.2)' }
            ]
        });

        let scrub = anim.effects.scrubber({
            initialValue: 0,
            animator: sceww,
            duration: 400,
            onUpdate: () => {
                emph.updateAll();
            }
        });

        let range = anim.sideBar.createRangeInput({
            name: 'x',
            latex: true,
            listener: (event) => {
                scrub.play(event.target.value);
                let data = mainPath.shape.pointAt(event.target.value * length / 100);
                lambdaHolder.update({
                    newText: '\gamma\left( ' + parseFloat(event.target.value / 100).toFixed(2) +
                        ' \right)=\left( ' + parseFloat(parseInt(data.x) / 100).toFixed(2) +
                        ',' + parseFloat(-parseInt(data.y) / 100).toFixed(2) +
                        ' \right)',
                    latex: true
                });
            }
        });

        range.node.addEventListener('mousedown', () => {
            emph.on();
        });

        range.node.addEventListener('mouseup', () => {
            emph.off();
        });

        let next = anim.sideBar.createButton({
            name: 'next',
            listener: () => {
                lambda1text.animate(500).attr({ opacity: 0 });
                lambda2text.animate(500).attr({ opacity: 0 });
                lambda1Indicator.animate(500).attr({ r: 0 });
                lambda2Indicator.animate(500).attr({ r: 0 }).after(() => {
                    anim.play();
                    range.kill();
                    next.kill();
                    // emph.remove();
                    gsap.to(lambdaHolder.textSpace, { opacity: 0, duration: 0.5 });
                });
            }
        });
    },
    () => {
        gsap.to(textHolder.textSpace, { opacity: 0, duration: 0.5, onComplete: () => {
            textHolder.update({
                newText: `That's an example of loop in |.`,
                fade: true,
                callback: () => {
                    textHolder.addLatex(['R^2']);
                }
            });
        } });
        
        draw.animate(500).transform({ scale: 1 });
        
        let aPath = plane.plane.path('M 100 -100 L 0 0');
        let bPath = plane.plane.path('M 300 -100 L 0 0');
        let cPath = plane.plane.path('M 200 -250 L 100 0');
        let dPath = plane.plane.path('M 400 -250 L 100 0');
        let x = mainPath.createShapeUpdater({ a: aPath, b: bPath, c: cPath, d: dPath });
        
        arrowHolder.shape.animate(300).attr({ opacity: 0 });
        mainPathIndicator.animate(300).attr({ opacity: 0 });
        shadowPathIndicator.animate(300).attr({ opacity: 0 });
        
        x.runUpdater({
            callback: () => {
                x.kill();
            },
            timeFunc: 'easeOut',
            duration: 1
        });
    },
    () => {},
    () => {
        mainPath.shape.node.remove();
        secondPath.shape.attr({ opacity: 1 });
        
        let aPath = plane.plane.path('M 0 0 L -450 100');
        let bPath = plane.plane.path('M 0 0 L -450 350');
        let cPath = plane.plane.path('M 0 0 L -50 350');
        let dPath = plane.plane.path('M 0 0 L -50 100');
        let ePath = plane.plane.path('M 100 0 L -50 -150');
        let fPath = plane.plane.path('M 100 0 L -450 -150');
        let gPath = plane.plane.path('M 100 0 L -450 100');
        
        let x = secondPath.createShapeUpdater({
            a: aPath,
            b: bPath,
            c: cPath,
            d: dPath,
            e: ePath,
            f: fPath,
            g: gPath
        });
        
        x.runUpdater({
            callback: () => {
                arrowHolder.shape.animate(500).attr({ opacity: 0 });
                mainPathIndicator.animate(500).attr({ opacity: 0 });
                shadowPathIndicator.animate(500).attr({ opacity: 0 });
                x.kill();
            },
            timeFunc: 'easeOut',
            duration: 1
        });
    },
    () => {
        lambdaHolder.update({
            newText: '\gamma\left( 0 \right)=\left( -4.50 ,-1.00 \right)',
            latex: true
        });
        
        gsap.to(lambdaHolder.textSpace, { opacity: 1, duration: 0.5 });
        
        draw.animate(500).transform({
            origin: [-400, 200],
            scale: 1.7
        });
        
        
        let arrowHolderUpdate = arrowHolder.createShapeUpdater({ a: secondPath.shape, b: mainPathShadow });
        let length = secondPath.shape.length();
        let shadowLength = mainPathShadow.length();
        
        arrowHolderUpdate.update(0);
        let data = secondPath.shape.pointAt(0);
        mainPathIndicator.center(data.x, data.y);
        shadowPathIndicator.center(0, 0);
        
        mainPathIndicator.animate(500).attr({ opacity: 1 });
        shadowPathIndicator.animate(500).attr({ opacity: 1 });
        arrowHolder.shape.animate(500).attr({ opacity: 0.5 });

        function sceww(x) {
            let data = secondPath.shape.pointAt(x * length / 100);
            mainPathIndicator.center(data.x, data.y);
            let shadowData = mainPathShadow.pointAt(x * shadowLength / 100);
            shadowPathIndicator.center(shadowData.x, shadowData.y);
            arrowHolderUpdate.update(x / 100);
        }

        emph = anim.effects.emphasize([
            arrowHolder.shape,
            mainPathIndicator,
            shadowPathIndicator
        ], {
            resultStyle: [
                { opacity: 1, filter: 'drop-shadow(0 0 15px white) brightness(1.2)' },
                { opacity: 1, filter: 'drop-shadow(0 0 15px white) brightness(1.2)' },
                { opacity: 1, filter: 'drop-shadow(0 0 15px white) brightness(1.2)' }
            ]
        });

        let scrub = anim.effects.scrubber({
            initialValue: 0,
            animator: sceww,
            duration: 400,
            onUpdate: () => {
                emph.updateAll();
            }
        });

        let range = anim.sideBar.createRangeInput({
            name: 'x:',
            latex: true,
            listener: (event) => {
                scrub.play(event.target.value);
                let data = secondPath.shape.pointAt(event.target.value * length / 100);
                lambdaHolder.update({
                    newText: '\gamma\left( ' + parseFloat(event.target.value / 100).toFixed(2) +
                        ' \right)=\left( ' + parseFloat(parseInt(data.x) / 100).toFixed(2) +
                        ',' + parseFloat(-parseInt(data.y) / 100).toFixed(2) +
                        ' \right)',
                    latex: true
                });
            }
        });

        range.node.addEventListener('mousedown', () => {
            emph.on();
        });

        range.node.addEventListener('mouseup', () => {
            emph.off();
        });

        
    },
    ()=>{
        anim.sideBar.createButton({
            name: 'play again',
            listener: () => {
                anim.playAgain();
            }
        });
    }
]);
});
export default anim;
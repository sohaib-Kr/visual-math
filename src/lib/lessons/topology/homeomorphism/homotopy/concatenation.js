import { CartPlane } from '@/lib/utiles/vector/index.js';
import { vMathAnimation } from '@/lib/library.js';
import gsap from 'gsap';

const anim = new vMathAnimation('concatenation');

anim.setInit(function() {
    const draw = anim.frame;
    const plane = new CartPlane({ draw, unit: { u: 30, v: 30 } });
    const config = anim.config();

    // Create path groups
    const firstLoopGroup = plane.plane.group();
    const firstLoop = firstLoopGroup.path(`
        M 0 0 
        C -28 -52 160 -136 200 -100 
        S 303 -48 253 24 
        S 14 21 0 0
    `).attr(config.path1);

    const secondLoopGroup = plane.plane.group();
    const secondLoop = secondLoopGroup.path(`
        M 0 0 
        C -62 -61 -101 -75 -101 -147 
        S -74 -297 -4 -258 
        S 77 71 0 0
    `).attr(config.path1);

    // Create indicator and text holder
    let indicator = anim.elements.indicator()
    indicator.elem.attr({ opacity: 0 });
    plane.append(indicator.elem)
    indicator.update(firstLoop, 0);
    
    let textHolder;

    anim.initSteps([
        () => {
            // Initial zoom and text setup
            draw.animate(800).transform({ scale: 1.7, origin: [200, -200] });
            
            textHolder = anim.sideBar.createText().update({
                newText: '||',
                fade: true,
                callback: () => {
                    textHolder.addLatex([
                        '\\gamma_{1}=(1.00,1.00)',
                        '\\newline \\gamma_{2}=(1.00,1.00)'
                    ]);
                }
            });
        },
        () => {
            // Draw both paths
            anim.effects.vivus({
                elem: firstLoopGroup.node,
                duration: 50,
                onReady: () => firstLoop.animate(1000).attr({ opacity: 1 })
            });
            
            anim.effects.vivus({
                elem: secondLoopGroup.node,
                duration: 50,
                onReady: () => secondLoop.animate(1000).attr({ opacity: 1 })
            });
        },
        () => {
            // Show indicator
            indicator.elem.animate(500).attr({ opacity: 1 });
        },
        () => {
            // Animate along first path
            anim.pause();
            secondLoop.animate(500).attr({ opacity: 0.5 });
            gsap.to(textHolder.textSpace.children[1], { duration: 0.5, opacity: 0.3 });
            const coords = textHolder.textSpace.children[0].querySelectorAll('.mord');
            const length = firstLoop.length();
            const gammaX = coords[4];
            const gammaY = coords[5];
            
            gsap.to({}, {
                duration: 3,
                onUpdate: function() {
                    indicator.update(firstLoop, this.progress());
                    const {x, y} = firstLoop.pointAt(length * this.progress());
                    gammaX.textContent = (x/100).toFixed(2);
                    gammaY.textContent = (-y/100).toFixed(2);
                },
                onComplete: () => anim.play()
            });
        },
        () => {},
        () => {
            // Animate along second path
            anim.pause();
            secondLoop.animate(500).attr({ opacity: 1 });
            firstLoop.animate(500).attr({ opacity: 0.5 });
            gsap.to(textHolder.textSpace.children[1], { duration: 0.5, opacity: 1 });
            gsap.to(textHolder.textSpace.children[0], { duration: 0.5, opacity: 0.3 });
            
            const coords = textHolder.textSpace.children[1].querySelectorAll('.mord');
            const length = secondLoop.length();
            const gammaX = coords[4];
            const gammaY = coords[5];
            
            gsap.to({}, {
                duration: 3,
                onUpdate: function() {
                    indicator.update(secondLoop, this.progress());
                    const {x, y} = secondLoop.pointAt(length * this.progress());
                    gammaX.textContent = (x/100).toFixed(2);
                    gammaY.textContent = (-y/100).toFixed(2);
                },
                onComplete: () => anim.play()
            });
        },
        () => {
            // Update text to show concatenation
            textHolder.update({
                newText: `
                    \\Gamma(0.0) = \\begin{cases}
                       \\gamma_{1}(0.0) \\newline
                       \\gamma_{2}(0.0) 
                    \\end{cases}\\newline =(0.00,0.00)
                `,
                fade: true,
                latex: true
            });
        },
        () => {
            // Animate through both paths sequentially
            anim.pause();
            firstLoop.animate(500).attr({ opacity: 1 });

            const coords = textHolder.textSpace.querySelectorAll('.mord');
            const holder1 = coords[3];
            const holder2 = coords[9];
            const firstLength = firstLoop.length();
            const secondLength = secondLoop.length();
            const gammaT = coords[1];
            const gammaT1 = coords[8];
            const gammaT2 = coords[14];
            const X = coords[15];
            const Y = coords[16];

            let x, y;
            let holder1Faded = false;
            let holder2Faded = false;

            // First path animation
            gsap.to({}, {
                duration: 3,
                onUpdate: function() {
                    gammaT.textContent = (this.progress()/2).toFixed(1);
                    ({x, y} = firstLoop.pointAt(firstLength * this.progress()));
                    gammaT1.textContent = this.progress().toFixed(1);
                    indicator.update(firstLoop, this.progress());
                    
                    if (!holder1Faded) {
                        holder1Faded = true;
                        gsap.to(holder2, { duration: 0.5, opacity: 0.3 });
                    }
                },
                onComplete: () => {
                    // Second path animation
                    gsap.to({}, {
                        duration: 3,
                        onUpdate: function() {
                            gammaT.textContent = (0.5 + this.progress()/2).toFixed(1);
                            ({x, y} = secondLoop.pointAt(secondLength * this.progress()));
                            gammaT2.textContent = this.progress().toFixed(1);
                            indicator.update(secondLoop, this.progress());
                            
                            if (!holder2Faded) {
                                holder2Faded = true;
                                gsap.to(holder1, { duration: 0.5, opacity: 0.3 });
                                gsap.to(holder2, { duration: 0.5, opacity: 1 });
                            }
                        }
                    });
                }
            });

            // Coordinate display update
            gsap.to({}, {
                duration: 6.1,
                onUpdate: function() {
                    gammaT.textContent = this.progress().toFixed(1);
                    X.textContent = (x/100).toFixed(2);
                    Y.textContent = (-y/100).toFixed(2);
                },
                onComplete: () => {
                    indicator.elem.animate(1000).attr({ opacity: 0 }).after(() => {
                        indicator.elem.node.remove();
                        anim.play();
                    });
                }
            });
        },
        () => {
            // Add replay button
            anim.sideBar.createButton({
                name: 'play again',
                listener: () => anim.playAgain()
            });
        }
    ]);
});

export default anim;

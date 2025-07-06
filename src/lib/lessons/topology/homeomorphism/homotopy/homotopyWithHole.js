import { CartPlane } from '@/lib/utiles/vector/index.js';
import { vMathAnimation } from '@/lib/library.js';

const anim = new vMathAnimation('homotopyWithHole');

anim.setInit(function() {
    const draw = anim.frame;
    const plane = new CartPlane({ draw, unit: { u: 30, v: 30 } });
    const config = anim.config();

    // Create white hole in center
    plane.plane.circle(20).center(0, 0).attr({ fill: 'white', opacity: 0.8 });

    // Path matching utility
    function matchHeads(headA, headB) {
        function dist(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        }
        
        let a = headA.a;
        let aPri = headB.a;
        let b = headA.b;
        let bPri = headB.b;
        
        let distAA = dist(a[0], a[1], aPri[0], aPri[1]) + dist(b[0], b[1], bPri[0], bPri[1]);
        let distAB = dist(a[0], a[1], bPri[0], bPri[1]) + dist(b[0], b[1], aPri[0], aPri[1]);
        
        return distAA < distAB ? [a, b, bPri, aPri] : [a, b, aPri, bPri];
    }

    // Check if path would cross the center
    function checkIfInside() {
        let [a, b, c, d] = matchHeads(firstPath.currentData, secondPath.currentData);
        let segments = [
            [a, b], [b, c], [c, d], [d, a]
        ];
        let inside = false;
        
        segments.forEach(segment => {
            let x = segment[0][0], y = -segment[0][1];
            let x2 = segment[1][0], y2 = -segment[1][1];
            let m = (y2 - y) / (x2 - x);
            let D = y - m * x;
            
            if (x * x2 < 0 && D > 0) {
                inside = !inside;
            }
        });
        
        return { 
            inside, 
            points: { a, b, aPrime: d, bPrime: c } 
        };
    }

    // Create linear homotopy between paths
    function linearDrag() {
        let Adata = firstPath.currentData;
        let Bdata = secondPath.currentData;
        
        let pathA = plane.plane.path(`M ${Adata.a[0]} ${Adata.a[1]} L ${Bdata.a[0]} ${Bdata.a[1]}`);
        let pathB = plane.plane.path(`M ${Adata.b[0]} ${Adata.b[1]} L ${Bdata.b[0]} ${Bdata.b[1]}`);
        
        let x = firstPath.createShapeUpdater({ a: pathA, b: pathB });
        x.runUpdater({ callback: () => x.kill(), duration: 1 });
    }

    // Create non-linear homotopy that avoids center
    function nonLinearDrag({a, b, aPrime, bPrime}) {
        function scalar(point) {
            return Math.sqrt(Math.pow(point[0], 2) + Math.pow(point[1], 2));
        }
        
        let delta1 = [(bPrime[0] + b[0])/2, (bPrime[1] + b[1])/2];
        let delta2 = [(aPrime[0] + a[0])/2, (aPrime[1] + a[1])/2];
        let delta = scalar(delta1) > scalar(delta2) ? delta1 : delta2;
        
        let pathA = plane.plane.path(
            `M ${a[0]} ${a[1]} L ${delta[0]} ${delta[1]} L ${aPrime[0]} ${aPrime[1]}`
        ).attr({ fill: 'none' });
        
        let pathB = plane.plane.path(
            `M ${b[0]} ${b[1]} L ${delta[0]} ${delta[1]} L ${bPrime[0]} ${bPrime[1]}`
        ).attr({ fill: 'none' });
        
        let x = firstPath.createShapeUpdater({ a: pathA, b: pathB });
        x.runUpdater({ callback: () => x.kill(), duration: 1 });
    }

    // Generate appropriate homotopy based on path positions
    function generateHomotopy() {
        firstPath.disableDraggable();
        secondPath.disableDraggable();
        
        let rect = checkIfInside();
        rect.inside ? nonLinearDrag(rect.points) : linearDrag();
    }

    // Restrict paths from crossing center
    function restrictFromCenter(draggable) {
        const handler = () => {
            const { a: [Xa, Ya], b: [Xb, Yb] } = draggable.currentData;
            const distance = Math.sqrt(Math.pow(Xb - Xa, 2) + Math.pow(Yb - Ya, 2));
            const angleA = Math.atan2(Ya, Xa);
            const angleB = Math.atan2(Yb, Xb);
            
            // Dynamic threshold based on distance
            const baseThreshold = Math.PI/18;
            const dynamicThreshold = Math.min(
                Math.max(baseThreshold * (500/distance), Math.PI/180), 
                Math.PI/4
            );
            
            const angularDiff = Math.abs(angleA - angleB);
            const crossesCenter = angularDiff > Math.PI - dynamicThreshold && 
                                angularDiff < Math.PI + dynamicThreshold;
            
            draggable.shape.attr({ opacity: crossesCenter ? 0.3 : 1 });
            if (crossesCenter) playHomotopy.node.disabled = true;
        };

        draw.node.addEventListener('mousemove', handler);
        return () => draw.node.removeEventListener('mousemove', handler);
    }

    // Create initial paths
    let firstPath = anim.elements.dynamicPath({
        codedPath: `M |a| Q 0 0 |b|`,
        initialData: { a: [-250, -50], b: [-50, -250] },
        attr: config.path1
    });

    let secondPath = anim.elements.dynamicPath({
        codedPath: `M |a| Q 0 0 |b|`,
        initialData: { a: [50, 250], b: [250, 50] },
        attr: config.path1
    });

    plane.append(firstPath.group);
    plane.append(secondPath.group);

    let textHolder;
    let playHomotopy;

    anim.initSteps([
        () => {
            anim.effects.vivus({
                elem: firstPath.group.node,
                onReady: () => firstPath.shape.attr({ opacity: 1 })
            });
            
            anim.effects.vivus({
                elem: secondPath.group.node,
                onReady: () => secondPath.shape.attr({ opacity: 1 })
            });
        },
        () => {
            draw.animate(500).transform({ scale: 1.4, origin: [0, 0] });
        },
        () => {
            textHolder = anim.sideBar.createText().update({
                newText: 'In this case we can\'t directly transform the first path into the second one crossing the center',
                fade: true
            });
            
            let aPath = plane.plane.path('M -250 -50 L -100 100');
            let bPath = plane.plane.path('M -50 -250 L 100 -100');
            let x = firstPath.createShapeUpdater({ a: aPath, b: bPath });
            x.runUpdater({ callback: () => x.kill(), duration: 0.5 });
        },
        () => {},
        () => {
            let aPath = plane.plane.path('M -100 100 L 50 250');
            let bPath = plane.plane.path('M 100 -100 L 250 50');
            let x = firstPath.createShapeUpdater({ a: aPath, b: bPath });
            x.runUpdater({ callback: () => x.kill(), duration: 0.5 });
        },
        () => {},
        () => {
            draw.animate(1000).transform({ scale: 1, origin: [0, 0] });
        },
        () => {
            textHolder.update({ 
                newText: 'Drag the orange circles to move the paths around', 
                fade: true 
            });
            
            let aPath = plane.plane.path('M 50 250 L -250 -50');
            let bPath = plane.plane.path('M 250 50 L -50 -250');
            let x = firstPath.createShapeUpdater({ a: aPath, b: bPath });
            
            x.runUpdater({
                callback: () => {
                    restrictFromCenter(firstPath);
                    restrictFromCenter(secondPath);
                    x.kill();
                },
                duration: 1
            });
        },
        () => {
            firstPath.draggable(['a', 'b'], plane.center);
            secondPath.draggable(['a', 'b'], plane.center);
            
            playHomotopy = anim.sideBar.createButton({
                name: 'playHomotopy',
                listener: () => {
                    textHolder.update({
                        newText: 'There is always a way to apply homotopy between the two paths correctly',
                        fade: true
                    });
                    
                    generateHomotopy();
                    playHomotopy.kill();
                    
                    anim.sideBar.createButton({
                        name: 'play again',
                        listener: () => anim.playAgain()
                    });
                }
            });
        }
    ]);
});

export default anim;

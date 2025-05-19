import { CartPlane } from '@/lib/utiles/vector';
import { vMathAnimation } from '@/lib/library.js';








export function exo00() {
    const anim = new vMathAnimation('exerciceFrame00', false);
    const draw = anim.frame;
    const plane = new CartPlane({ draw, unit: { u: 30, v: 30 } });

    // Create main circle and path
    plane.plane.circle(20).fill('white').center(0, 0);
    let mainPath = plane.plane.path(`M 0 0 L 400 0 L 0 0`);
    mainPath.attr({ stroke: 'red', 'stroke-width': 5, fill: 'none' });

    // Create indicator line
    let indicatorLine = anim.createTopoPath({
        codedPath: `M |a|
L |b|`,
        initialData: {
            a: [300, -300],
            b: [0, 0],
        },
        attr: { stroke: 'white', 'stroke-width': 5, fill: 'none', opacity: 0.5 }
    });
    plane.append(indicatorLine.group);

    // Initialize animation steps
    anim.initSteps([
        () => { },
        () => {
            let x = indicatorLine.createShapeUpdater({ b: mainPath });
            x.runUpdater({duration:2000});
        },
        ()=>{
            anim.delay=1000
        },
        () => {
            anim.step=1
        }
    ]);

    return anim;
}








export function exo01() {
    const anim = new vMathAnimation('exerciceFrame01', false);
    const draw = anim.frame;
    const plane = new CartPlane({ draw, unit: { u: 30, v: 30 } });

    // Create main circle and path
    plane.plane.circle(20).fill('white').center(0, 0);
    let mainPath = plane.plane.path(`M 200 0 A 1 1 0 0 0 -200 0 A 1 1 0 0 0 200 0 A 200 200 0 0 0 167 -110`);
    mainPath.attr({ stroke: 'red', 'stroke-width': 5, fill: 'none' });

    // Create indicator line
    let indicatorLine = anim.createTopoPath({
        codedPath: `M |a|
L |b|`,
        initialData: {
            a: [300, -300],
            b: [0, 0],
        },
        attr: { stroke: 'white', 'stroke-width': 5, fill: 'none', opacity: 0.5 }
    });
    plane.append(indicatorLine.group);

    // Initialize animation steps
    anim.initSteps([
        () => { },
        () => {
            let x = indicatorLine.createShapeUpdater({ b: mainPath });
            x.runUpdater({duration:2000});
        },
        ()=>{
            anim.delay=1000
        },
        () => {
            anim.step=1
        }
    ]);

    return anim;
}






export function exo02() {
    const anim = new vMathAnimation('exerciceFrame02', false);
    const draw = anim.frame;
    const plane = new CartPlane({ draw, unit: { u: 30, v: 30 } });

    // Create main circle and paths
    plane.plane.circle(20).fill('white').center(0, 0);
    let mainPath = plane.plane.path(`M 200 0 A 1 1 0 0 0 -200 0 A 1 1 0 0 0 200 0 A 200 200 0 0 0 167 -110`);
    mainPath.attr({ stroke: 'red', 'stroke-width': 5, fill: 'none' });

    let firstPath = plane.plane.path(`M -100 0 C -100 100 -200 -100 -200 0`);
    firstPath.attr({ stroke: 'yellow', 'stroke-width': 5, fill: 'none' });

    let secondPath = plane.plane.path(`M 0 200 C -50 100 100 0 100 100`);
    secondPath.attr({ stroke: 'yellow', 'stroke-width': 5, fill: 'none' });

    // Create indicator line
    let indicatorLine = anim.createTopoPath({
        codedPath: `M |a|
L |b|`,
        initialData: {
            a: [300, -300],
            b: [-100, 0],
        },
        attr: { stroke: 'white', 'stroke-width': 5, fill: 'none', opacity: 0.5 }
    });
    plane.append(indicatorLine.group);

    // Initialize animation steps
    anim.initSteps([
        () => { },
        () => {
            let x = indicatorLine.createShapeUpdater({ b: firstPath });
            x.runUpdater({
                callback:()=> {
                let y = indicatorLine.createShapeUpdater({ b: secondPath });
                y.runUpdater({duration:1000});
            },
            duration:1000
            });
        },
        ()=>{
            anim.delay=1000
        },
        () => {
            anim.step=1
        }
    ]);

    return anim;
}
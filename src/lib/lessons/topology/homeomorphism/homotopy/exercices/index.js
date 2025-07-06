import { CartPlane } from '@/lib/utiles/vector/index.js';
import { vMathAnimation } from '@/lib/library.js';

const exercices = {
    exo00: {
        animation: (function() {
            const anim = new vMathAnimation('exerciceFrame00', false);
            
            anim.setInit(function() {
                const draw = anim.frame;
                const plane = new CartPlane({ draw, unit: { u: 30, v: 30 } });
                const config = anim.config();

                // Create main path
                let mainPathGroup = plane.plane.group();
                let mainPath = mainPathGroup.path(`M 0 0 L 400 0 L 0 0`).attr(config.path1);

                // Create indicator line
                let indicatorLine = anim.elements.dynamicPath({
                    codedPath: `M |a| L |b|`,
                    initialData: { a: [300, -300], b: [0, 0] },
                    attr: { stroke: 'white', 'stroke-width': 5, fill: 'none', opacity: 0.5 }
                });
                plane.append(indicatorLine.group);

                // Create markers and labels
                plane.plane.circle(15).attr({fill:'orange'}).center(0, 0);
                
                let lambda2 = anim.elements.latexText({
                    inputString: '/\\lambda(1)',
                    textStyle: {
                        'font-size':'35px',
                        'font-family':'Palatino, serif',
                        color:'#d7d7d7'
                    }
                }).move(-90, -50);
                
                let lambda1 = anim.elements.latexText({
                    inputString: '/\\lambda(0)',
                    textStyle: {
                        'font-size':'35px',
                        'font-family':'Palatino, serif',
                        color:'#d7d7d7'
                    }
                }).move(-20, 30);

                plane.append(lambda1);
                plane.append(lambda2);

                // Animation steps
                anim.initSteps([
                    () => {},
                    () => {
                        draw.animate(500).transform({
                            origin: [400, -100],
                            scale: 1.4
                        });
                    },
                    () => {
                        anim.effects.vivus({
                            elem: mainPathGroup.node,
                            duration: 50,
                            onReady: () => mainPath.animate(1000).attr({opacity:1})
                        });
                    },
                    () => {
                        let x = indicatorLine.createShapeUpdater({ b: mainPath });
                        x.runUpdater({
                            timeFunc: 'easeOut2',
                            duration: 1.5
                        });
                    },
                    () => { anim.delay = 1000; },
                    () => { if(!this.answered) anim.step = 3; }
                ]);
            });

            return anim;
        })()
    },

    exo01: {
        animation: (function() {
            const anim = new vMathAnimation('exerciceFrame01', false);
            
            anim.setInit(function() {
                const draw = anim.frame;
                const plane = new CartPlane({ draw, unit: { u: 30, v: 30 } });
                const config = anim.config();

                // Create main path
                let mainPathGroup = plane.plane.group();
                let mainPath = mainPathGroup.path(`
                    M 200 0 
                    A 1 1 0 0 0 -200 0 
                    A 1 1 0 0 0 200 0 
                    A 200 200 0 0 0 -92 -178
                `).attr(config.path1);

                // Create indicator line
                let indicatorLine = anim.elements.dynamicPath({
                    codedPath: `M |a| L |b|`,
                    initialData: { a: [300, -300], b: [0, 0] },
                    attr: { stroke: 'white', 'stroke-width': 5, fill: 'none', opacity: 0.5 }
                });
                plane.append(indicatorLine.group);

                // Create markers and labels
                plane.plane.circle(15).attr({fill:'orange'}).center(200, 0);
                plane.plane.circle(15).attr({fill:'orange'}).center(-92, -178);
                
                let lambda2 = anim.elements.latexText({
                    inputString: '/\\lambda(1)',
                    textStyle: {
                        'font-size':'35px',
                        'font-family':'Palatino, serif',
                        color:'#d7d7d7'
                    }
                }).move(-92, -170);
                
                let lambda1 = anim.elements.latexText({
                    inputString: '/\\lambda(0)',
                    textStyle: {
                        'font-size':'35px',
                        'font-family':'Palatino, serif',
                        color:'#d7d7d7'
                    }
                }).move(220, 0);

                plane.append(lambda1);
                plane.append(lambda2);

                // Animation steps
                anim.initSteps([
                    () => {},
                    () => {
                        draw.animate(500).transform({
                            origin: [200, -200],
                            scale: 1.4
                        });
                    },
                    () => {
                        anim.effects.vivus({
                            elem: mainPathGroup.node,
                            duration: 50,
                            onReady: () => mainPath.animate(1000).attr({opacity:1})
                        });
                    },
                    () => {
                        let x = indicatorLine.createShapeUpdater({ b: mainPath });
                        x.runUpdater({
                            timeFunc: 'easeIn2',
                            duration: 3
                        });
                    },
                    () => { anim.delay = 1000; },
                    () => { if(!this.answered) anim.step = 3; }
                ]);
            });

            return anim;
        })()
    },
    exo02: {
        animation: (function() {
            const anim = new vMathAnimation('exerciceFrame02', false);
            
            anim.setInit(function() {
                const draw = anim.frame;
                const plane = new CartPlane({ draw, unit: { u: 30, v: 30 } });
                const config = anim.config();

                // Background circles
                plane.plane.path(`M 200 0 A 1 1 0 0 0 -200 0`)
                    .attr({
                        fill: 'rgba(255, 255, 255, 0.14)',
                        stroke: 'rgba(255, 255, 255, 0.53)',
                        'stroke-width': 3
                    });
                
                plane.plane.path(`M -200 0 A 1 1 0 0 0 200 0`)
                    .attr({
                        fill: 'rgba(255, 255, 255, 0.14)',
                        stroke: 'rgba(255, 255, 255, 0.53)',
                        'stroke-width': 3,
                        'stroke-dasharray': '5 5'
                    });

                // Create paths
                let firstPath = anim.elements.dynamicPath({
                    codedPath: `M |a| C |b| |c| |d|`,
                    initialData: {
                        a: [-52, 9],
                        b: [-122, -65],
                        c: [-22, -116],
                        d: [-100, -173.2]
                    },
                    attr: config.path1
                });

                let secondPath = anim.elements.dynamicPath({
                    codedPath: `M |a| C |b| |c| |d|`,
                    initialData: {
                        a: [0, 200],
                        b: [-50, 100],
                        c: [100, 0],
                        d: [100, 100]
                    },
                    attr: config.path1
                });

                // Create indicator line
                let indicatorLine = anim.elements.dynamicPath({
                    codedPath: `M |a| L |b|`,
                    initialData: { a: [300, -300], b: [-100, 0] },
                    attr: { stroke: 'white', 'stroke-width': 3, fill: 'none', opacity: 0.5 }
                });
                plane.append(indicatorLine.group);

                // Markers and labels
                plane.plane.circle(15).attr({fill: 'orange'}).center(-50, 10);
                plane.plane.circle(15).attr({fill: 'orange'}).center(100, 100);
                
                let lambda2 = anim.elements.latexText({
                    inputString: '/\\lambda(1)',
                    textStyle: {
                        'font-size': '30px',
                        'font-family': 'Palatino, serif',
                        color: '#d7d7d7'
                    }
                }).move(100, 100);
                
                let lambda1 = anim.elements.latexText({
                    inputString: '/\\lambda(0)',
                    textStyle: {
                        'font-size': '30px',
                        'font-family': 'Palatino, serif',
                        color: '#d7d7d7'
                    }
                }).move(-80, 30);

                plane.append(lambda1);
                plane.append(lambda2);

                // Animation steps
                anim.initSteps([
                    () => {},
                    () => {
                        draw.animate(500).transform({
                            origin: [0, 0],
                            scale: 1.7
                        });
                    },
                    () => {
                        anim.effects.vivus({
                            elem: firstPath.group.node,
                            duration: 50,
                            onReady: () => firstPath.shape.animate(1000).attr({opacity: 1}),
                            callback: () => {
                                anim.effects.vivus({
                                    elem: secondPath.group.node,
                                    duration: 50,
                                    onReady: () => secondPath.shape.animate(1000).attr({opacity: 1})
                                });
                            }
                        });
                    },
                    () => {
                        let x = indicatorLine.createShapeUpdater({ b: firstPath.shape });
                        x.runUpdater({
                            callback: () => {
                                let y = indicatorLine.createShapeUpdater({ b: secondPath.shape });
                                y.runUpdater({timeFunc: 'easeOut2', duration: 1.5});
                            },
                            timeFunc: 'easeOut2',
                            duration: 1.5
                        });
                    },
                    () => { anim.delay = 1000; },
                    () => { if(!this.answered) anim.step = 3; }
                ]);
            });

            return anim;
        })()
    },

    exo10: {
        animation: (function() {
            const anim = new vMathAnimation('exerciceFrame10', false);
            
            anim.setInit(function() {
                const draw = anim.frame;
                const plane = new CartPlane({ draw, unit: { u: 30, v: 30 } });
                const config = anim.config();

                // Create circles
                let firstCircle = plane.plane.circle(20)
                    .stroke({color: 'white', width: 3, dasharray: '5 5'})
                    .fill('rgba(255, 255, 255, 0.14)')
                    .center(-200, 0);
                
                let secondCircle = plane.plane.circle(20)
                    .stroke({color: 'white', width: 3, dasharray: '5 5'})
                    .fill('rgba(255, 255, 255, 0.14)')
                    .center(200, 0);

                // Create paths
                let path1 = anim.elements.dynamicPath({
                    codedPath: `M |a| C |b| |c| |d|`,
                    initialData: {
                        a: [-108, 196],
                        b: [54, 142],
                        c: [-36, -48],
                        d: [93, -119]
                    },
                    attr: {...config.path1, opacity: 0}
                }).group.center(-200, 0);

                let path2 = anim.elements.dynamicPath({
                    codedPath: `M |a| C |b| |c| |d|`,
                    initialData: {
                        a: [167, 99],
                        b: [-5, 69],
                        c: [116, -70],
                        d: [-72, -58]
                    },
                    attr: {...config.path1, opacity: 0}
                }).group.center(200, 0);

                plane.append(path1);
                plane.append(path2);

                // Animation steps
                anim.initSteps([
                    () => {},
                    () => {
                        firstCircle.animate(1000).attr({r: 200});
                        secondCircle.animate(1000).attr({r: 200});
                    },
                    () => {
                        draw.animate(500).transform({
                            origin: [0, 0],
                            scale: 1.4
                        });
                    },
                    () => {
                        anim.effects.vivus({elem: path1.node});
                        anim.effects.vivus({elem: path2.node});
                        path1.animate(1000).attr({opacity: 1});
                        path2.animate(1000).attr({opacity: 1});
                    }
                ]);
            });

            return anim;
        })()
    },

    exo11: {
        animation: (function() {
            const anim = new vMathAnimation('exerciceFrame11', false);
            
            anim.setInit(function() {
                const draw = anim.frame;
                const plane = new CartPlane({ draw, unit: { u: 30, v: 30 } });
                const config = anim.config();

                // Create markers
                plane.plane.circle(20).fill('white').center(200, 0);
                plane.plane.circle(20).fill('white').center(-200, 0);

                // Create paths
                let path1 = anim.elements.dynamicPath({
                    codedPath: `M |a| C |b| |c| |d| C |e| |f| |a|`,
                    initialData: {
                        a: [-300, 0],
                        b: [-300, -300],
                        c: [300, 300],
                        d: [300, 0],
                        e: [300, -300],
                        f: [-300, 300]
                    },
                    attr: {...config.path1, opacity: 0}
                });
                plane.append(path1.group);

                let path2 = anim.elements.dynamicPath({
                    codedPath: `M |a| C |b| |c| |d| C |e| |f| |a|`,
                    initialData: {
                        a: [-330, 0],
                        b: [-330, -300],
                        c: [330, -300],
                        d: [330, 0],
                        e: [330, 300],
                        f: [-330, 300]
                    },
                    attr: {...config.path1, opacity: 0, fill: 'none'}
                });
                plane.append(path2.group);

                let updater;

                // Animation steps
                anim.initSteps([
                    () => {
                        anim.effects.vivus({elem: path1.group.node});
                        path1.shape.animate(1000).attr({opacity: 1});
                    },
                    () => {
                        anim.effects.vivus({elem: path2.group.node});
                        path2.shape.animate(1000).attr({opacity: 1});
                    },
                    () => {
                        draw.animate(500).transform({
                            origin: [0, 0],
                            scale: 1.4
                        });
                    },
                    () => {
                        if(this.answered) {
                            let aPath = plane.plane.path('M -300 0 L -220 0');
                            let bPath = plane.plane.path('M -300 -300 L -220 -90');
                            let fPath = plane.plane.path('M -300 300 L -220 90');
                            
                            updater = path1.createShapeUpdater({
                                a: aPath,
                                b: bPath,
                                f: fPath
                            });
                            updater.runUpdater({duration: 1});
                        } else {
                            anim.step = 2;
                        }
                    },
                    () => {},
                    () => {
                        if(this.answered) {
                            updater.runReverseUpdater({duration: 1});
                        }
                    },
                    () => {
                        anim.step = 2;
                    }
                ]);
            });

            return anim;
        })()
    },

    exo12: {
        animation: (function() {
            const anim = new vMathAnimation('exerciceFrame12', false);
            
            anim.setInit(function() {
                const draw = anim.frame;
                const plane = new CartPlane({ draw, unit: { u: 30, v: 30 } });
                const config = anim.config();

                // Create paths
                let path1 = anim.elements.dynamicPath({
                    codedPath: `M |a| C |b| |c| |d| C |e| |f| |a|`,
                    initialData: {
                        a: [-300, 0],
                        b: [-300, -300],
                        c: [300, 300],
                        d: [300, 0],
                        e: [300, -300],
                        f: [-300, 300]
                    },
                    attr: {...config.path1, opacity: 0}
                });
                plane.append(path1.group);

                let path2 = anim.elements.dynamicPath({
                    codedPath: `M |a| C |b| |c| |d| C |e| |f| |a|`,
                    initialData: {
                        a: [-330, 0],
                        b: [-330, -300],
                        c: [330, -300],
                        d: [330, 0],
                        e: [330, 300],
                        f: [-330, 300]
                    },
                    attr: {...config.path1, opacity: 0, fill: 'none'}
                });
                plane.append(path2.group);

                let updater;

                // Animation steps
                anim.initSteps([
                    () => {
                        anim.effects.vivus({elem: path1.group.node});
                        path1.shape.animate(1000).attr({opacity: 1});
                    },
                    () => {
                        anim.effects.vivus({elem: path2.group.node});
                        path2.shape.animate(1000).attr({opacity: 1});
                    },
                    () => {
                        draw.animate(500).transform({
                            origin: [0, 0],
                            scale: 1.4
                        });
                    },
                    () => {
                        if(this.answered) {
                            let aPath = plane.plane.path('M -300 0 L -330 0');
                            let bPath = plane.plane.path('M -300 -300 L -330 300');
                            let cPath = plane.plane.path('M 300 300 L 330 300');
                            let dPath = plane.plane.path('M 300 0 L 330 0');
                            let ePath = plane.plane.path('M 300 -300 L 330 -300');
                            let fPath = plane.plane.path('M -300 300 L -330 -300');
                            
                            updater = path1.createShapeUpdater({
                                a: aPath,
                                b: bPath,
                                c: cPath,
                                d: dPath,
                                e: ePath,
                                f: fPath
                            });
                            updater.runUpdater({duration: 1});
                        } else {
                            anim.step = 2;
                        }
                    },
                    () => {},
                    () => {
                        if(this.answered) {
                            updater.runReverseUpdater({duration: 1});
                        }
                    },
                    () => {},
                    () => {
                        anim.step = 2;
                    }
                ]);
            });

            return anim;
        })()
    }

    // Additional exercises would follow the same pattern...
};

export default exercices;
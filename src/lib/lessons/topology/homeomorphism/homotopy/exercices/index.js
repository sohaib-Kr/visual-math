import { CartPlane } from '@/lib/utiles/vector';
import { vMathAnimation } from '@/lib/library.js';








export const exercices={
    exo00:{
    question:function() {
    const anim = new vMathAnimation('exerciceFrame00', false);
    const draw = anim.frame;
    const plane = new CartPlane({ draw, unit: { u: 30, v: 30 } });

    // Create main circle and path
    let mainPathGroup=plane.plane.group()
    let mainPath = mainPathGroup.path(`M 0 0 L 400 0 L 0 0`);
    mainPath.attr({...anim.config().path1});

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
    plane.plane.circle(15).attr({fill:'orange'}).center(0,0)

    let lambda2=anim.latex('/\\lambda(1)',plane.plane.node,
        {
            'font-size':'35px',
            'font-family':'Palatino, serif',
            color:'#d7d7d7'
        }
    )
    let lambda1=anim.latex('/\\lambda(0)',plane.plane.node,
        {
            'font-size':'35px',
            'font-family':'Palatino, serif',
            color:'#d7d7d7'
        }
    )
    lambda1.move(-20,30)
    lambda2.move(-90,-50)

    // Initialize animation steps
    anim.initSteps([
        () => { },
        ()=>{
            draw.animate(500).transform({
                origin: [400,-100],
                scale: 1.4
              });
        },
        ()=>{
            anim.vivusRender({elem:mainPathGroup.node,duration:50,onReady:()=>{
                mainPath.animate(1000).attr({opacity:1})
            }})
        },
        () => {
            let x = indicatorLine.createShapeUpdater({ b: mainPath });
            x.runUpdater({timeFunc:'easeOut2',duration:1.5});
        },
        ()=>{
            anim.delay=1000
        },
        ()=>{
            if(!this.answered){
                anim.step=3
            }
        }
    ]);
    return anim;
}
},



exo01:{
    question:function() {
    const anim = new vMathAnimation('exerciceFrame01', false);
    const draw = anim.frame;
    const plane = new CartPlane({ draw, unit: { u: 30, v: 30 } });

    // Create main circle and path
    let mainPathGroup=plane.plane.group()
    let mainPath = mainPathGroup.path(`M 200 0 A 1 1 0 0 0 -200 0 A 1 1 0 0 0 200 0 A 200 200 0 0 0 -92 -178`);
    mainPath.attr({...anim.config().path1});

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
    plane.append(indicatorLine.group)
    let lambda2=anim.latex('/\\lambda(1)',plane.plane.node,
        {
            'font-size':'35px',
            'font-family':'Palatino, serif',
            color:'#d7d7d7'
        }
    )
    let lambda1=anim.latex('/\\lambda(0)',plane.plane.node,
        {
            'font-size':'35px',
            'font-family':'Palatino, serif',
            color:'#d7d7d7'
        }
    )
    lambda1.move(220,0)
    lambda2.move(-92,-170)

    // Initialize animation steps
    
    plane.plane.circle(15).attr({fill:'orange'}).center(200,0)
    plane.plane.circle(15).attr({fill:'orange'}).center(-92,-178)
    anim.initSteps([
        () => { },
        ()=>{
            draw.animate(500).transform({
                origin: [200,-200],
                scale: 1.4
              });
        },
        ()=>{
            anim.vivusRender({elem:mainPathGroup.node,duration:50,onReady:()=>{
                mainPath.animate(1000).attr({opacity:1})
            }})
        },
        () => {
            let x = indicatorLine.createShapeUpdater({ b: mainPath });
            x.runUpdater({timeFunc:'easeIn2',duration:3});
        },
        ()=>{
            anim.delay=1000
        },
        ()=>{
            if(!this.answered){
                anim.step=3
            }
        }
    ]);

    return anim;
}
},
exo02:{
    question:function() {
    const anim = new vMathAnimation('exerciceFrame02', false);
    const draw = anim.frame;
    const plane = new CartPlane({ draw, unit: { u: 30, v: 30 } });

    // Create main circle and paths
    plane.plane.path(`M 200 0 A 1 1 0 0 0 -200 0`)
    .attr({fill:'rgba(255, 255, 255, 0.14)',
        stroke:'rgba(255, 255, 255, 0.53)',
        'stroke-width':3,
    });
    plane.plane.path(`M -200 0 A 1 1 0 0 0 200 0`)
    .attr({fill:'rgba(255, 255, 255, 0.14)',
        stroke:'rgba(255, 255, 255, 0.53)',
        'stroke-width':3,
        'stroke-dasharray':'5 5'
    });
    
    let firstPathGroup=plane.plane.group()
    let secondPathGroup=plane.plane.group()

    let firstPath = firstPathGroup.path(`M -52 9 C -122 -65 -22 -116 -100 -173.2`);
    firstPath.attr({...anim.config().path1});

    let secondPath = secondPathGroup.path(`M 0 200 C -50 100 100 0 100 100`);
    secondPath.attr({...anim.config().path1});

    // Create indicator line
    let indicatorLine = anim.createTopoPath({
        codedPath: `M |a|
L |b|`,
        initialData: {
            a: [300, -300],
            b: [-100, 0],
        },
        attr: { stroke: 'white', 'stroke-width': 3, fill: 'none', opacity: 0.5 }
    });
    plane.append(indicatorLine.group);

    plane.plane.circle(15).attr({fill:'orange'}).center(-50,10)
    plane.plane.circle(15).attr({fill:'orange'}).center(100,100)
    let lambda2=anim.latex('/\\lambda(1)',plane.plane.node,
        {
            'font-size':'30px',
            'font-family':'Palatino, serif',
            color:'#d7d7d7'
        }
    )
    let lambda1=anim.latex('/\\lambda(0)',plane.plane.node,
        {
            'font-size':'30px',
            'font-family':'Palatino, serif',
            color:'#d7d7d7'
        }
    )
    lambda1.move(-80,30)
    lambda2.move(100,100)
    // Initialize animation steps
    anim.initSteps([
        () => { },
        ()=>{
            draw.animate(500).transform({
                origin: [0,0],
                scale: 1.7
              });
        },
        ()=>{
            anim.vivusRender({elem:firstPathGroup.node,duration:50,onReady:()=>{
                firstPath.animate(1000).attr({opacity:1})
            },callback:()=>{
                anim.vivusRender({elem:secondPathGroup.node,duration:50,onReady:()=>{
                    secondPath.animate(1000).attr({opacity:1})
                }})
            }})
        },
        () => {
            let x = indicatorLine.createShapeUpdater({ b: firstPath });
            x.runUpdater({
                callback:()=> {
                let y = indicatorLine.createShapeUpdater({ b: secondPath });
                y.runUpdater({timeFunc:'easeOut2',duration:1.5});
            },
            timeFunc:'easeOut2',duration:1.5
            });
        },
        ()=>{
            anim.delay=1000
        },
        () => {
            if(!this.answered){
                anim.step=3
            }
        }
    ]);

    return anim;
}   },
exo10:{
    question:function() {
    const anim = new vMathAnimation('exerciceFrame10', false);
    const draw = anim.frame;
    const plane = new CartPlane({ draw, unit: { u: 30, v: 30 } });
    const config=anim.config()
    let firstCircle=plane.plane.circle(20).stroke({color:'white',width:3,dasharray:'5 5'}).center(-200, 0).fill('rgba(255, 255, 255, 0.14)')
    let secondCircle=plane.plane.circle(20).stroke({color:'white',width:3,dasharray:'5 5'}).center(200, 0).fill('rgba(255, 255, 255, 0.14)')
    let path1=plane.plane.group()
    path1.path(`M -108 196 C 54 142 -36 -48 93 -119`).center(-200,0)
    path1.attr({...config.path1,opacity:0});
    let path2=plane.plane.group()
    path2.path(`M 167 99 C -5 69 116 -70 -72 -58`).center(200,0)
    path2.attr({...config.path1,opacity:0});

    // Initialize animation steps
    anim.initSteps([
        ()=>{},
        ()=>{
            firstCircle.animate(1000).attr({r:200})
            secondCircle.animate(1000).attr({r:200})
        },
        ()=>{
            draw.animate(500).transform({
                origin: [0,0],
                scale: 1.4
              });
        },
        ()=>{
            anim.vivusRender({elem:path1.node})
            anim.vivusRender({elem:path2.node})
            path1.animate(1000).attr({opacity:1})
            path2.animate(1000).attr({opacity:1})
            
        }
    ]);

    return anim;
}
},
exo11:{
    answered:false,
    question:function() {
    const anim = new vMathAnimation('exerciceFrame11', false);
    const draw = anim.frame;
    const plane = new CartPlane({ draw, unit: { u: 30, v: 30 } });
    const config=anim.config()
    plane.plane.circle(20).fill('white').center(200,0)
    plane.plane.circle(20).fill('white').center(-200,0)
    let path1=anim.createTopoPath({
        codedPath:`M |a|
       C |b| |c| |d|
       C |e| |f| |a|`,
        initialData:{a:[-300,0],b:[-300,-300],c:[300,300],d:[300,0],e:[300,-300],f:[-300,300]},
        attr:{...config.path1,opacity:0}})
    plane.append(path1.group)
    let path2=plane.plane.group()
    path2.path(`M -330 0
       C -330 -300 330 -300 330 0
       C 330 300 -330 300 -330 0 Z`).fill('none').attr({...config.path1,opacity:0})
    let updater
    // Initialize animation steps
    anim.initSteps([
        ()=>{
            anim.vivusRender({elem:path1.group.node})
            path1.shape.animate(1000).attr({opacity:1})
        },
        ()=>{
            anim.vivusRender({elem:path2.node})
            path2.children()[0].animate(1000).attr({opacity:1})
        },
        ()=>{
            draw.animate(500).transform({
                origin: [0,0],
                scale: 1.4
              });
        },
        ()=>{
            if(this.answered){
                let aPath=plane.plane.path('M -300 0 L -220 0')
                let bPath=plane.plane.path('M -300 -300 L-220 -90')
                let fPath=plane.plane.path('M -300 300 L -220 90')
                updater=path1.createShapeUpdater({a:aPath,b:bPath,f:fPath})
                updater.runUpdater({duration:1})
            }
            else{
                anim.step=2
            }
        },
        ()=>{},
        ()=>{
            if(this.answered){
                updater.runReverseUpdater({duration:1})
            }
        },
        ()=>{
            anim.step=2
        }
    ]);

    return anim;
}
},
exo12:{
    answered:false,
    question:function() {
    const anim = new vMathAnimation('exerciceFrame12', false);
    const draw = anim.frame;
    const plane = new CartPlane({ draw, unit: { u: 30, v: 30 } });
    const config=anim.config()
    let path1=anim.createTopoPath({
        codedPath:`M |a|
       C |b| |c| |d|
       C |e| |f| |a|`,
        initialData:{a:[-300,0],b:[-300,-300],c:[300,300],d:[300,0],e:[300,-300],f:[-300,300]},
        attr:{...config.path1,opacity:0}})
    plane.append(path1.group)
    let path2=plane.plane.group()
    path2.path(`M -330 0
       C -330 -300 330 -300 330 0
       C 330 300 -330 300 -330 0 Z`).fill('none').attr({...config.path1,opacity:0})
    

    // Initialize animation steps
    let updater
    anim.initSteps([
        ()=>{
            anim.vivusRender({elem:path1.group.node})
            path1.shape.animate(1000).attr({opacity:1})
        },
        ()=>{
            anim.vivusRender({elem:path2.node})
            path2.children()[0].animate(1000).attr({opacity:1})
        },
        ()=>{
            draw.animate(500).transform({
                origin: [0,0],
                scale: 1.4
              });
        },
        ()=>{
            if(this.answered){
            let aPath=plane.plane.path('M -300 0 L -330 0')
            let cPath=plane.plane.path('M 300 300 L 330 300')
            let dPath=plane.plane.path('M 300 0 L 330 0')
            let ePath=plane.plane.path('M 300 -300 L 330 -300')
            let bPath=plane.plane.path('M -300 -300 L-330 300')
            let fPath=plane.plane.path('M -300 300 L -330 -300')
            updater=path1.createShapeUpdater({a:aPath,b:bPath,c:cPath,d:dPath,e:ePath,f:fPath})
            updater.runUpdater({duration:1})
            }
            else{
                anim.step=2
            }
        },
        ()=>{},
        ()=>{
            if(this.answered){
                updater.runReverseUpdater({duration:1})
            }
        },
        ()=>{},
        ()=>{
            anim.step=2
        }
    ]);

    return anim;
},
}
}
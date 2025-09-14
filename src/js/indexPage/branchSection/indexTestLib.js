import gsap from 'gsap';
import Vivus from 'vivus';

export function createPathConnectAnimation(svg){
    let shape = svg.group();
    
    let coverCircles=[shape.circle(100).center(40,40).fill('red')
    ,shape.circle(100).center(50,80).fill('red')
    ,shape.circle(100).center(90,120).fill('blue')
    ,shape.circle(100).center(170,140).fill('orange')
    ,shape.circle(100).center(200,60).fill('green')
    ,shape.circle(100).center(170,0).fill('gray')
    ,shape.circle(100).center(80,0).fill('black')
    ,shape.circle(100).center(120,70).fill('pink')]
    coverCircles.forEach((circle)=>{
        circle.attr({opacity:0}).stroke({color:'black',width:2,dasharray:'2,2'})
    })
    
    let path = shape.group().attr({id:'connectedPath'}).path(`M 0 0
        C 0 100 40 130 70 150
        S 200 150 200 100
        S 100 0 180 -80
        `).stroke({ color: '#00c9a7', width: 6 }).fill('none');

    let point1=shape.circle(15).center(0,0).fill('#ffa64d').attr({opacity:0})
    let point2=shape.circle(15).center(180,-80).fill('#ffa64d').attr({opacity:0})
    shape.transform({translate: [100, 100],scale:0.7});
    let startObj = {
        a: [0, 0],
        b: [0, 100],
        c: [100, 0],
        d: [180, -80] 
    };
    
    let endObj = {
        a: [60, -20],
        b: [-6, 15],
        c: [120, -50],
        d: [60, -20]
    };
    let vivus=new Vivus('connectedPath',{duration:50,start:'manual'},()=>path.attr({style:''}))
    let currentObj={...startObj};
    gsap.set(shape.node,{transformOrigin:'center'})
    
    // Initially paused tweens
    let transitionTween=gsap.to(shape.node,{x:"+=20",
        y:"-=10",
        duration:3,
        paused:true,
        yoyo:true,
        repeat:-1,
        delay:1,
        ease:'power2.inOut'})
    let rotationTween=gsap.to(shape.node,{rotate:10,
        duration:3,
        paused:true,
        yoyo:true,
        repeat:-1,
        delay:1,
        ease:'power2.inOut'})

    let mainTl= gsap.timeline({
            yoyo:true,
            repeat:-1,
            paused:true, // Initially paused
            delay:1,
            onStart:function(){
                transitionTween.play()
                rotationTween.play()
                point1.animate(500).attr({opacity:1})
                point2.animate(500).attr({opacity:1})
            },
            repeatDelay:3
        })
        .to({},{
            ease:'power1.inOut',
            duration:1.5,
            onUpdate:function(){
                for (let key in startObj) {
                    currentObj[key] = [
                        startObj[key][0] + (endObj[key][0] - startObj[key][0]) * this.progress(),
                        startObj[key][1] + (endObj[key][1] - startObj[key][1]) * this.progress()
                    ];
                }
                
                point1.center(currentObj.a[0],currentObj.a[1])
                point2.center(currentObj.d[0],currentObj.d[1])
                path.plot(`M ${currentObj.a.join(' ')}
                    C ${currentObj.b.join(' ')} 40 130 70 150
                    S 200 150 200 100
                    S ${currentObj.c.join(' ')} ${currentObj.d.join(' ')}`);
            }
        }).to([point1.node,point2.node],{
            opacity:0,
            duration:1
        }).to(coverCircles,{
            opacity:0.4,
            duration:0.3,
            stagger:0.1,
        })
        
    let shrinkTween=gsap.to(shape.node,{scale:0,duration:0.4,delay:0.4,paused:true})
    
    return {
        open:false,
        In:function(){
            if(this.open==false){
                vivus.play()
                mainTl.play(0)
                shrinkTween.reverse()
                this.open=true
            }
        },
        Out:function(){
            if(this.open==true){
                mainTl.pause()
                transitionTween.pause()
                rotationTween.pause()
                shrinkTween.play()
                this.open=false
            }
        }
    }
}

export function createTorusAnimation(svg){
    let shape=svg.group()
    let torus=shape.path(' M122 0C98-30 22-26 0 0M-72 0C-72-72 190-84 196 0S-66 72-72 0M0 0C24 14 82 18 122 0').fill('#ffbf00')
    shape.transform({translate:[120,400]})
    gsap.set(torus.node,{transformOrigin:'center'})
    
    // Initially paused tweens
    let rotationTween=gsap.fromTo(torus.node,{rotate:-5},{rotate:5,
        duration:3,
        paused:true, // Initially paused
        yoyo:true,
        repeat:-1,
        ease:'power2.inOut'})
    let transitionTween= gsap.to(shape.node,{x:"+=30",
        y:"+=20",
        duration:3,
        paused:true, // Initially paused
        yoyo:true,
        repeat:-1,
        ease:'power2.inOut'})
    let shrinkTween=gsap.to(torus.node,{scale:0,duration:0.4,delay:0.4,paused:true})
    
    return {
        open:false,
        In: function() {
            if(this.open==false){
                rotationTween.play();
                transitionTween.play();
                shrinkTween.reverse()
                this.open=true
            }
        },
        Out: function() {
            if(this.open==true){
                rotationTween.pause();
                transitionTween.pause();
                shrinkTween.play()
                this.open=false
            }
        }
    };
}

export function createGraphAnimation(svg){
    let shapeHolder=svg.group().transform({translate:[500,200]})
    let shape=shapeHolder.group()
    let pathParent=shape.group().attr('id','pathParent')
    
    let firstTriangle=shape.polygon('0 -50 0 0 80 -30').attr({opacity:0}).fill('#44335e')
    let secondTriangle=shape.polygon('80 -30 150 -50 100 50').attr({opacity:0}).fill('#44335e')
    let missingTriangle=shape.polygon('0 0 100 50 0 90').attr({opacity:0}).fill('#44335e')
    
    let path=pathParent
        .path('M 0 0 V -50 L 80 -30 L 0 0 L 100 50 L 80 -30 L 150 -50 L 100 50')
        .stroke({color:'#00c9a7',width:3})
        .fill('none');
    let movingPart=pathParent.path('M 100 50 L 50 100').stroke({color:'#00c9a7',width:3}).fill('none')
    let missingLine=shape.path('M 0 0  L 0 90').stroke({color:'#00c9a7',width:3}).fill('none').attr({opacity:0})

    let dots=[[0,0],[0,-50],[80,-30],[100,50],[80,-30],[150,-50],[100,50],[50,100]].map(
        (dot)=>shape.circle(0).center(dot[0],dot[1]).fill('#ffa64d')
    )
    
    let x,y
    let tl=gsap.timeline({
            ease:'power2.inOut',
            repeat:-1,
            yoyo:true,
            repeatDelay:4,
            delay:4,
            paused:true // Initially paused
    }).to({},{
        duration:1.5,
        onUpdate:function(){
            x=50-50*this.progress()
            y=100-10*this.progress()
            movingPart.plot(`M 100 50 L ${x} ${y}`)
            dots[dots.length-1].center(x,y)
        }
    }).to(missingLine.node,{opacity:1,duration:0.5})
    .to(missingTriangle.node,{opacity:1,duration:0.5})

    // Initially paused tween
    let tween=gsap.to(shape.node,{
        x:15,
        y:5,
        paused:true, // Initially paused
        rotate:3,
        duration:3,
        ease:'power2.inOut',
        repeat:-1,
        yoyo:true
    })
    
    let vivus= new Vivus('pathParent', {type: 'oneByOne', duration: 100, start: 'manual'}, function () {
        movingPart.attr('style','')
        let i=0
        let I=setInterval(()=>{
            dots[i].animate(500).attr('r',5)
            i++
            if(i==dots.length){
                clearInterval(I)
                firstTriangle.animate(500).attr('opacity',1)
                secondTriangle.animate(500).attr('opacity',1)
                tl.play(0)
                tween.play()
            }
        },100)
    });

    let shrinkTween=gsap.to(shapeHolder.node,{scale:0,duration:0.4,delay:0.4,paused:true})
    
    return {
        open:false,
        In: function() {
            if(this.open==false){
                vivus.play();
                tween.play();
                shrinkTween.reverse()
                this.open=true
            }
        },
        Out: function() {
            if(this.open==true){
                vivus.stop();
                tween.pause();
                tl.pause();
                shrinkTween.play()
                this.open=false
            }
        }
    };
}

let scale=50

function drawMathFunction({ mathFunc, start, step, end, fill = 'none' }) {
    let pathData = `M ${start * scale} ${-mathFunc(start) * scale}`;
    
    for (let x = start; x <= end; x += step) {
        const y = mathFunc(x);
        if (!isFinite(y)) continue;
        pathData += ` L ${x * scale} ${-y * scale}`;
    }
    
    if (fill !== 'none') {
        pathData += ` L ${end * scale} 0 L ${start * scale} 0 Z`;
    }
    return pathData;
}

function plotFunctionAreas({mathFunc, start, end, step, scale,draw}) {
    // Create groups for positive and negative areas
    const greenFillGroup = draw.group();
    const redFillGroup = draw.group();
    
    let currentStart = start;
    let isPositive = mathFunc(start) >= 0;
    
    // Iterate through the function to find sign changes
    for (let x = start + step; x <= end; x += step) {
        const currentValue = mathFunc(x);
        const currentIsPositive = currentValue >= 0;
        
        // If sign changed, create a filled area for the previous segment
        if (currentIsPositive !== isPositive || x >= end - step) {
            const segmentEnd = (x >= end - step) ? end : x;
            
            if (isPositive) {
                // Create green area for positive segment
                const pathData = createFilledPath(mathFunc, currentStart, step, segmentEnd, scale);
                greenFillGroup.path(pathData).attr({ 
                    fill: 'green', 
                    opacity: 0.5,
                    stroke: 'none'
                });
            } else {
                // Create red area for negative segment
                const pathData = createFilledPath(mathFunc, currentStart, step, segmentEnd, scale);
                redFillGroup.path(pathData).attr({ 
                    fill: 'red', 
                    opacity: 0.5,
                    stroke: 'none'
                });
            }
            
            // Reset for next segment
            currentStart = segmentEnd;
            isPositive = currentIsPositive;
        }
    }
    
    return { greenFillGroup, redFillGroup };
}

function createFilledPath(mathFunc, start, step, end, scale) {
    let pathData = `M ${start * scale} ${-mathFunc(start) * scale}`;
    
    // Create the top curve
    for (let x = start + step; x <= end; x += step) {
        const y = mathFunc(x);
        if (!isFinite(y)) continue;
        pathData += ` L ${x * scale} ${-y * scale}`;
    }
    
    // Close the path by going down to x-axis and back to start
    pathData += ` L ${end * scale} 0 L ${start * scale} 0 Z`;
    
    return pathData;
}

export function createCurveApproaximation(svg){
    let scale=50
    
    let shape=svg.group()
    let mainCurve=shape.path(drawMathFunction({
        mathFunc: x => Math.sin(x*1.3),
        start: 0,
        step: 0.1,
        end: 5,
    })).fill('none').stroke({color:'#00c9a7',width:3})
    mainCurve.transform({translate:[100,400]})

    let secondCurve=shape.path().fill('none').stroke({color:'#00c9a7',width:3}).transform({translate:[100,400]})
    let startObj = {
        a: [22, 10],
        b: [58,-75],
        c: [68, -63],
        d: [99,10] 
    };
    
    let endObj = {
        a: [4, 6],
        b: [61,-73],
        c: [66, -55],
        d: [118, 6]
    };
    let currentObj={...startObj}
     
    // Initially paused animation
    let animation=gsap.to({},{
        duration:1,
        repeatDelay:3,
        repeat:-1,
        yoyo:true,
        paused:true, // Initially paused
        onUpdate:function(){
                for (let key in startObj) {
                currentObj[key] = [
                    startObj[key][0] + (endObj[key][0] - startObj[key][0]) * this.progress(),
                    startObj[key][1] + (endObj[key][1] - startObj[key][1]) * this.progress()
                ];
            }
            secondCurve.plot(`M ${currentObj.a.join(' ')}
                C ${currentObj.b.join(' ')} ${currentObj.c.join(' ')} ${currentObj.d.join(' ')}`)
        }
    })
    
    return {
        open:false,
        In: function() {
            if(this.open==false){
                animation.play();
                gsap.to(shape.node, {scale: 1, duration: 0.5});
            }
            this.open=true
        },
        Out: function() {
            if(this.open==true){
                animation.pause();
                gsap.to(shape.node, {scale: 0, duration: 0.4});
            }
            this.open=false
        }
    };    
}

export function createUnderCurveSpaceAnimation(svg){
    let shapeContainer=svg.group()
    let shape=shapeContainer.group()
    let mathFunc=(x)=>{
        if (x<4){
            return x/2*Math.sin(x*1.3)
        }else{
            return Math.min(x/2*Math.sin(x*1.3),0)
        }
    }
    let mainCurve=shape.path(drawMathFunction({
        mathFunc,
        start: 0,
        step: 0.05,
        end: 4.85,
    })).fill('none').stroke({color:'#00c9a7',width:3})
    shapeContainer.transform({translate:[400,100],scale:0.8})

    plotFunctionAreas({
        mathFunc,
        start: 0,
        step: 0.05,
        end: 4.85,
        scale:scale,
        draw:shape})

    let shader=shape.path('M 0 -100 L 270 -100 L 270 100 L 0 100 Z').fill('#310f70')
    
    shape.path('M 0 -80 L 0 80').stroke({color:'#cccccc',width:1})
    shape.path('M -20 0 L 270 0').stroke({color:'#cccccc',width:1})
    
    // Initially paused animation
    let shaderAnimation=gsap.to({},
        {
            duration:3,
            ease:'power3.in',
            repeat:-1,
            repeatDelay:4,
            yoyo:true,
            paused:true, // Initially paused
            onUpdate:function(){
                shader.plot(`M ${this.progress()*250} -100 L 270 -100 L 270 100 L ${this.progress()*250} 100 Z`)
            }
        }
    )
    
    gsap.set(shape.node,{transformOrigin:'center'})
    
    // Initially paused animation
    let shapeAnimation=gsap.fromTo(shape.node,{rotate:5},{
        duration:3,
        rotate:8,
        y:-20,
        x:10,
        ease:'power3.inOut',
        repeat:-1,
        yoyo:true,
        paused:true // Initially paused
    })
    
    return {
        open:false,
        In: function() {
            if(this.open==false){
                shaderAnimation.play();
                shapeAnimation.play();
            }
            this.open=true
        },
        Out: function() {
            if(this.open==true){
                shaderAnimation.pause();
                shapeAnimation.pause();
                gsap.to(shapeContainer.node, {scale: 0, duration: 0.4});
            }
            this.open=false
        }
    };
}

export function createSymboles(svg){
    let shape=svg.group()
    let lambda=shape.path('M26.20 52.69Q24.37 54.08 23.18 54.87Q22.00 55.66 21.17 55.66Q20.19 55.66 19.46 54.92Q18.73 54.17 17.94 52.16Q17.16 50.15 16.11 46.44Q15.06 42.72 13.48 36.79Q12.13 31.84 11.15 28.87Q10.16 25.90 9.40 24.41Q8.64 22.92 8.00 22.45Q7.35 21.97 6.69 21.97Q5.83 21.97 4.94 22.38Q4.05 22.78 2.86 23.71L2.27 22.46Q4.74 19.97 6.27 19.02Q7.81 18.07 8.81 18.07Q9.50 18.07 10.07 18.37Q10.64 18.68 11.25 19.64Q11.87 20.61 12.60 22.57Q13.33 24.54 14.32 27.84Q15.31 31.15 16.65 36.18Q17.97 40.99 19.10 44.68Q20.24 48.36 21.24 50.43Q22.24 52.49 23.14 52.49Q23.73 52.49 24.24 52.31Q24.76 52.12 25.95 51.59L26.20 52.69M13.45 32.10Q12.11 35.77 10.82 39.26Q9.52 42.75 8.23 46.41Q6.93 50.07 5.59 54.30Q4.64 54.54 3.11 54.97Q1.59 55.40 0.73 55.66L0 54.88Q1.56 52.91 3.05 50.20Q4.54 47.49 5.91 44.45Q7.28 41.41 8.44 38.34Q9.59 35.28 10.50 32.54Q11.40 29.81 11.96 27.76Q12.30 28.05 12.62 29.02Q12.94 29.98 13.17 30.92Q13.40 31.86 13.45 32.10Z')
    .fill('white')
    lambda.transform({translate:[100,100],scale:1.6})
    let epsilon=shape.path('M10.86 31.49Q12.77 31.49 14.47 32.12Q16.16 32.74 17.55 33.67Q17.46 33.96 17.29 34.39Q17.11 34.81 17.02 35.03Q15.23 34.38 14.01 34.08Q12.79 33.79 11.40 33.79Q8.08 33.79 5.87 36.27Q3.66 38.75 3.66 43.33Q3.66 46.09 4.66 48.14Q5.66 50.20 7.31 51.32Q8.96 52.44 10.91 52.44Q12.28 52.44 13.84 52.09Q15.41 51.73 17.97 50.46L18.55 51.78Q16.53 53.44 14.98 54.28Q13.43 55.13 12.06 55.40Q10.69 55.66 9.16 55.66Q6.79 55.66 4.69 54.28Q2.59 52.91 1.29 50.31Q0 47.71 0 44.09Q0 40.58 1.48 37.72Q2.95 34.86 5.43 33.18Q7.91 31.49 10.86 31.49M3.03 40.63Q4.35 40.84 5.47 40.98Q6.59 41.11 7.87 41.16Q9.16 41.21 10.94 41.21Q12.16 41.21 13.44 41.11Q14.72 41.02 15.45 40.84L15.94 41.36L14.53 43.95Q13.84 43.75 12.66 43.66Q11.47 43.58 10.69 43.58Q7.93 43.58 6.20 43.71Q4.47 43.85 3.10 44.19L3.03 40.63Z')
    .fill('yellow')
    epsilon.transform({translate:[100,300],scale:1.5})

    let delta=shape.path('M19.58 18.63Q17.80 20.34 16.85 21.25Q15.89 22.17 15.41 22.17Q14.97 22.17 13.96 21.73Q12.96 21.29 11.67 20.72Q10.38 20.14 9.06 19.70Q7.74 19.26 6.64 19.26Q6.10 19.26 5.77 19.58Q5.44 19.90 5.44 20.70Q5.44 22.17 6.46 23.65Q7.47 25.12 9.08 26.72Q10.69 28.32 12.49 30.10Q14.28 31.88 15.89 33.98Q17.50 36.08 18.52 38.57Q19.53 41.06 19.53 44.04Q19.53 46.19 18.68 48.27Q17.82 50.34 16.38 52.01Q14.94 53.69 13.18 54.68Q11.43 55.66 9.62 55.66Q6.57 55.66 4.41 54.06Q2.25 52.47 1.12 49.94Q0 47.41 0 44.63Q0 39.84 2.66 36.38Q5.32 32.91 9.72 31.35Q9.91 31.67 10.02 32.14Q10.13 32.62 10.13 32.96Q10.13 33.15 10.08 33.35Q6.74 34.72 5.26 37.37Q3.78 40.01 3.78 43.29Q3.78 45.61 4.77 47.74Q5.76 49.88 7.40 51.25Q9.03 52.61 10.94 52.61Q12.13 52.61 13.20 51.72Q14.26 50.83 14.94 49.27Q15.63 47.71 15.63 45.73Q15.63 42.77 14.67 40.37Q13.72 37.96 12.23 35.95Q10.74 33.94 9.07 32.17Q7.40 30.40 5.91 28.72Q4.42 27.05 3.47 25.32Q2.51 23.58 2.51 21.63Q2.51 19.75 3.89 18.41Q5.27 17.07 7.28 17.07Q10.60 17.07 13.05 17.54Q15.50 18.02 17.63 18.02Q18.38 18.02 18.95 17.75Q19.12 17.85 19.23 18.07Q19.34 18.29 19.58 18.63')
    .fill('yellow')
    delta.transform({translate:[140,300],scale:1.7})
    return {
        open:false,
        In: function() {
            if(this.open==false){
                // No animations in this function, just show immediately
                gsap.fromTo(shape.node, {scale: 0}, {scale: 1, duration: 0.5});
            }
            this.open=true
        },
        Out: function() {
            if(this.open==true){
                gsap.to(shape.node, {scale: 0, duration: 0.4});
            }
            this.open=false
        }
    };
}
    

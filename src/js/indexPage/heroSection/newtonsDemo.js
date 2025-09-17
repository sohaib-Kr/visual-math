import gsap from 'gsap';
import { SVG } from '@svgdotjs/svg.js';

export function newtonsDemo(){
    const scale=100;
    let playButton=document.createElement('button');
    playButton.id='play';
    playButton.textContent='Start Solution';
    document.getElementById('newtonDemoControl').appendChild(playButton);
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

    function setupDrag({element, onMove, onRelease=()=>{}}) {
        let dragging = false;
        let startX, startY;
    
        const mouseDownHandler = (e) => {
            dragging = true;
            startX = e.clientX;
            startY = e.clientY;
            e.preventDefault();
        };
    
        const mouseMoveHandler = (e) => {
            if (!dragging) return;
            onMove(e);
        };
    
        const mouseUpHandler = (e) => {
            if (!dragging) return;
            
            dragging = false;
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            onRelease(deltaX, deltaY);
        };
    
        element.addEventListener('mousedown', mouseDownHandler);
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    
        return {
            disable: () => {
                element.removeEventListener('mousedown', mouseDownHandler);
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
            }
        };
    }

    function drawTangentLine({ mathFunc, t, start, end, scale = 1 }) {
        const y_t = mathFunc(t);
        
        const h = 0.0001;
        const derivative = (mathFunc(t + h) - mathFunc(t - h)) / (2 * h);
        
        const tangentFunc = (x) => derivative * (x - t) + y_t;
        
        const y_start = tangentFunc(start);
        const y_end = tangentFunc(end);
        
        const pathData = `M ${start * scale} ${-y_start * scale} L ${end * scale} ${-y_end * scale}`;
        
        return pathData;
    }

    function updateDiffIndicator(){
        let diff=Math.abs(dynamicPointX-138);
        diffIndicator.plot(`M 0 0 L 40 0 L 40 -${diff} L 0 -${diff} `)
        diffText.text((diff/100).toFixed(2));
    }

    const frame=SVG().addTo('#newtonDemoFrame').size('100%','100%');
    let shape=frame.group().transform({translate:[120,250]})

    shape.line(-100,0,400,0).stroke({color:'gray',width:1})
    let illegalLine=shape.line(50,0,200,0).stroke({color:'red',width:1})

    let diffIndicator=frame.path('M 0 0 L 40 0 L 40 -138 L 0 -138').fill('red').transform({translate:[600,200]})
    let diffText=frame.text('1.38').transform({translate:[600,220]})
    let mathFunc=(x)=>Math.pow(Math.E,x/3)-2;

    let mainCurve=shape.path(
        drawMathFunction(
            {
                mathFunc,
                start:-1,
                step:0.1,
                end:4,
                fill:'none'
            }
        )
    ).stroke({color:'#00c9a7',width:3}).fill('none');

    let tengent=shape.path().stroke({color:'#ffa64d',width:2}).fill('none').attr({opacity:0})

    let dynamicPoint=shape.circle(10).fill('red').center(0,0)

    let dynamicPointX=0
    let dragger=setupDrag({
        element:dynamicPoint.node,
        onMove:(event)=>{
            let x=event.clientX-frame.node.getBoundingClientRect().left-200;
            if(x<-100){
                x=-100;
            }
            if(x>400){
                x=400;
            }
            if(x>50&&x<125){
                x=50;
            }
            if(x>125&&x<200){
                x=200;
            }
            dynamicPoint.transform({translate:[x,0]});
            dynamicPointX=x;
            updateDiffIndicator();
        }
    })

    let initialClick=false;
    let step=0
    let indicationLine=shape.path('').stroke({color:'red',width:1}).attr({opacity:0})
    function newtonStep(){
        playButton.disabled=true;
            if(!initialClick){
                illegalLine.animate(400).attr({opacity:0}).after(()=>illegalLine.remove());
            }
            dragger.disable();  
        
            initialClick=true;
            let x=dynamicPointX;
            let tl=gsap.timeline();
            gsap.set(shape.node,{transformOrigin:'338 550'});
            tl.to(indicationLine.node,{
                onStart:function(){
                    indicationLine.plot(`M ${x} 0 L ${x} ${-mathFunc(x/scale)*scale}`)
                },
                opacity:1,
                duration:1
            }).to(tengent.node,{
                onStart:function(){
                    tengent.plot(drawTangentLine({mathFunc,t:x/scale,start:-1,end:4,scale}))
                },
                opacity:1,
                duration:1
            }).to(dynamicPoint.node, {
                duration: 1,
                y: -mathFunc(x/scale)*scale,
                ease: "power1.inOut",
                onComplete: function() {
                    // Calculate where tangent hits x-axis
                    const h = 0.0001;
                    const derivative = (mathFunc(x/scale + h) - mathFunc(x/scale - h)) / (2 * h);
                    const rootX = x/scale - mathFunc(x/scale)/derivative;
                    
                    // Animate to x-axis along tangent line
                    gsap.to(dynamicPoint.node, {
                        duration: 1,
                        x: rootX * scale,
                        y: 0,
                        ease: "power1.inOut",
                    });
                    dynamicPointX=rootX * scale;
                    updateDiffIndicator();
                    playButton.disabled=false;
                }
            }).to(indicationLine.node,{opacity:0,duration:1}).to(tengent.node,{opacity:0,duration:1})
            // .to(shape.node,{scale:200/Math.abs(dynamicPointX-138),duration:1})
    }
    playButton.addEventListener('click',newtonStep())
}
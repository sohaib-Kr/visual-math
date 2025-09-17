import {SVG} from '@svgdotjs/svg.js'
import gsap from 'gsap'
import Vivus from 'vivus'

function showNewtonDemo(frame1,frame2,callback){
    gsap.to(frame1,{duration:1,y:50,x:-50,ease:'power2.out'})
    gsap.to(frame2,{duration:1,y:-50,x:50,ease:'power2.out',onComplete:function(){
        gsap.to([frame1,frame2],{duration:1,opacity:0,ease:'power2.out',onComplete:function(){
            gsap.set([frame1,frame2],{display:'none'})
            callback()
        }})
    }})
}
function sineWaveDemo(frame) {
    const scale = 40;
    let mathFunc = (x) => Math.sin(x * 1.2);

    // Draw the sine wave function as a path
    function drawSineWave({ start, step, end, fill = 'none' }) {
        let pathData = `M ${start * scale} ${-mathFunc(start) * scale}`;
        
        for (let x = start; x <= end; x += step) {
            const y = mathFunc(x);
            if (!isFinite(y)) continue;
            pathData += ` L ${x * scale} ${-y * scale}`;
        }
        
        return pathData;
    }

    // Function to calculate and draw the tangent line at a point on the sine curve
    function drawTangentLine({ x, length, scale = 1 }) {
        const y = mathFunc(x);
        
        // Small value to calculate the derivative
        const h = 0.0001;
        const derivative = (mathFunc(x + h) - mathFunc(x - h)) / (2 * h);
        
        // Tangent line equation: y = m(x - x0) + y0
        const tangentFunc = (xVal) => derivative * (xVal - x) + y;
        
        // Calculate start and end points centered around x
        const halfLength = length / 2;
        const start = x - halfLength;
        const end = x + halfLength;
        
        const y_start = tangentFunc(start);
        const y_end = tangentFunc(end);
        
        const pathData = `M ${start * scale} ${-y_start * scale} L ${end * scale} ${-y_end * scale}`;
        
        return pathData;
    }
    
    let shape = frame.group().transform({ translate: [100, 200]});

    // Draw the sine wave
    let sineWave = shape.path(
        drawSineWave({
            start: -Math.PI,
            step: 0.1,
            end: Math.PI * 2
        })
    ).stroke({ color: '#00c9a7', width: 5 }).fill('none')

    // Create a dynamic point (start point of the sine wave)
    let dynamicPoint = shape.circle(15).fill('red').center(-Math.PI * scale, 0);

    // Create a tangent line (initially hidden)
    let tangent = shape.path().stroke({ color: '#ffa64d', width: 3 }).fill('none')
    
    // Create progress bar elements
const barWidth = 100;
const barY = -180;
const barHeight = 5;
const borderRadius = barHeight / 2; // Half the height for fully rounded ends

// Gray background bar
let progBar = shape.group();
progBar.transform({translate: [-50, 50]});

// Gray background bar with rounded edges
let grayBar = progBar.rect(barWidth, barHeight)
    .fill('#ccc')
    .radius(borderRadius) // This creates rounded ends
    .move(100 - barWidth/2, barY);

// Red progress bar (starts with zero width) with rounded edges
let redBar = progBar.rect(0, barHeight)
    .fill('#ff4757')
    .radius(borderRadius) // This creates rounded ends
    .move(100 - barWidth/2, barY);

// Progress indicator circle
let progressCircle = progBar.circle(15)
    .fill('#ff4757')
    .center(100 - barWidth/2, barY - barHeight*2); // Center vertically on the bar

    gsap.timeline()
    .to({},{
        duration:3,
        repeat:-1,
        repeatDelay:1,
        ease:'power2.inOut',
        yoyo:true,
        onRepeat:function(){
            tangent.animate(500).attr({opacity:1})
        },
        onUpdate:function(){
            let {x,y} = sineWave.pointAt(this.progress() * sineWave.length())
            dynamicPoint.center(x,y);
            tangent.plot(drawTangentLine({ x: x/scale, length:4, scale }));
            
            // Update progress bar
            const progress = this.progress();
            const barProgress = barWidth * progress;
            redBar.width(barProgress);
            progressCircle.center(100 - barWidth/2 + barProgress, barY + barHeight/2);
            
            if(this.progress() == 1){
                tangent.animate(500).attr({opacity:0})
            }
            if(this.progress() == 0){
                tangent.animate(500).attr({opacity:0})
            }
        }
    })
}

function moveFrames() {
    const frame1 = document.getElementById('heroFrame1');
    const frame2 = document.getElementById('heroFrame2');
    const container = frame1.parentNode;
    
    let floatingTweens = [
        gsap.to(frame1, {duration: 4, y: 20, x: 10, yoyo: true, repeat: -1, ease: 'power1.inOut'}),
        gsap.to(frame2, {duration: 6, y: 20, x: -5, yoyo: true, repeat: -1, ease: 'power1.inOut'})
    ];

    function handleMouseOver() {
        floatingTweens.forEach(tween => tween.pause());
    }

    function handleMouseOut() {
        gsap.to(frame1, {duration: 1, x: 0, y: 0});
        gsap.to(frame2, {duration: 2, x: 0, y: 0});
        floatingTweens.forEach(tween => {
            tween.progress(0);
            tween.play();
        });
    }

    function handleMouseMove(event) {
        const rect = container.getBoundingClientRect();
        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + rect.height / 2;
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const deltaX = mouseX - elementCenterX;
        const deltaY = mouseY - elementCenterY;
        
        gsap.to(frame1, {duration: 0.5, x: -deltaX/20, y: deltaY/20});
        gsap.to(frame2, {duration: 0.5, x: deltaX/20, y: -deltaY/20});
    }

    container.addEventListener('mouseover', handleMouseOver);
    container.addEventListener('mouseout', handleMouseOut);
    container.addEventListener('mousemove', handleMouseMove);

    return {
        pauseTween: () => floatingTweens.forEach(tween => tween.pause()),
        disableListener: () => {
            container.removeEventListener('mouseover', handleMouseOver);
            container.removeEventListener('mouseout', handleMouseOut);
            container.removeEventListener('mousemove', handleMouseMove);
        }
    };
}


function graphDemo(frame){
    let shape=frame.group()
    const pointsData={
            a:[120, 185],
            b:[280, 175],
            c:[95, 120],
            d:[210, 90],
            e:[200, 240],
            f:[45, 180],
            g:[110, 260]
    }
    const edges=[['d','c'],['d','a'],['c','a'],['c','f'],['f','a'],['d','b'],['a','g'],['e','g'],['e','b'],['e','a']]
    const trianglesData=[['a','f','c'],['a','g','e'],['a','d','c']]

    let triangles=[]
    trianglesData.forEach(triangle=>{
        let [start,end,third]=triangle
        let path=shape.path(`M ${pointsData[start][0]} ${pointsData[start][1]} L ${pointsData[end][0]} ${pointsData[end][1]} L ${pointsData[third][0]} ${pointsData[third][1]}`)
        .fill('#A7E399')
        .attr({opacity:0})
        triangles.push(path)
    })
    let edgesGroup=shape.group().attr({id:'edgesGroup'})
    edges.forEach(edge=>{
        let [start,end]=edge
        let path=edgesGroup.path(`M ${pointsData[start][0]} ${pointsData[start][1]} L ${pointsData[end][0]} ${pointsData[end][1]}`)
        .stroke({color:'#476EAE',width:2})
        .attr({opacity:0})
    })
    let vertices=[]
    for(let key in pointsData){
        let point=pointsData[key]
        let circle=shape.circle(0).fill('#48B3AF').center(point[0],point[1])
        vertices.push(circle)
    }
    
    let vivus=new Vivus('edgesGroup', {type: 'sync', duration: 50, start: 'manual'});

    gsap.timeline({repeat:-1,repeatDelay:1,yoyo:true})
    .to({},{
        onStart:function(){
            vertices.forEach(vertex=>vertex.animate(500).attr({r:6}).animate(200).attr({r:5}))
        },
        duration:1,
        onComplete:function(){
            edgesGroup.children().forEach(path=>path.animate(1000).attr({opacity:1}))
            vivus.play()
        },
    })
    .to(triangles.map(triangle=>triangle.node),{
        duration:1,
        opacity:1,
        delay:1,
        stagger:0.1,
        ease:'power2.inOut',
        onReverseComplete:function(){
            vivus.play(-1)
            gsap.delayedCall(1,()=>vertices.forEach(vertex=>vertex.animate(500).attr({r:0})))
        }
    })
    

    gsap.fromTo(shape.node,{rotate:-2},{
        rotate:5,
        duration:4,
        ease:'power1.inOut',
        repeat:-1,
        yoyo:true
    })

}
export function heroFrame(newtonDemo){
    let frame1=SVG().addTo('#heroFrame1').size('100%','100%');
    let frame2=SVG().addTo('#heroFrame2').size('100%','100%');
    let movingTween=moveFrames()
    sineWaveDemo(frame2)
    graphDemo(frame1)

    let demoButton=document.getElementById('playDemoButton')
    function clickEvent(){
        movingTween.pauseTween()
        movingTween.disableListener()
        showNewtonDemo(frame1.node.parentNode,frame2.node.parentNode,newtonDemo)
        demoButton.removeEventListener('click',clickEvent)
        gsap.to(demoButton,{duration:1,y:10,opacity:0,ease:'power1.in',onComplete:function(){demoButton.style.display='none'}})

    }
    demoButton.addEventListener('click',clickEvent)
}
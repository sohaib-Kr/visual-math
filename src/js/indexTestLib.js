import gsap from 'gsap';
import Vivus from 'vivus';
export function createPathConnectAnimation(svg){
        
    let shape = svg.group();
    
    // Initial path
    let path = shape.path(`M 0 0
        C 0 100 30 150 70 150
        S 200 150 200 100
        S 100 0 180 -80
        `).stroke({ color: 'red', width: 2 }).fill('none');
        
    shape.transform({translate: [100, 100]});
    
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
    let currentObj={...startObj};
    
    return gsap.to({},{
        duration:2,
        yoyo:true,
        repeat:-1,
        paused:true,
        ease:'power1.inOut',
        onUpdate:function(progress){
            for (let key in startObj) {
                currentObj[key] = [
                    startObj[key][0] + (endObj[key][0] - startObj[key][0]) * this.progress(),
                    startObj[key][1] + (endObj[key][1] - startObj[key][1]) * this.progress()
                ];
            }
            
            // Update path with interpolated values
            path.plot(`M ${currentObj.a.join(' ')}
                C ${currentObj.b.join(' ')} 30 150 70 150
                S 200 150 200 100
                S ${currentObj.c.join(' ')} ${currentObj.d.join(' ')}`);
        }
    })
    }
    export function createTorusAnimation(svg){
        let shape=svg.group()
        let torus=shape.path(' M122 0C98-30 22-26 0 0M-72 0C-72-72 190-84 196 0S-66 72-72 0M0 0C24 14 82 18 122 0').fill('blue')
        shape.transform({translate:[120,400]})
        gsap.set(torus.node,{transformOrigin:'center'})
        let rotationTween=gsap.to(torus.node,{rotate:-15,paused:true,
            repeatDelay:2,
            duration:5,
            yoyo:true,
            repeat:-1,
            ease:'power2.inOut'})
        let transitionTween= gsap.to(shape.node,{x:"+=20",
            y:"+=10",
            duration:3,
            paused:true,
            yoyo:true,
            repeat:-1,
            ease:'power2.inOut'})
        return gsap.fromTo(torus.node,{scale:0},{
            scale:1,
            onStart:function(){
                rotationTween.play()
                transitionTween.play()
            },
            duration:2,
            paused:true,
            ease:'bounce.out'})
    }
    export function createGraphAnimation(svg){
        let shapeHolder=svg.group().transform({translate:[500,200]})
        let shape=shapeHolder.group()
        let pathParent=shape.group().attr('id','pathParent')
        let path=pathParent
        .path('M 0 0 V -50 L 80 -30 L 0 0 L 100 50 L 80 -30 L 150 -50 L 100 50')
        .stroke({color:'red',width:2})
        .fill('none');
    
        let movingPart=pathParent.path('M 100 50 L 50 100').stroke({color:'red',width:2}).fill('none')
        let firstTriangle=shape.polygon('0 -50 0 0 80 -30').attr({opacity:0})
        let secondTriangle=shape.polygon('80 -30 150 -50 100 50').attr({opacity:0})
    
        let missingTriangle=shape.polygon('0 0 100 50 0 90').fill('blue').attr({opacity:0})
        let missingLine=shape.path('M 0 0  L 0 90').stroke({color:'red',width:2}).fill('none').attr({opacity:0})
    
        let dots=[[0,0],[0,-50],[80,-30],[100,50],[80,-30],[150,-50],[100,50],[50,100]].map(
            (dot)=>shape.circle(0).center(dot[0],dot[1])
        )
    
        
        let x,y
        let tl=gsap.timeline({
                ease:'power2.inOut',
                repeat:-1,
                yoyo:true,
                repeatDelay:4,
                delay:4,
                paused:true
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
    
    
        let tween=gsap.to(shape.node,{
            x:15,
            y:5,
            paused:true,
            rotate:3,
            duration:3,
            ease:'power2.inOut',
            repeat:-1,
            yoyo:true
        })
        
        return new Vivus('pathParent', {type: 'oneByOne', duration: 100, start: 'manual'}, function () {
            movingPart.attr('style','')
            let i=0
            let I=setInterval(()=>{
                dots[i].animate(500).attr('r',6)
                console.log()
                i++
                if(i==dots.length){
                    clearInterval(I)
                    firstTriangle.animate(500).attr('opacity',1)
                    secondTriangle.animate(500).attr('opacity',1)
                    tl.play()
                    tween.play()
                }
            },100)
        });
       }
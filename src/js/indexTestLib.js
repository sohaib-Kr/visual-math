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
    
    let path = shape.path(`M 0 0
        C 0 100 40 130 70 150
        S 200 150 200 100
        S 100 0 180 -80
        `).stroke({ color: '#00c9a7', width: 6 }).fill('none');

    let point1=shape.circle(15).center(0,0).fill('#ffa64d')
    let point2=shape.circle(15).center(180,-80).fill('#ffa64d')
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
    let currentObj={...startObj};
    gsap.set(shape.node,{transformOrigin:'center'})
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

    return gsap.timeline({
            yoyo:true,
            repeat:-1,
            paused:true,
            onStart:function(){
                transitionTween.play()
                rotationTween.play()
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

    }
    export function createTorusAnimation(svg){
        let shape=svg.group()
        let torus=shape.path(' M122 0C98-30 22-26 0 0M-72 0C-72-72 190-84 196 0S-66 72-72 0M0 0C24 14 82 18 122 0').fill('#ffbf00')
        shape.transform({translate:[120,400]})
        gsap.set(torus.node,{transformOrigin:'center'})
        let rotationTween=gsap.fromTo(torus.node,{rotate:-5},{rotate:5,paused:true,
            duration:3,
            yoyo:true,
            repeat:-1,
            ease:'power2.inOut'})
        let transitionTween= gsap.to(shape.node,{x:"+=30",
            y:"+=20",
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
                dots[i].animate(500).attr('r',5)
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


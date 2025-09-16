import {SVG} from '@svgdotjs/svg.js'
import gsap from 'gsap'
export function background(){
    const frame=SVG().addTo('#heroBackground').size('100%','100%');
    let circle1=frame.circle(200).center(100,100).attr({opacity:0})
    let circle2=frame.circle(100).center(462,57).attr({opacity:0})
    let circle3=frame.circle(100).center(83,89).attr({opacity:0})
    let circle4=frame.circle(200).center(83,89).attr({opacity:0})
    let circle5=frame.circle(200).center(83,89).attr({opacity:0})

    
    const path1= frame.path(`M 26 -106 C 269 -125 205 74 524 55 S 860 -21 955 79 S 1046 544 619 575 S 253 480 98 363 S -106 193 -98 85 S -44 -94 24 -107`)
    .fill('none')
    const path2=frame.path('M 462 57 C 341 -9 253 -40 110 278 S 713 516 1007 516 S 1600 449 1576 275 S 1412 11 1258 37 S 756 191 465 61')
    .fill('none')
    const path3=frame.path('M 261 151 C 330 104 635 1 739 190 S 416 335 319 310 S 225 171 261 151')
    .fill('none')
    const path4=frame.path('M 185 138 C 330 104 383 189 337 221 S 217 286 140 263 S 104 159 186 137')
    .fill('none')
    const path5=frame.path('M 1040 138 C 330 104 383 189 337 221 S 217 286 140 263 S 104 159 186 137')
    .fill('none')

    let backgroundColor='#fcfae9'
    let cover=frame.rect('100%','100%').fill(backgroundColor).attr({opacity:0.5})
    const gradient1 = frame.gradient('radial', function(add) {
        add.stop(0, '#f6d4bc') 
        add.stop(1, '#f6d4bc00')   
      })
    const gradient2 = frame.gradient('radial', function(add) {
        add.stop(0, '#d6d2f9') 
        add.stop(1, '#d6d2f900')   
      })
      const gradient3 = frame.gradient('radial', function(add) {
        add.stop(0, '#ccffcc') 
        add.stop(1, '#ccffcc00')   
      })
      const gradient4 = frame.gradient('radial', function(add) {
        add.stop(0, '#ffcccc') 
        add.stop(1, '#ffcccc00')   
      })
      const gradient5 = frame.gradient('radial', function(add) {
        add.stop(0, '#f2e6d9') 
        add.stop(1, '#f2e6d900')   
      })
      
      
      // Create circle with gradient fill
      circle1.fill(gradient1)
      circle2.fill(gradient2)
      circle3.fill(gradient3)
      circle4.fill(gradient4)
      circle5.fill(gradient5)
      function runCircleAcrossPath(circle,path,delay){
        let length=path.length()
        gsap.timeline({
            repeat:-1,
            defaults:{duration:13,ease:'power1.inOut'},
            delay:delay,
            onStart:function(){circle.animate(500).attr({opacity:1})}
        }).to({},{onUpdate:function(){
            let {x,y}=path.pointAt((0.25+this.progress()/4) * length)
            circle.center(x,y)
        }}).to({},{duration:5,onUpdate:function(){
            let {x,y}=path.pointAt((0.5+this.progress()/4) * length)
            circle.center(x,y)
        }}).to({},{duration:5,onUpdate:function(){
            let {x,y}=path.pointAt((0.75+this.progress()/4) * length)
            circle.center(x,y)
        }})
        .to({},{onUpdate:function(){
            let {x,y}=path.pointAt(this.progress()/4 * length)
            circle.center(x,y)
        }})
    }
    runCircleAcrossPath(circle1,path1,0)
    runCircleAcrossPath(circle2,path2,4)
    runCircleAcrossPath(circle3,path3,0)
    runCircleAcrossPath(circle4,path4,2)
    runCircleAcrossPath(circle5,path5,6)
    
    

}
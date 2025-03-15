const firstAnimation = new Animation('svgJs', 1200, 500, 'first', 'first');
{
    let { interiorColor, indicatorColor, borderColor, coverColor,textStyles} = visualMath;
    var draw=firstAnimation.frame
    var group=draw.group()
    var cover=[]
    for(let i=0;i<12;i++){
        cover.push(group.circle(100)
        .center(i*90,0)
        .stroke({color:coverColor,width:3,dasharray:"6,2"})
        .fill({color:coverColor})
        .attr({opacity:0}))
    }
    var mainSegment=group.line(0,0,1000,0).stroke({color:'#d9d9d9',width:8,linecap:'round'}).attr({opacity:0})
    var interval=group.line(200,0,200,0).stroke({color:'#874CC3',width:8,linecap:'round'}).attr({opacity:0})
    group.translate(100,300)
    firstAnimation.initSteps([
        ()=>{
            mainSegment.animate(500).attr({opacity:1})
        },
        ()=>{
            interval.animate(200).attr({opacity:1}).delay(200).plot(200,0,700,0)
        },
        ()=>{
            firstAnimation.junk(
                arrowSvg(600,150,500,270,450,150,indicatorColor,true),
                draw.text('this is the set S, a closed interval. \n we will try to construct an infinite open cover for S.')
                    .move(630, 150)
                    .attr(textStyles.explanation)
            )
        },
        ()=>{
            cover[0].move(100,-200).scale(1.3)
            cover[0].animate(500).attr({opacity:1})
        },
        ()=>{
            firstAnimation.junk(
                draw.text('We will use an infinite family of open disks to cover the interval S.\nThe dashed circle around the disks indicates the open boundary of the disk.')
                .move(350,140)
                .attr(textStyles.explanation)
            )
        },
        ()=>{
            cover[0].animate(500).transform({scale:1}).center(0,0)
        },
        ()=>{
            cover.filter((elem,index)=>index!=0).forEach((elem,index)=>{
                elem.animate(500).attr({opacity:1}).delay(200*index)
            })
        },
        ()=>{
            firstAnimation.junk(
                arrowSvg(300,200,700,200,500,200,coverColor,true),
                draw.text('There exist an infinite number of open disks.')
                    .move(300,140)
                    .attr(textStyles.explanation)
            )
        },
        ()=>{
            cover.filter((elem,index)=>index<2 || index>8).forEach((elem)=> elem.animate(500).attr({opacity:0.5}))
        },
        ()=>{},
        ()=>{
            firstAnimation.junk(
                draw.text('We can consider this family of sets (disks) as a subcover of S. thus, S is compact.')
                    .move(300,140)
                    .attr(textStyles.explanation)
            )
        }
    ])
}
window.onload = () => {
    firstAnimation.engine[0]()
    firstAnimation.wrapper.addEventListener('mousemove', (event) => {
        document.getElementById('mouse').innerText = 'x:'+event.clientX+'; y:'+event.clientY;
    })
}
const firstAnimation = new Animation('svgJs', 1000, 500, 'first', 'first');
{
    let e=null;
    var draw=firstAnimation.frame
    let { interiorColor, indicatorColor, borderColor, coverColor } = visualMath;

    // Define text styles
    const textStyles = {
        explanation: {
            style: 'font:300 24px Palatino, serif',
            fill: '#2A9D8F',
            class: 'explanation-text'
        },
        equation: {
            style: 'font:500 24px Palatino, serif',
            fill: '#264653',
            class: 'equation-text'
        }
    };


  
    // Create the main shape and its cover
    let cover = [];
    for (let i = 0; i < 3; i++) {
        cover.push(draw.polygon('0,0 270,0 270,100 0,100').move(0, i * 100).fill(coverColor));
    }

    let shape = draw.path('M 150 50 C 180 0 315 119 218 140 C 163 150 277 269 139 274 C 4 266 94 210 23 162 C -41 100 92 127 150 50 Z')
        .fill(interiorColor);

    // Create text instances
    let textGroup = draw.group().attr({opacity:0})
    cover.forEach((elem, index) => {
        let holder = textGroup.nested()
        holder.move(680, 20 + 130 * index)
        latex('\\alpha_{' + (index + 1) + '}', holder.node)
    })


    let deltas = [];
    for (let i = 0; i < 5; i++) {
        i % 2 == 0 
            ? deltas.push('a_' + (i/2 + 1))
            : deltas.push('U_');
    }
    
    let deltasEquation = createDynamicText(deltas).move(500, 400).attr({opacity:0})
    let latexDeltas = createDynamicLatex(deltas.filter((elem,index)=>index%2==1).map(()=>{return '\\cup'})).attr({opacity:0})
    latexDeltas.children().forEach((elem,index)=>{
        elem.x(deltasEquation.children()[2*index+1].x())
        elem.y(deltasEquation.children()[2*index+1].y())
    })
    let coverFamily = createDynamicText(['{Ui}_____','U S']).move(500,400)
    coverFamily.children().forEach((elem)=>{elem.attr({opacity:0})})

    let latexCoverFamily = createDynamicLatex(['\\{U_i\\}_{i<4 }',' \\supset S'])
    latexCoverFamily.children().forEach((elem,index)=>{
        elem.x(coverFamily.children()[index].x())
        elem.y(coverFamily.children()[index].y())
        elem.attr({opacity:0})
    })


    firstAnimation.initSteps([
        ()=>{},
        ()=>{
            e=emphasize(shape);
            firstAnimation.junk(
                arrowSvg(400, 300, 200, 200, 300, 200, indicatorColor, true),
                draw.text('this is the set S')
                    .move(450, 300)
                    .attr(textStyles.explanation)
            )
        },
        ()=> e() ,
        () => {
            cover.forEach((elem, index) => {
                elem.animate(1000).dmove(370, 30 * index);
                shakeAnimation(elem, 3, 100, () => {
                }, 100 * index);
            });
        },
        ()=>{
            textGroup.animate(500).attr({opacity:1})
        },
        () => {
            cover.forEach((elem, index) => {
                elem.animate(1000).dmove(-370, -30 * index);
            });
        },

        () => {
            textGroup.children().forEach((span, index) => {
                let child = deltasEquation.children()[2 * index];
                span.animate(500).move(child.x(), child.y());
            });
        },

        ()=>{
            latexDeltas.animate(500).attr({ opacity: 1 });
            for(let i=1;i<5;i+=2){
                deltasEquation.children()[i].animate(500).attr({ opacity: 1 });
            }
        },

        () => {
            textGroup.children().forEach((elem) => {
                elem.animate(400)
                    .move(deltasEquation.x(), deltasEquation.y())
                    .attr({ opacity: 0 });
            });
            
            latexDeltas.animate(500).attr({ opacity: 0 });
            latexCoverFamily.children()[0].animate({ duration: 400, delay: 200 }).attr({ opacity: 1 });
        },

        () => {
            latexCoverFamily.children()[1].animate({ duration: 400, delay: 200 }).attr({ opacity: 1 });
        }
    ]);
}
window.onload = () => {
    firstAnimation.engine[0]()
    firstAnimation.wrapper.addEventListener('mousemove', (event) => {
        document.getElementById('mouse').innerText = 'x:'+event.clientX+'; y:'+event.clientY;
    })
}

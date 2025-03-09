
var visualMath
function createVisualMath(frame){
    let gradient = frame.gradient('radial', function(add) {
        add.stop(0, '#DAACF6')
        add.stop(1, '#874CC3')
    })
    visualMath = {
        interiorColor: gradient.from(0.1, 0.2).to(0.5, 0.5).radius(1),
        indicatorColor: '#ff7700',
        borderColor: '#e6c300',
        coverColor: '#99c3e0',
    };
}
class Animation {
    constructor(lib, height, width, parent, id) {
        this.wrapper = document.createElement('div');
        this.wrapper.innerHTML = `
            <div id="${id}Animation" class="animationWrapper">
              <svg class="animation" id="${id}Frame"></svg>
              <div class="animationControl"></div>
            </div>`;
        document.getElementById(parent).appendChild(this.wrapper);
        if (lib === 'svgJs') {
            this.frame = SVG(`#${id}Frame`).size(height, width);
        } else if (lib === 'snapSvg') {
            this.frame = Snap(`#${id}Frame`);
        }

        this.step = 0;
        this.delay = 1000;
        this.engine = [() => {
            this.step += 1;
            this.step < this.engine.length ? (() => {
                this.engine[this.step]();
                setTimeout(() => this.engine[0](), this.delay);
            })() : NaN;
        }];
        createVisualMath(this.frame)
    }

    junk(...args){
        let now = this.step;
        args.forEach(arg => {
            let I=setInterval(()=>{
                this.step==now+1 ? (arg.animate(500).attr({opacity: 0}), clearInterval(I)) : NaN;
            }, 100);
        });
    }
    initSteps(steps) {
        this.engine = this.engine.concat(steps);
    }
}

// SVG.js version of drawArrow
function arrowSvg(sx, sy, ex, ey, cx, cy, color, vivusConfirmed) {
    // Draw the curved path
    let width = draw.width();
    let height = draw.height();
    let startX = sx;
    let startY = sy;
    let endX = ex;
    let endY = ey;
    let controlX = cx;
    let controlY = cy;
    // Draw the curved path
    let arrow = draw.group().attr({ id: 'arrow' });
    let curve = arrow.path(`M ${startX} ${startY} Q ${controlX} ${controlY}, ${endX} ${endY}`)
        .fill('none')
        .stroke({ color, width: 5, linejoin: 'round', linecap: 'round' });
    // Calculate the slope of the curve at the end point
    let dx = endX - controlX; // Change in x
    let dy = endY - controlY; // Change in y
    let angle = Math.atan2(dy, dx) * (180 / Math.PI); // Angle in degrees
    // Draw the arrowhead (a three-point polyline)
    let arrowheadSize = 10;
    let arrowhead = arrow.polyline([
        [endX - arrowheadSize, endY - arrowheadSize],
        [endX, endY],
        [endX - arrowheadSize, endY + arrowheadSize]
    ]).fill('none').stroke({ color, width: 5, linecap: 'round' })
        .transform({ rotate: angle, origin: [endX, endY] }); // Rotate the arrowhead
    if (vivusConfirmed) {
        new Vivus('arrow', {
            type: 'oneByOne',
            duration: 40,
            animTimingFunction: Vivus.EASE_OUT,
        });
    }
    return arrow;
} 
// Snap.svg version of drawArrow
function drawArrowSnap(paper, sx, sy, ex, ey, cx, cy, color, vivusConfirmed) {
    // Create a group for the arrow
    const arrow = paper.group();
    arrow.attr({ id: 'arrow' });

    // Draw the curved path
    const pathString = `M ${sx} ${sy} Q ${cx} ${cy}, ${ex} ${ey}`;
    const curve = paper.path(pathString);
    curve.attr({
        fill: 'none',
        stroke: color,
        strokeWidth: 5,
        strokeLinejoin: 'round',
        strokeLinecap: 'round'
    });

    // Calculate the slope of the curve at the end point
    const dx = ex - cx;
    const dy = ey - cy;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Draw the arrowhead
    const arrowheadSize = 10;
    const arrowheadPoints = [
        [ex - arrowheadSize, ey - arrowheadSize],
        [ex, ey],
        [ex - arrowheadSize, ey + arrowheadSize]
    ].map(point => point.join(',')).join(' ');
    
    const arrowhead = paper.polyline(arrowheadPoints);
    arrowhead.attr({
        fill: 'none',
        stroke: color,
        strokeWidth: 5,
        strokeLinecap: 'round'
    });

    // Apply rotation transform to arrowhead
    const transformString = `r${angle},${ex},${ey}`;
    arrowhead.transform(transformString);

    // Add both elements to the group
    arrow.add(curve);
    arrow.add(arrowhead);

    if (vivusConfirmed) {
        new Vivus('arrow', {
            type: 'oneByOne',
            duration: 40,
            animTimingFunction: Vivus.EASE_OUT,
        });
    }

    return arrow;
} 

function updateMousePosition(event) {
    mousePositionElement = document.getElementById('mouse');
    // Get the bounding rectangle of the canvas
    const rect = snap.node.getBoundingClientRect();
    // Calculate the mouse position relative to the canvas
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    // Update the text inside the <p> element
    mousePositionElement.textContent = `Mouse Position: (${mouseX.toFixed(2)}, ${mouseY.toFixed(2)})`;
}
function shakeAnimation(element, degree, frequency, callback, delay) {
    element.animate({ duration: 200, delay }).after(callback)
        .rotate(degree)
        .animate(frequency)
        .rotate(-2 * degree)
        .animate(frequency)
        .rotate(2 * degree)
        .animate(frequency)
        .rotate(-2 * degree)
        .animate(frequency)
        .rotate(2 * degree)
        .animate(frequency)
        .rotate(-degree);
}
createDynamicText=(text)=>{
    if(draw){
        var x = draw.text(function (add) {
            text.forEach((elem) => {
                add.tspan(elem.text).attr(elem.attr);
            });
        });
    
        return x;
    }
}
function regular(inputString) {
    return inputString.replace(/[\r\n]+/g, ``).replace(/\s+/g, ` `);
    ;
}


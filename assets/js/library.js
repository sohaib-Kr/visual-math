const visualMath = {
    interiorColor: '#9467BD',
    indicatorColor: '#ff7700',
    borderColor: '#e6c300',
    coverColor: '#99c3e0',
};

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
    }

    initSteps(steps) {
        this.engine = this.engine.concat(steps);
    }
}

// SVG.js version of drawArrow
function drawArrowSvgJs(draw, sx, sy, ex, ey, cx, cy, color, vivusConfirmed) {
    // Draw the curved path
    const arrow = draw.group();
    arrow.attr({id: 'arrow'});
    
    const curve = arrow.path(`M ${sx} ${sy} Q ${cx} ${cy}, ${ex} ${ey}`);
    curve.fill('none')
         .stroke({ 
            color, 
            width: 5, 
            linejoin: 'round',
            linecap: 'round'
        });

    // Calculate the tangent vector at the end point
    // For a quadratic Bézier curve, the tangent at the end is P2 - P1
    // where P2 is the end point and P1 is the control point
    const dx = ex - cx;
    const dy = ey - cy;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Draw the arrowhead
    const arrowheadLength = 15;
    const arrowheadWidth = 8;
    
    // Create arrowhead as a triangle
    const arrowhead = arrow.path(`
        M ${-arrowheadLength} ${-arrowheadWidth}
        L 0 0
        L ${-arrowheadLength} ${arrowheadWidth}
    `).fill('none')
      .stroke({ 
          color, 
          width: 5, 
          linejoin: 'round',
          linecap: 'round'
      });

    // Move to end point and rotate to match curve tangent
    arrowhead.transform({
        translateX: ex,
        translateY: ey,
        rotation: angle
    });

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
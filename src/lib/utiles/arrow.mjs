
import Vivus from 'vivus'
export function arrow(sx, sy, ex, ey, cx, cy, color, vivusConfirmed) {
    // Draw the curved path
    let draw=this.frame;
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
            duration: 60,
            animTimingFunction: Vivus.EASE_OUT,
        });
    }
    return arrow;
} 
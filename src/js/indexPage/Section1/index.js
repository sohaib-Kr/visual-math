import {SVG} from '@svgdotjs/svg.js';
import gsap from 'gsap';

export function section1(){
    let frame = SVG().addTo('#matrixTransformContainer').size('100%', '100%');

    // Create a group to contain all elements
    let group = frame.group();
    
    // Define dimensions and parameters
    const width = 500;
    const height = 500;
    const centerX = width / 2;
    const centerY = height / 2;
    const unitSize = 50; // 50px = 1 unit
    
    // Create grid (1 unit = 50px)
    for (let x = 0; x <= width; x += unitSize) {
        group.line(x, 0, x, height).stroke({ width: 1, color: '#e0e0e0' });
    }
    for (let y = 0; y <= height; y += unitSize) {
        group.line(0, y, width, y).stroke({ width: 1, color: '#e0e0e0' });
    }
    
    // Create X-axis
    group.line(0, centerY, width, centerY)
        .stroke({ width: 2, color: '#000' });
    
    // Create Y-axis  
    group.line(centerX, 0, centerX, height)
        .stroke({ width: 2, color: '#000' });
    
    // Add axis labels
    group.text('X').move(width - 20, centerY - 20);
    group.text('Y').move(centerX + 10, 20);
    
    // Add coordinate markers with unit labels (divided by 50)
    for (let i = unitSize; i < width; i += unitSize) {
        if (i !== centerX) {
            group.line(i, centerY - 5, i, centerY + 5).stroke({ width: 1, color: '#000' });
            const unitValue = (i - centerX) / unitSize;
            group.text(unitValue).move(i - 10, centerY + 10).font({ size: 12 });
        }
    }
    for (let i = unitSize; i < height; i += unitSize) {
        if (i !== centerY) {
            group.line(centerX - 5, i, centerX + 5, i).stroke({ width: 1, color: '#000' });
            const unitValue = (centerY - i) / unitSize;
            group.text(unitValue).move(centerX + 10, i - 6).font({ size: 12 });
        }
    }
    
    // Create custom arrow marker definition using your path
    const arrowMarker = frame.marker(20, 20, function(add) {
        add.path('M -20 -2 L 0 -2 V -10 L 20 0 V 0 L 0 10 V 2 L -20 2 Z')
            .fill('#000')
            .stroke('none');
    }).ref(0, 0);
    
    // Draw right-pointing arrow at (2, 0.5)
    const rightArrowX = centerX + (2 * unitSize);
    const rightArrowY = centerY - (0.5 * unitSize);
    const rightArrowLength = 3 * unitSize; // 3 units long
    
    group.line(rightArrowX, rightArrowY, rightArrowX + rightArrowLength, rightArrowY)
        .stroke({ width: 2, color: '#007bff' })
        .marker('end', arrowMarker);
    
    // Draw left-pointing arrow at (2, 3.5)
    const leftArrowX = centerX + (2 * unitSize);
    const leftArrowY = centerY - (3.5 * unitSize);
    const leftArrowLength = 3 * unitSize; // 3 units long
    
    group.line(leftArrowX, leftArrowY, leftArrowX - leftArrowLength, leftArrowY)
        .stroke({ width: 2, color: '#28a745' })
        .marker('end', arrowMarker);
    
    // Add labels for the arrows
    group.text('→ Right at (2, 0.5)').move(rightArrowX + 5, rightArrowY - 20).font({ size: 12, fill: '#007bff' });
    group.text('← Left at (2, 3.5)').move(leftArrowX - 60, leftArrowY - 20).font({ size: 12, fill: '#28a745' });
    
    // Create circle at center (optional)
    group.circle(40)
        .center(centerX, centerY)
        .fill('#ff6b6b')
        .stroke({ width: 2, color: '#333' });
}
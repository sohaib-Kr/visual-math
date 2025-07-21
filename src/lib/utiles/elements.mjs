import katex from 'katex';
import {dynamicPath} from './dynamicPath.js';

export function createElementsInstance(frame) {
    return {
        dynamicText: function(inputString) {
            // Separate the text into span tags to be able to manipulate them independently
            let x = frame.text(function (add) {
                console.log(inputString)
                inputString.forEach((elem) => {
                    add.tspan(elem);
                });
            });
            return x;
        },

        latexText: function({inputString,textStyle={}}) {
            // Here we separate the input string into regular text and latex text
            // Regular text is the text that will be displayed as is
            // Latex text is the text that will be rendered using katex
            // The input string should be a string of the form 'text/_text/_text'
            // Where / is the separator between regular text and latex text


            const regularText = inputString.split('/').filter((elem, index) => index % 2 === 0);
            const latexText = inputString.split('/').filter((elem, index) => index % 2 === 1);
            
            let result = document.createElement('p');
            regularText.forEach((elem) => {
                result.innerHTML += elem + '<span class="latex"></span>';
            });

            const latexSpanList = result.querySelectorAll('.latex');
            latexText.forEach((elem, index) => {
                katex.render(elem, latexSpanList[index], {
                    throwOnError: true,
                    displayMode: false
                });
            });
            let holder = frame.foreignObject(1000, 1000, '<div></div>');
            Object.assign(result.style, textStyle)
            holder.node.appendChild(result);
            frame.node.appendChild(holder.node);
            return holder;
        },

        dynamicLatexText: function({inputString,textStyle={}}) {
            let x = frame.group();
            inputString.forEach((elem) => {
                let holder = x.nested();
                let y=this.latexText({inputString:elem,textStyle})
                y.addTo(holder)
            });
            return x;
        },
        dynamicInlineLatexText: function({inputString,textStyle={}}) {
            let holder=frame.foreignObject(2000, 2000, '<div></div>')
            
            Object.assign(holder.node.style, textStyle)
            inputString.forEach((elem) => {
                let x=document.createElement('span')
                katex.render(elem, x, {
                    throwOnError: true,
                });
                holder.node.appendChild(x)
            });
            return holder;
        },
        dynamicPath:function(args){
            return new dynamicPath({frame,...args})
        },
        arrow:function({path, color, vivusConfirmed=true}) {
            let decodedPath=path.split(' ')
            if (process.env.NODE_ENV !== 'production' && decodedPath.length !== 6) {
                throw new Error(`can't parse path: ${path} \n uncorrect number of parameters`)
            }
            

            let [startX, startY, endX, endY, controlX, controlY] = decodedPath.map((elem) => parseInt(elem));
            // Draw the curved path
            let draw=this.frame;
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
        },
        indicator:function(){
            let indicator=frame.path('M -10 -10 L 0 0 L -10 10').attr({stroke:'#ffa31a','stroke-width':4,fill:'none'})
            return {
                elem:indicator,
                update:function(shape,t){
                    const length = shape.length();
                    const epsilon = 0.001; // Small offset to calculate direction
                    
                    // Get current position and next position
                    let currentPoint,nextPoint
                    if(t<1){
                        currentPoint = shape.pointAt(t * length);
                        nextPoint = shape.pointAt(Math.min((t + epsilon) * length, length));
                    }
                    else if(t==1){
                        currentPoint = shape.pointAt( length-epsilon);
                        nextPoint = shape.pointAt(length);
                    }
                    
                    // Calculate the angle in radians
                    let angle = Math.atan2(nextPoint.y - currentPoint.y, nextPoint.x - currentPoint.x);
                    
                    // Convert to degrees and normalize (0-360)
                    angle = angle * 180 / Math.PI;
                    
                    // Apply transformation
                    indicator.transform({
                        translate: [currentPoint.x, currentPoint.y],
                        rotate: angle,
                        origin: [0, 0]
                    });
                }
            }
        }
    };
}
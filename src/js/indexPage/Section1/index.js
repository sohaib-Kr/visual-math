import { SVG } from '@svgdotjs/svg.js';
import { plotMethodAnim } from './plotMethod.js';

function section1Background(){
    let draw=SVG().addTo('#section1Background').size('100%','100%')
    const mainBackground=draw.path('M 0 88 V 1162 H 1555 V 35 C 1475 7 1364 -10 1200 19 S 712 57 577 27 S 335 18 2 86')
    .fill('#e6ffe6')

}
export function section1(){
    plotMethodAnim()
    section1Background()
}
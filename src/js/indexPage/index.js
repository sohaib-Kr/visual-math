
import { SVG } from '@svgdotjs/svg.js';
import gsap from 'gsap';
import { branchesSectionScript } from './branchSection/index.js';
import {HeroScript} from './heroSection/index.js';
window.onload=()=>{
    HeroScript()
    branchesSectionScript()
}
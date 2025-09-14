
import { SVG } from '@svgdotjs/svg.js';
import gsap from 'gsap';
import * as branchSection from './branchSection/index.js';



// window.onload = function() {









//     let arrow=SVG("#arrowIcon").size(100,50)
//     let arrowPath=arrow.findOne('path')
//     arrowPath.stroke({color:'#232326',width:4,strokeLinecap:'round',strokeLinejoin:'round'})
//     arrowPath.attr({"stroke-linecap":'round',"stroke-linejoin":'round',opacity:0})
//     arrowPath.transform({translate:[100,-10]})

//     let but=document.getElementById('seeLessonsButton')
//     but.addEventListener('mouseover',()=>{
//         arrowPath.animate(300).attr({opacity:1})
//         gsap.to(but,{duration:0.5,opacity:0})
//         gsap.to(but.parentNode,{duration:0.5,backgroundColor:'#ccccff'})
//     })
//     but.addEventListener('mouseout',()=>{
//         arrowPath.animate(300).attr({opacity:0})
//         gsap.to(but,{duration:0.5,opacity:1})
//         gsap.to(but.parentNode,{duration:0.5,backgroundColor:'white'})
//     })
//     but.addEventListener('click',()=>{
//         if(siwtcher){
//             topoSprits.forEach((sprite)=>sprite.In())
//             siwtcher=false
//         }else{
//             topoSprits.forEach((sprite)=>sprite.Out())
//             siwtcher=true
//         }
//     })
// }
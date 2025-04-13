// const logo = document.getElementById('logo').children[0];
// // document.getElementById('logo').setAttribute('viewBox',`0 0 ${window.innerWidth} ${window.innerHeight}`);
// logo.style.transform = `translate(20px, 200px) scale(2)`;


// let state=Flip.getState('#logo');
// gsap.timeline({
//     repeat: 0,
//     repeatDelay: 0.5,
//     onComplete: () => {
//         gsap.fromTo('#part2', {
//             opacity: 1,
//             clipPath: "polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%)",
//         }, {
//             clipPath: "polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)",
//             duration: 1.5,
//             ease: "power2.inOut",
//             onComplete: () => {
//                 gsap.to('#part3', {
//                     opacity: 1,
//                     duration: 0.5,
//                     ease: "power2.out",
//                     onComplete: () => {
//                         console.log(document.getElementById('logo').parentNode)
//                         document.getElementById('logo').parentNode.style.display='none'
//                         document.getElementById('logo-container').appendChild(document.getElementById('logo'))
//                         logo.style.transform='translate(0px, 50px) scale(1.5)'

//                         Flip.from(state, {
//                             duration: 0.5,
//                             ease: "power2.out",
//                         })
//                     }
//                 })
//             }
//         })
//     }
// }).to('#part1', {
//     y:-50,
//     duration: 0.7,
//     ease: "power2.out",
// }).to('#part1', {
//     y:0,
//     duration: 0.7,
//     ease: "power2.in",
// }).to('#part1', {
//     y:-20,
//     duration: 0.3,
//     ease: "power2.out",
// }).to('#part1', {
//     y:0,
//     duration: 0.3,
//     ease: "power2.in",
// }).to('#part1', {
//     y:-7,
//     duration: 0.2,
//     ease: "power2.out",
// }).to('#part1', {
//     y:0,
//     duration: 0.1,
//     ease: "power2.in",
// })

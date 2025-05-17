import { useRef, useEffect } from 'react';
import { gsap } from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
export default function Result({correct,solution,submit,update}) { 
  let ref=useRef(null)
  let display="hidden"
  if(update){
    if(submit==true){
      display="grid"
    }
  }

  return (
    <>
    <div ref={ref} className={display+" h-full grid-rows-[20%_80%] mx-4 my-2 gap-[20px] col-[1/2] row-[1/2]"}>
      <p className="self-center justify-self-center text-2xl font-medium tracking-widest text-gray-600" style={{ letterSpacing: '0.05em', color: 'rgb(87, 95, 105)' }}>{correct ? "correct" : "wrong"}</p>
      <p className="relative top-[20px] justify-self-center text-center text-lg font-medium tracking-widest text-gray-600" style={{ letterSpacing: '0.05em', color: 'rgb(87, 95, 105)' }}>{solution}</p>
    </div>
    </>
  );
}

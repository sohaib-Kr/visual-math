import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
export default function FinalResult({totalScore,completeScore,valid}) {
    let feedback=""
    let percentage=0
    let panel=useRef(null)
    function listener(){

    }
    if(valid){
        listener=function(){
            gsap.to(panel.current,{display:'none',duration:0.5,opacity:0})
            listener=function(){
                
            }
        }
    percentage=parseInt(totalScore/completeScore*100)
    let feedbacks=[['Excelent','#18A558'],['Good','#A3EBB1'],['Not bad','#FFD166'],['Could be better','#FFA07A'],['Try again','#FF6B6B']]
    switch(true){
        case (percentage>=90):
            feedback=feedbacks[0]
            break
        case (percentage>=70 && percentage<90):
            feedback=feedbacks[1]
            break
        case (percentage>=50 && percentage<70):
            feedback=feedbacks[2]
            break
        case (percentage>=30 && percentage<50):
            feedback=feedbacks[3]
            break
        case (percentage>=0 && percentage<30):
            feedback=feedbacks[4]
    }
      gsap.to(panel.current,{display:'grid',duration:0.5,opacity:1})
    }
      return (
        <>
        <div ref={panel} className="fixed hidden opacity-[0] top-[0px] left-[0px] w-[100vw] h-[100vh] ">
          <div className="col-[1/2] row-[1/2] bg-gray-500 opacity-[0.5]" onClick={listener}>
          </div>
          <div className="col-[1/2] self-center justify-self-center row-[1/2] bg-white w-[500px] h-[300px] rounded-md shadow-md z-[1]">
            <div className="grid h-full grid-rows-[50%_50%]">
              <p className="text-3xl tracking-widest font-sans self-center justify-self-center self-center" style={{color:feedback[1], letterSpacing:'0.1em'}}>{feedback[0]}</p>
              <p className="text-2xl font-light tracking-widest font-sans self-center justify-self-center self-start">your score: 
                <span style={{color:feedback[1]}}>{percentage}%</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

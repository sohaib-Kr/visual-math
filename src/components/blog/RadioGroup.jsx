import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
export default function RadioGroup({item,onChoice,index,submit,update}) { 
  let ref=useRef(null)
  if(submit && update){
    ref.current.remove()
  }
  return (
    <>
          <div ref={ref} className={"grid radio-group my-[20px] col-[1/2] row-[1/2]"}>
            {item.options.map((option,i) => (
              <div key={option.title} 
              className="radio-option grid grid-cols-[70%_30%] gap-[20px] relative left-[4%]">
                <label htmlFor={`${item.title}-${option.title}`} className="text-lg self-center font-medium tracking-widest text-gray-600" style={{ letterSpacing: '0.05em', color: 'rgb(87, 95, 105)' }}>
                  {option.description}
                </label>
                <input
                  type="radio"
                  name={item.title}
                  value={option.index}
                  className="self-center w-[25px] h-[25px]"
                  onChange={(e) => {
                    onChoice(i,index)
                  }}
                />
              </div>
            ))}
          </div>
    </>
  );
}

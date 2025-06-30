import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
import RadioGroup from './RadioGroup.jsx'
import Result from './Result.jsx'
import { useSubmit } from './Exercice.jsx'

export default function Item({item, index, answered,onChoice,showButton,exoIndex}) { 
  const submit = useSubmit();
  let correct=answered[index]
  let [answer,setAnswer]=useState('')
  let [update,setUpdate]=useState(false)
  let [str,setStr]=useState("bg-white")
  let onRadioSelect=(i,index)=>{
    setAnswer(i)
    onChoice(i,index)
  }
  let ref=useRef(null)
  useEffect(()=>{
    gsap.to(ref.current,{duration:1,y:-20,opacity:1,scrollTrigger:{
      trigger:ref.current,
      start:"top 65%",
      end:"top 20%",
      onEnter:()=>showButton()
    }})
  },[])
  useEffect(()=>{
    if(answered){
    gsap.to(ref.current,{duration:1,rotateY:90,onComplete:()=>{
      setUpdate(true)
      if(answered[index]){
        setStr("bg-green-200")
      }
      else{
        setStr("bg-red-200")
      }
      gsap.to(ref.current,{duration:1,rotateY:0})
    }})
  }
  },[answered])
  return (
    <>
      <div ref={ref} className={"mx-4 flex-none opacity-[0] my-2 p-4 w-[400px] h-fit "+str} 
      style={{fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif', color: 'rgb(55, 65, 81)'}} 
      key={index}>
          <div id={"exerciceFrame"+exoIndex+""+index} className="w-[90%] mx-[5%] mb-[20px] h-[300px] ">
            
          </div>
          <div className="grid h-[200px]">
          <RadioGroup item={item} update={update} onChoice={onRadioSelect} index={index}/>
          <Result answer={answer} correct={correct} update={update} solution={item.solution}/>
          </div>
      </div>
    </>
  );
}

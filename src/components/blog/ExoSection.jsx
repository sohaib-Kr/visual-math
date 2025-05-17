import {useEffect, useState, useRef} from 'react'
import { gsap } from 'gsap'
import FinalResult from './FinalResult.jsx'
import Exercice from './Exercice.jsx'

export default function ExoSection({exercices}){
  let bareHeight
  let subBareHeight
  let maxScale
  let completeScore=3*exercices.length
  let scoreRef=useRef(null)
  let [showScore,setShowScore]=useState(false)
  useEffect(()=>{
    bareHeight=parseInt(window.getComputedStyle(document.getElementById("scoreBare")).height)
    subBareHeight=parseInt(window.getComputedStyle(document.getElementById("scoreBare").children[0]).height)
    maxScale=bareHeight/subBareHeight
  })
    function calculateTotalScore(){
        // do nothing now
    }
  const [totalScore,setTotalScore]=useState(0)
  const [valids,setValids]=useState(0)
  const max=exercices.length
  function checkValid(num){
    if(num==max){
        calculateTotalScore()
        setShowScore(true)
    }
    else{
        setValids(valids+1)
    }
  }
  return (
    <div className="grid">
      <div className="flex flex-col col-[1/2] row-[1/2]">
        {exercices.map((exo)=>(
          <Exercice exercice={exo} onSubmit={(score)=>{
            setTotalScore(totalScore+score)
            checkValid(valids+1)
            let element=document.getElementById('scoreBare')
            gsap.to(element,{duration:0.5,opacity:1})
            gsap.to(scoreRef.current,{duration:0.5,y:-20,opacity:1,onComplete:()=>{
              gsap.to(element.children[0],{duration:1,scaleY:maxScale*(totalScore+score)/9})
                let integer=totalScore*100
                let t=Math.min(parseInt(10/score),100)
                let I=setInterval(()=>{
                  integer+=1
                scoreRef.current.children[0].textContent="Score: "+parseInt(integer/completeScore)+"%"
                if(integer>=(totalScore+score)*100){
                  gsap.to(element,{delay:0.5,duration:0.5,opacity:0})
                  
                  gsap.to(scoreRef.current,{delay:0.3,duration:0.5,y:20,opacity:0})
                  clearInterval(I)
                }
              },t)
            }})
          }}/>
        ))}
      </div>
      <div ref={scoreRef} className="col-[1/2] row-[1/2] h-[100px] w-[200px] 
      bg-white rounded-ml grid sticky top-[0px] left-[1000px] opacity-[0]">
        <p className="text-center self-center text-2xl font-bold"></p>  
      </div>
      <div id="scoreBare" className="opacity-[0] h-[600px] grid w-[20px] bg-white sticky top-[50px] left-[1400px] col-[1/2] row-[1/2] border-gray-300 border-2 rounded-md">
        <div className="h-[100px] w-full bg-green-500 self-end origin-bottom"></div>
      </div>
      <FinalResult totalScore={totalScore} completeScore={completeScore} valid={showScore}/>
    </div>
  );
}

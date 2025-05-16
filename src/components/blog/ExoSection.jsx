import { useEffect, useState } from 'react';
import Exercice from './Exercice.jsx'

export default function ExoSection({exercices}){
  let bareHeight
  let subBareHeight
  let maxScale
  useEffect(()=>{
    bareHeight=parseInt(window.getComputedStyle(document.getElementById("scoreBare").parentNode).height)
    subBareHeight=parseInt(window.getComputedStyle(document.getElementById("scoreBare")).height)
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
            console.log(totalScore+score)
            document.getElementById("scoreBare").style.transform="scale(1,"+(maxScale*(totalScore+score)/9)+")"
          }}/>
        ))}
      </div>
      
      <div className="h-[600px] grid w-[20px] bg-white sticky top-[50px] left-[1400px] col-[1/2] row-[1/2] border-gray-300 border-2 rounded-md">
        <div id="scoreBare" className="h-[100px] w-full bg-green-500 self-end origin-bottom"></div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import ExoSection from './ExoSection.tsx'

export default function ExoPart({exercices}){

    function calculateTotalScore(){
        // do nothing now
    }
  const [totalScore,setTotalScore]=useState(0)
  const [valids,setValids]=useState(0)
  const max=3
  function checkValid(num){
    if(num==max){
        calculateTotalScore()
    }
    else{
        setValids(valids+1)
    }
  }
  return (
    <div>
      <div className="flex flex-col ">
        {exercices.map((exo)=>(
          <ExoSection exercices={exo} onSubmit={(score)=>{
            setTotalScore(totalScore+score)
            checkValid(valids+1)
          }}/>
        ))}
      </div>
      <p>valids: {valids}</p>
    <p>totalScore: {totalScore}</p>
    </div>
  );
}

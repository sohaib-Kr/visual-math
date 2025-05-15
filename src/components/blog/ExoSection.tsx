import { useState } from 'react';
import Exo from './Exo.tsx'

export default function ExoSection({exercices,onSubmit}){

  const calculateAnswers=(answers)=>{
    let score=0
    answers.forEach((answer,index)=>{
      if(answer===null){
        //todo:

        //show a message to the user

      }
      else if(answer===correct[index]){
        score++
      }
    })
    return score
  }
    const correct=[1,2,0]
    const [answers,setAnswers]=useState([null,null,null])
  return (
    <div>
      <div className="flex w-full h-full flex-nowrap">
      {exercices.map((exo,index)=>(
          <Exo exo={exo} index={index} onChoice={(answer,index)=>{
            let answersPrime=[...answers]
            answersPrime[index]=answer;
            console.log(answers)
            setAnswers(answersPrime)}}/>
            ))}
      </div>
      
    <button onClick={() =>{
      onSubmit(calculateAnswers(answers))
    }}>Submit</button>
    <p>answers: {answers}</p>
    </div>
  );
}

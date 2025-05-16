import { useState } from 'react';
import Item from './Item.jsx'

export default function Exercice({exercice,onSubmit}){

  const calculateAnswers=(answers)=>{
    let score=0
    let error=false
    let correctAnswers=[]
    answers.forEach((answer,index)=>{
      if(answer===null && !error){
        //todo:

        alert("Please answer all questions")
        error=true
        return

      }
      else if(answer===correct[index]){
        score++
        correctAnswers.push(true)
      }
      else{
        correctAnswers.push(false)
      }
    })
    if(!error){
      document.getElementById("submit").remove()
      setAnswered(correctAnswers)
      return score
    }
  }
    const correct=[1,2,0]
    const [answered,setAnswered]=useState(false)
    const [answers,setAnswers]=useState([null,null,null])
  return (
    <div className="w-[90%] relative left-[5%] my-[50px]">
      <div className="flex w-full h-full flex-nowrap">
      {exercice.items.map((item,index)=>(
          <Item 
          item={item} 
          index={index} 
          answered={answered}
          onChoice={(answer,index)=>{
            let answersPrime=[...answers]
            answersPrime[index]=answer;
            setAnswers(answersPrime)}}/>
            ))}
      </div>
      <div className="h-[70px] my-[30px]">
        <button id="submit" className=" float-right relative cursor-pointer right-[5%] bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() =>{
          onSubmit(calculateAnswers(answers))
        }}>Submit</button>
      </div>
    </div>
  );
}

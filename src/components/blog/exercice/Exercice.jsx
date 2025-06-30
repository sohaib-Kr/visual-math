import { useRef, useState, createContext, useContext } from 'react';
import Item from './Item.jsx'
import { gsap } from 'gsap'

export const SubmitContext = createContext();

export const useSubmit = () => {
  return useContext(SubmitContext);
};

export default function Exercice({exercice,onSubmit,exoIndex}){
  let button=useRef(null)
  let [submit,setSubmit]=useState(false)


  const calculateAnswers=(answers)=>{
    let score=0
    let error=false
    let correctAnswers=[]
    answers.forEach((answer,index)=>{
      if(answer===null && !error){
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
      gsap.to(button.current,{duration:0.5,y:-20,opacity:0,onComplete:()=>button.current.remove()})
      setAnswered(correctAnswers)
      setSubmit(true)
      onSubmit(score)
      setTimeout(()=>{
        exercice.items.forEach((item,index)=>{
            let event=new CustomEvent('exerciceAnswered', { detail: { name:'exo'+exoIndex+''+index} });
            document.dispatchEvent(event)
        })
      },2000)
    }
  }


    const correct=exercice.items.map((item)=>item.solution)
    const [answered,setAnswered]=useState(false)
    const [answers,setAnswers]=useState([null,null,null])
  return (
    <SubmitContext.Provider value={submit}>
      <div className="w-[90%] relative left-[5%] my-[50px]" key={exoIndex}>
        <h2 className="my-10 text-2xl font-bold text-gray-800">{exercice.question}</h2>
        <div className="flex w-full h-fit flex-nowrap">
        {exercice.items.map((item,index)=>(
            <Item 
            item={item} 
            index={index} 
            answered={answered}
            exoIndex={exoIndex}
            onChoice={(answer,index)=>{
              let answersPrime=[...answers]
              answersPrime[index]=answer;
              setAnswers(answersPrime)}}
            showButton={()=>{
                gsap.to(button.current,{delay:0.3,duration:1,y:-20,opacity:1})
              }}
            />
              ))}
        </div>
        <div className="h-[70px] my-[30px]">
          <button ref={button} id="submit" className="opacity-[0] float-right relative cursor-pointer right-[5%] bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
           onClick={() =>{
            calculateAnswers(answers)
          }}>Submit</button>
        </div>
      </div>
    </SubmitContext.Provider>
  );
}

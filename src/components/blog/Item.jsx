import { useState } from 'react';

export default function Item({item, index, answered,onChoice}) { 
  let [answer,setAnswer]=useState('') 
  let str=""
  if(answered){
    if(answered[index]){
      str="bg-green-200"
    }
    else{
      str="bg-red-200"
    }
  }
  return (
    <>
      <div className={"mx-4 my-2 p-4 w-[400px] h-fit "+str+" border-gray-300 border-2 rounded-md shadow-[0px_2px_5px_0px_#d9d9d9]"} style={{fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif', color: 'rgb(55, 65, 81)'}} key={index}>
        <div className="w-[90%] relative mb-[20px] left-[5%] h-[300px] bg-purple-500 rounded-[10px]">
          </div>
          <div className="radio-group my-[20px]">
            {item.options.map((option,i) => (
              <div key={option.title} 
              className="radio-option my-6 grid grid-cols-2 gap-[20px] relative left-[4%]">
                <label htmlFor={`${item.title}-${option.title}`}>
                  {option.description}
                </label>
                <input
                  type="radio"
                  name={item.title}
                  value={option.index}
                  className=" self-center h-[80%] mx-auto"
                  onChange={(e) => {
                    setAnswer(i)
                    onChoice(i,index)
                  }}
                />
              </div>
            ))}
          </div>
      </div>
    </>
  );
}

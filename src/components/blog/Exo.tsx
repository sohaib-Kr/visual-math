import { useState } from 'react';

export default function Exo({exo, index, onChoice}) { 
  let [answer,setAnswer]=useState('') 
  return (
    <>
      <div className="question row-[1] col-[1] w-[400px] h-full border-black border-2 rounded-md" key={index}>
        <p>{exo.title}</p>
        <p>{exo.description}</p>
          <div className="radio-group">
            {exo.options.map((option,i) => (
              <div key={option.title} className="radio-option">
                <input
                  type="radio"
                  name={exo.title}
                  value={option.index}
                  className="w-full h-full"
                  onChange={(e) => {
                    setAnswer(i)
                    onChoice(i,index)
                  }}
                />
                <label htmlFor={`${exo.title}-${option.title}`}>
                  {option.description}
                </label>
              </div>
            ))}
          </div>
      </div>
    </>
  );
}

import { useState } from 'react';

export default function Exo({exo, index, correct}) {
  const [choice, setChoice] = useState('')
  
  return (
    <>
    <div className="grid grid-cols-[100%] grid-rows-[100%]">
      <div className="result row-[1] col-[1] w-[400px] h-full border-black border-2 rounded-md" key={index}>
        <div className="opacity-[0] hidden">
          <p>{exo.title}</p>
          <p>{exo.description}</p>
          <div>
            <div>
              <p>{choice == correct ? 'true' : 'false'}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="question row-[1] col-[1] w-[400px] h-full border-black border-2 rounded-md" key={index}>
        <p>{exo.title}</p>
        <p>{exo.description}</p>
        <div>
          <div className="radio-group">
            {exo.options.map((option) => (
              <div key={option.title} className="radio-option">
                <input
                  type="radio"
                  id={`${exo.title}-${option.title}`}
                  name={exo.title}
                  value={option.title}
                  className="w-full h-full"
                  onChange={() => setChoice(option.title)}
                />
                <label htmlFor={`${exo.title}-${option.title}`}>
                  {option.description}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    <button onClick={() =>{
      document.getElementsByClassName('question')[0].style.opacity=0
      document.getElementsByClassName('result')[0].style.opacity=1
    }}>Submit</button>
    </>
  );
}

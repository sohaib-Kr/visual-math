import { useRef } from 'react';
import { useSubmit } from './Exercice.jsx'
export default function RadioGroup({item,onChoice,index,update}) {
  const submit = useSubmit();
  let ref=useRef(null)
  if(submit && update){
    ref.current.remove()
  }
  return (
    <>
          <div ref={ref} className={"grid radio-group my-[20px] col-[1/2] row-[1/2]"}>
            {item.options.map((option,i) => (
              <div key={option.title} 
              className="radio-option grid grid-cols-[8%_92%] relative left-[10%] self-center gap-[20px]">
                
                <input
                  type="radio"
                  name={item.title}
                  value={option.index}
                  className="w-[25px] h-[25px] self-center"
                  onChange={(e) => {
                    onChoice(i,index)
                  }}
                />
                <label htmlFor={`${item.title}-${option.title}`} className="text-lg font-medium tracking-widest text-gray-600" style={{ letterSpacing: '0.05em', color: 'rgb(87, 95, 105)' }}>
                {option.description}
              </label>
              </div>
            ))}
          </div>
    </>
  );
}

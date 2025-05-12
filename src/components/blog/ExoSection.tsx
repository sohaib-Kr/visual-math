import { useState } from 'react';
import Exo from './Exo.tsx'

export default function ExoSection({exercices}){
    const correct=['option1','option2','option3']
  return (
    <div>
      <div className="flex w-full h-full flex-nowrap">
      {exercices.map((exo,index)=>(
          <Exo exo={exo} index={index} correct={correct[index]}/>
            ))}
      </div>
    </div>
  );
}


import { vMathAnimation } from "@/lib/library";

const anim = new vMathAnimation('chainGroup');



anim.setInit(function(){


    let main=anim.frame.group()

   let complex={}
const vertices={
    a:[-200,200],
    b:[-100,-200],
    c:[200,100],
    d:[100,100],
    e:[100,200],
}
const edges=['a,b','b,c','a,c']
const complexArray=Object.keys(vertices).map((key)=>{
    return {
        name:key,
        elem:main.circle(10).attr({...anim.config().indicationPoint,opacity:0.2}).center(vertices[key][0],vertices[key][1])
    }
})

complexArray.forEach((simplex)=>{
    complex[simplex.name]=simplex.elem
})

function generateCombinations(chars) {
    const result = [];
    // Helper function to generate combinations of a specific length
    function backtrack(start, current, length) {
        if (current.length === length) {
            result.push(current.slice());
            return;
        }
        
        for (let i = start; i < chars.length; i++) {
            current.push({
                name:chars[i],
                elem:complex[chars[i]]
            });
            backtrack(i + 1, current, length);
            current.pop();
        }
    }
    
    // Generate combinations of all lengths from 1 to chars.length
    for (let length = 1; length <= chars.length; length++) {
        backtrack(0, [], length);
    }
    return result;
}


function groupByLength(input) {
    const output = [];
    
    // Find the maximum length in the input array
    let maxLength = 0;
    for (const subArray of input) {
      if (subArray.length > maxLength) {
        maxLength = subArray.length;
      }
    }
    
    // Initialize output with empty arrays for each possible length
    for (let i = 0; i <= maxLength; i++) {
      output.push([]);
    }
    
    // Distribute elements to their corresponding subarrays
    for (const element of input) {
      const length = element.length;
      output[length].push(element);
    }
    
    // Remove empty arrays (for lengths that didn't exist in input)
    // Or keep them if you want to preserve all possible lengths
    return output.filter(subArray => subArray.length > 0);
  }

    main.transform({translate:[600,400]})

    const chainGroup = generateCombinations(Object.keys(vertices));

    const groupedChains = groupByLength(chainGroup);

    groupedChains.forEach((line,index)=>{
        let lineStrArray=[]
        let text
        line.forEach((chain,j)=>{
            if(j==Math.min(3,line.length)){
                lineStrArray.push('\\cdots')
                return
            }
            else if(j<3){
                lineStrArray.push(chain.map((simplex)=>simplex.name).join('+'))
                lineStrArray.push('\\ , \\ ')
            }
        })
        line=line.slice(0,3)
        text=anim.elements.dynamicInlineLatexText({
            inputString:lineStrArray,
            textStyle:{fontSize:'40px',color:'#ff99a7'}})
            .addTo(main)
        .move(-500,index*100-400)
        line.forEach((chain,index2)=>{
            index2=index2*2
            console.log(text.node.children[index2])
            Object.assign(text.node.children[index2].style,{
                'background-color':'rgba(255, 153, 153,0.2)',
                'border-radius':'30px',
                'padding-left':'18px',
                'padding-right':'18px',
                'padding-top':'5px',
                'padding-bottom':'5px',
                'cursor':'pointer',
                'transition':'all 0.3s ease-in-out'
            })
            // Store animations for each simplex
const activeAnimations = new WeakMap();

text.node.children[index2].addEventListener('mouseenter', () => {
    chain.forEach((simplex) => {
        // Cancel any ongoing animation for this simplex
        const existingAnimation = activeAnimations.get(simplex.elem);
        if (existingAnimation) {
            existingAnimation.unschedule();
        }
        
        // Start new animation and store it
        const animation = simplex.elem.animate({ duration: 300 }).attr({ opacity: 1 });
        activeAnimations.set(simplex.elem, animation);
    });
});

text.node.children[index2].addEventListener('mouseleave', () => {
    chain.forEach((simplex) => {
        // Cancel any ongoing animation for this simplex
        const existingAnimation = activeAnimations.get(simplex.elem);
        if (existingAnimation) {
            existingAnimation.unschedule();
        }
        
        // Start new animation and store it
        const animation = simplex.elem.animate({ duration: 300 }).attr({ opacity: 0.2 });
        activeAnimations.set(simplex.elem, animation);
    });
})
        })
    })

    

    anim.initSteps([
        ()=>{
        }
    ])
})

export default anim

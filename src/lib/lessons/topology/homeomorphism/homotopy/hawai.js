import { CartPlane } from '@/lib/utiles/vector/index.js';
import { vMathAnimation } from '@/lib/library.js';
import Vivus from 'vivus'
import {createIndicator,updateIndicator} from '@/lib/utiles/topoPath.js'
import gsap from 'gsap'
import { animateMotion } from '@/lib/utiles/vector/animateMotion';

function init(){
    const anim = new vMathAnimation('hawai');
    const draw=anim.frame
    const plane=new CartPlane({draw, unit:{u:30,v:30}})
    const config=anim.config()
    const mainSpace=[]
    for (let i = 1; i < 15; i++) {
        mainSpace.push(plane.plane.path(`M 0 0 A 1 1 0 0 0 ${500/i} 0 A 1 1 0 0 0 0 0`).
        attr({...config.path2}))
        
    }

    function generatePaths(commands,cb=()=>{}){
        const group=plane.plane.group()
        commands.forEach((command,index)=>{
            command&&mainSpace[index].clone().addTo(group).attr({...config.path1,opacity:1})
            
            anim.vivusRender({elem:group.node,duration:50,callback:()=>cb()})
        })
        return group
    }

    function generatePathsNoVivus(commands,previousGroup=null,cb=()=>{}){
        previousGroup&&previousGroup.animate(500).attr({opacity:0}).after(()=>{

            previousGroup.remove()
  
            
        })
        let group=plane.plane.group()
        setTimeout(()=>{
            commands.forEach((command,index)=>{
                command&&mainSpace[index].clone().addTo(group).attr({...config.path1,opacity:1})
            })
            group.attr({opacity:0}).animate(500).attr({opacity:1}).after(()=>cb())},500) 
        return group
    }
    function processBinaryString(binaryStr, parentElement) {
        // 1. Ensure the string is <= 8 characters
        console.log(binaryStr)
        const truncatedStr = binaryStr.slice(0, 8);
        
        // 2. Pad with zeros to make it exactly 8 characters
        const paddedStr = truncatedStr.padEnd(8, '0');
        // 3. Map each character to the span structure
        const spanStrings = Array.from(paddedStr).map(char => 
            `<span class="mord"><span class="mord">${char}</span></span>`
        );
        
        // 4. Combine all spans into one string
        const combinedHTML = spanStrings.join('');
        
        // 5. Append to parent element
        gsap.to(parentElement,{duration:0.5,opacity:0}).then(()=>{
            parentElement.innerHTML = combinedHTML;
            gsap.to(parentElement,{duration:0.5,opacity:1})
        })
        
        // Return the padded string for potential further use
        return paddedStr;
    }
    

// Function to append the input to a parent element
function addBinaryRestrictions(inputElement, maxLength = 8) {
    // Set maxlength attribute
    inputElement.maxLength = maxLength;
    
    // Add input validation
    const validateInput = (e) => {
        // Remove any characters that aren't 0 or 1
        inputElement.value = inputElement.value.replace(/[^01]/g, '');
        
        // Truncate if exceeds max length (though maxlength should handle this)
        if (inputElement.value.length > maxLength) {
            inputElement.value = inputElement.value.slice(0, maxLength);
        }
    };
    
    // Add visual feedback for invalid input
    const showInvalidFeedback = (e) => {
        if (e.key !== '0' && e.key !== '1' && !e.ctrlKey && !e.metaKey && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
            const originalBorder = inputElement.style.border;
            inputElement.style.border = '2px solid red';
            setTimeout(() => {
                inputElement.style.border = originalBorder;
            }, 300);
        }
    };
    
    // Add event listeners
    inputElement.addEventListener('input', validateInput);
    inputElement.addEventListener('keydown', showInvalidFeedback);
    
    // Return a cleanup function
    return () => {
        inputElement.removeEventListener('input', validateInput);
        inputElement.removeEventListener('keydown', showInvalidFeedback);
    };
}



    let groupHolder
    
    let secondTextHolder=anim.createTextSpace()
    let textHolder=anim.createTextSpace()
    let thirdTextHolder=anim.createTextSpace()
    let binDecod
anim.initSteps([
    ()=>{
        draw.animate(700).transform({scale:1.5,origin:[700,0]})
        secondTextHolder.update({newText:`This is the hawaian earing space defined as the union 
            of circles centered at (0,0) with radius 1/n for n=1,2,3,...`,fade:true})
        textHolder.update({newText:'\\mathbb{H} = \\bigcup_{n=1}^{\\infty} C_n \\subset \\mathbb{R}^2',fade:true,latex:true})
        thirdTextHolder.update({newText:'\\left\\{ C_1 ,C_2 , C_3,C_4,C_5,C_6 ... \\right\\}',fade:true,latex:true})
    },
    ()=>{
        let elems=thirdTextHolder.textSpace.querySelectorAll('.mord')
        anim.pause()
        let i=0
        elems=Array.from(elems).filter((elem,index)=>index%3==0)
        elems.forEach((elem,index)=>{
            gsap.to(elem,{opacity:0.3,duration:0.5})
        })
        let interval=setInterval(()=>{
            gsap.to(elems[i],{opacity:1,duration:0.5});
            (i>=1)&&gsap.to(elems[i-1],{opacity:0.3,duration:0.5});
            (i!=0)&&mainSpace[i-1].animate(500).attr({opacity:0.4})
            mainSpace[i].animate(500).attr({opacity:1})
            i++
            if(i==6){
                elems.forEach((elem)=>{
                    gsap.to(elem,{opacity:1,duration:0.5})
                })
                clearInterval(interval)
                anim.play()
            }
        },1200)
    },
    ()=>{
        secondTextHolder.update({newText:`The function | encodes the loop to a binary string by
            indicating in each index i wether the loop is going around the circle | or not
            `,fade:true,
            callback:()=>{
                secondTextHolder.addLatex(['\\omega','C_i'])
            }
        })
        
        mainSpace.forEach((path)=>{
            path.animate(500).attr({opacity:1})
        })
    },
    ()=>{
        gsap.to(thirdTextHolder.textSpace,{opacity:0,duration:0.5}).then(()=>{
            thirdTextHolder.textSpace.remove()
        })
        mainSpace.forEach((path)=>{
            path.animate(500).attr({opacity:0.4})
        })
    },
    ()=>{
        textHolder.update({newText:'\\omega(\\lambda)={0}{0}{0}{0}{0}{0}{0}....',fade:true,latex:true})
    },
    ()=>{
        binDecod=textHolder.textSpace.querySelectorAll('.mord')
        binDecod.forEach((elem,index)=>{
            (index>1&&index<8)&&(elem.innerHTML='0')
        })
    },


    ()=>{
        binDecod=textHolder.textSpace.querySelectorAll('.mord')
        Array.from(binDecod).forEach((elem,index)=>{
            (index>1)&&(elem.innerHTML=0)
        })
        gsap.to(binDecod[2],{opacity:0,duration:0.5}).then(()=>{
            binDecod[2].innerHTML='1'
            gsap.to(binDecod[2],{opacity:1,duration:0.5})
        })
        groupHolder=generatePaths([true])
    },
    ()=>{
        gsap.to([binDecod[2],binDecod[3]],{opacity:0,duration:0.5}).then(()=>{
            binDecod[2].innerHTML='0'
            binDecod[3].innerHTML='1'
            gsap.to([binDecod[2],binDecod[3]],{opacity:1,duration:0.5})
        });
        [...groupHolder.children()].forEach((path)=>{
            path.animate(200).attr({opacity:0}).after(()=>path.remove())
        })
        groupHolder=generatePaths([false,true])
    },


    ()=>{
        gsap.to([binDecod[2],binDecod[3],binDecod[4]],{opacity:0,duration:0.5}).then(()=>{
            binDecod[2].innerHTML='1'
            binDecod[3].innerHTML='0'
            binDecod[4].innerHTML='1'
            gsap.to([binDecod[2],binDecod[3],binDecod[4]],{opacity:1,duration:0.5})
        });
        [...groupHolder.children()].forEach((path)=>{
            path.animate(200).attr({opacity:0}).after(()=>path.remove())
        })
        groupHolder=generatePaths([true,false,true])
    },


    ()=>{
        gsap.to([binDecod[4],binDecod[5]],{opacity:0,duration:0.5}).then(()=>{
            binDecod[4].innerHTML='0'
            binDecod[5].innerHTML='1'
            gsap.to([binDecod[4],binDecod[5]],{opacity:1,duration:0.5})
        });
        [...groupHolder.children()].forEach((path)=>{
            path.animate(200).attr({opacity:0}).after(()=>path.remove())
        })
        groupHolder=generatePaths([true,false,false,true])
    },
    ()=>{
        [...groupHolder.children()].forEach((path)=>{
            path.animate(200).attr({opacity:0}).after(()=>path.remove())
        })
        secondTextHolder.update({newText:'write down the binary string to generate the according loop',fade:true})
        textHolder.update({newText:'\\omega(\\lambda)={0}{0}{0}{0}{0}{0}{0}{0}',fade:true,latex:true})

        let booleanArray=[]
        let binaryString
        anim.pause()
        let control = anim.addControl({
            name: 'binary',
            type: 'text',
            listener: (e) => {
                // Get the input value
                binaryString = e.target.value;
                
                // Convert to array of booleans
                booleanArray = Array.from(binaryString).map(char => char === '1');
                
        }});
        let submit=anim.addControl({name:'generate',type:'button',listener:(e)=>{
            if(groupHolder&& [...groupHolder.children()].length>0){
                submit.node.disabled=true;
                [...groupHolder.children()].forEach((path)=>{
                    path.animate(200).attr({opacity:0}).after(()=>path.remove())
                })
            }
            
            setTimeout(()=>{
                groupHolder=generatePaths(booleanArray)
                submit.node.disabled=false
            }
                ,500)
            processBinaryString(binaryString,textHolder.textSpace.querySelectorAll('.base')[1])
        }})
        addBinaryRestrictions(control.node)
        let next=anim.addControl({name:'next',type:'button',listener:(e)=>{
            anim.play()
            control.kill()
            submit.kill()
            next.kill()
        }})
    },
    ()=>{
        [...groupHolder.children()].forEach((path)=>{
            path.animate(200).attr({opacity:0}).after(()=>path.remove())
        })
        secondTextHolder.update({newText:'the function | calculates the real number associated to the binary string',fade:true,callback:()=>{
            secondTextHolder.addLatex(['\\phi'])
        }})
        textHolder.update({
            newText:'\\phi(\\omega(\\lambda))=\\phi({0}{0}{0}{0}{0}{0}{0}{0})\\newline=0.01',
            fade:true,
            latex:true})
    },
    ()=>{
        
        anim.pause()
        let data=[
            {
              bin: [false, true, true, false, true, false, true, false],
              value: 0.4140625
            },
            {
              bin: [false, true, true, true, true, true, false, false],
              value: 0.484375
            },
            {
              bin: [false, true, false, true, false, true, false, false],
              value: 0.328125
            },
            {
              bin: [true, true, false, false, true, false, true, false],
              value: 0.7890625
            },
            {
              bin: [true, true, true, true, true, true, true, false],
              value: 0.9921875
            },
          ]
        let i=0
        let I=setInterval(()=>{
            groupHolder=generatePathsNoVivus(data[i].bin,groupHolder)
            i++
            if(i==data.length){
                clearInterval(I)
                anim.play()
                
                return null;
            }
            let elem=textHolder.textSpace.querySelectorAll('.base')[1]
            gsap.to(elem,{duration:0.5,opacity:0,onComplete:()=>{
                elem.innerHTML='<span class="strut" style="height: 1em; vertical-align: -0.25em;"></span><span class="mord mathnormal">ϕ</span><span class="mopen">(</span>'+(data[i].bin.map((bit)=>bit?'1':'0')).join('')+'<span class="mclose">)</span>'
                gsap.to(elem,{duration:0.5,opacity:1})
            }})

            let elem2=textHolder.textSpace.querySelectorAll('.base')[3].querySelectorAll('.mord')[0]
            gsap.to(elem2,{duration:0.5,opacity:0,onComplete:()=>{
                elem2.innerHTML=(data[i].value).toFixed(5)
                gsap.to(elem2,{duration:0.5,opacity:1})
            }})


        },2000)
    },
//     ()=>{
//         secondTextHolder.update({newText:'By composing | and | we get a function that maps the loop to a real number in |(0,1)|',fade:true,callback:()=>{
//             secondTextHolder.addLatex(['\\phi','\\omega','\\left(0,1\\right)'])
//         }})
//         textHolder.update({newText:`f(\\lambda)=\\phi(\\omega(\\lambda))\\in (0,1) \\newline
// \\forall \\lambda \\in \\mathcal{H^*}`,fade:true,latex:true})
//     },
//     ()=>{
//         secondTextHolder.update({newText:'the function | is a surjection from | to |',fade:true,callback:()=>{
//             secondTextHolder.addLatex(['f','\\mathcal{H^*}','\\mathbb{(0,1)}'])
//         }})
//         textHolder.update({newText:`\\forall x \\in (0,1) \ \\exists \\ (b_n)=(0,1,1,0\\ ...) . \\newline
// f\\big( (b_n)_{n=1}^{\\infty} \\big) = \\sum_{n=1}^{\\infty} \\frac{b_n}{2^n}=x \\newline
// (b_n)=\\omega(\\lambda) \\ . \\ \\exists \\lambda \\in \\mathcal{H^*}`,fade:true,latex:true})
//     }
])
return anim
}
export const anim = init();
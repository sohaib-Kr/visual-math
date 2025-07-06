import gsap from 'gsap';
import katex from 'katex';
export function sideBar(id){
    return{
        createText(){
            const textSpace = document.getElementById(id)
                .parentElement.querySelector('.control').children[0]
                .appendChild(document.createElement('div'));
            
            textSpace.className = 'textSpace font-[merriweather] text-gray-600 text-[18px] tracking-[1px] leading-[1.8] mb-7';
    
            const obj = {
                textSpace,
                update: function({ newText, fade = false, latex = false, callback = () => {} }) {
                    if (!latex) {
                        if (fade) {
                            const tween = gsap.to(textSpace, {
                                duration: 0.5,
                                y: -10,
                                opacity: 0,
                                onComplete: () => {
                                    textSpace.innerHTML = newText;
                                    callback();
                                    gsap.to(textSpace, { duration: 0.5, y: 10, opacity: 1 });
                                }
                            });
                        } else {
                            textSpace.innerHTML = newText;
                            callback();
                        }
                    } else if (fade) {
                        gsap.to(textSpace, {
                            duration: 0.5,
                            y: -10,
                            opacity: 0,
                            onComplete: () => {
                                textSpace.innerHTML = '';
                                katex.render(newText, textSpace, { throwOnError: true, displayMode: false });
                                gsap.to(textSpace, { duration: 0.5, y: 10, opacity: 1 });
                            }
                        });
                    } else {
                        textSpace.innerHTML = '';
                        katex.render(newText, textSpace, {throwOnError: true, displayMode: false});
                    }
                    return this;
                },
                 addLatex: function(arrayOfLatex) {
                                // Get current text content
                                let currentContent = textSpace.textContent;
                                // Split by pipe character and trim whitespace
                                let textParts = currentContent.split('|').map(part => part.trim());
                                // Combine text parts with latex spans
                                let newHTML = '';
                                for (let i = 0; i < textParts.length; i++) {
                                    newHTML += textParts[i];
                                    // Add LaTeX span if we have a corresponding latex string
                                    if (arrayOfLatex[i]) {
                                        newHTML += ` <span class="latex-equation">${arrayOfLatex[i]}</span> `;
                                    }
                                }
                                
                                // Update the content
                                textSpace.innerHTML = newHTML;
                                
                                // Render all LaTeX spans
                                const latexSpans = textSpace.querySelectorAll('.latex-equation');
                                latexSpans.forEach((span, index) => {
                                    try {
                                        katex.render(arrayOfLatex[index], span, {
                                            throwOnError: true,
                                            displayMode: false
                                        });
                                    } catch (e) {
                                        console.error("KaTeX rendering error:", e);
                                        span.textContent = arrayOfLatex[index];
                                    }
                                });
                                
                                return this;
                            }
            }
            return obj
        },
        createRangeInput({name,listener,latex=false}){
            const control = { node: null, listener, kill: null };
            let input;
            const wrapper = document.createElement('div');
            wrapper.className = 'flex items-center gap-2';
            wrapper.innerHTML = `<span>${name}</span><input type="range" min="0" max="100" value="0">`;
            input = wrapper;
    
            input.style.position = 'relative';
            input.style.right = '10%';
            // input.children[1].style.width = '75%';
            // input.children[1].style.marginTop = '10px';
            // input.children[1].style.marginBottom = '10px';
            input.children[1].addEventListener('input', control.listener, { passive: true });
    
            input.children[0].style.fontFamily = 'poppins';
            input.children[0].style.fontSize = '20px';
            input.children[0].style.color = '#718096';
            input.children[0].style.marginTop = '10px';
            input.children[0].style.marginBottom = '10px';
            wrapper.querySelector('input').className = 'rangeInput';
    
            if (latex) {
                katex.render(name, input.children[0], { throwOnError: true, displayMode: false });
            }
    
            control.kill = () => {
                input.children[1].removeEventListener('input', control.listener);
                gsap.to(input, { duration: 0.5, y: -10, opacity: 0, onComplete: () => input.remove() });
            };
            control.node = input;
            const container = document.getElementById(id).parentElement.querySelector('.control').children[1];
            container.appendChild(input);
            gsap.to(input, { duration: 0.5, y: 10, opacity: 1 });
            return control
        },
        createTextInput({name,listener}){
            const control = { node: null, listener, kill: null };
            let input = document.createElement('input');
            input.type = 'text';
            input.placeholder = name || '';

            // Add styling to the input element
            Object.assign(input.style, {
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.3s, box-shadow 0.3s',
                width: '200px',
                boxSizing: 'border-box',
                backgroundColor: '#fff',
                color: '#333',
                margin: '4px 0'
            });

            // Add focus styles
            input.addEventListener('focus', () => {
                input.style.borderColor = '#4285f4';
                input.style.boxShadow = '0 0 0 2px rgba(66, 133, 244, 0.2)';
            });

            input.addEventListener('blur', () => {
                input.style.borderColor = '#ccc';
                input.style.boxShadow = 'none';
            });

            input.addEventListener('input', control.listener);
            control.kill = () => {
                input.removeEventListener('input', control.listener);
                gsap.to(input, { duration: 0.5, y: -10, opacity: 0, onComplete: () => input.remove() });
            };
            control.node = input;
            const container = document.getElementById(id).parentElement.querySelector('.control').children[1];
            container.appendChild(input);
            gsap.to(input, { duration: 0.5, y: 10, opacity: 1 });
            return control
        },
        createButton({name,listener}){
            const control = { node: null, listener, kill: null };
            let input = document.createElement('button');
            input.className = 'font-[poppins] my-[15px] p-[13px] opacity-[0] leading-none px-[9px] text-[21px] cursor-pointer w-fit rounded-md bg-[#b6638b] text-white';
            input.textContent = name;

            input.addEventListener('mouseover', () => {
                gsap.to(input, { duration: 0.3, backgroundColor: '#9c4971' });
            });

            input.addEventListener('mouseleave', () => {
                gsap.to(input, { duration: 0.3, backgroundColor: '#b6638b' });
            });

            input.addEventListener('click', control.listener);
            control.kill = () => {
                input.removeEventListener('click', control.listener);
                gsap.to(input, { duration: 0.5, y: -10, opacity: 0, onComplete: () => input.remove() });
            };
            control.node = input;
            const container = document.getElementById(id).parentElement.querySelector('.control').children[1];
            container.appendChild(input);
            gsap.to(input, { duration: 0.5, y: 10, opacity: 1 });
            return control
        }
    }
}    
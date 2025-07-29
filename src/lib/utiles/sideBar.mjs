import gsap from 'gsap';
import katex from 'katex';
export function sideBar(id){
    return{
        createText(){
            const textSpace = document.getElementById(id)
                .parentElement.querySelector('.control').children[0]
                .appendChild(document.createElement('div'));
            
            textSpace.className = 'textSpace break-words font-[merriweather] text-gray-600 text-[18px] tracking-[1px] leading-[1.8] mb-7';

        
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
                                katex.render(newText, textSpace, { throwOnError: true, displayMode:false})
                                gsap.to(textSpace, { duration: 0.5, y: 10, opacity: 1 })
                                callback()
                            }
                        });
                    } else {
                        textSpace.innerHTML = '';
                        katex.render(newText,textSpace, { throwOnError: true })
                        callback()
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
                },
                appendText: function({ text, fade = false, latex = false, callback = () => {} }) {
                    const newEl = document.createElement('span');
                    if (!latex) {
                        newEl.textContent = text;
                        
                        if (fade) {
                          newEl.className = 'opacity-[0]';
                          textSpace.appendChild(newEl);
                          gsap.to(newEl, { 
                            duration: 1, 
                            y: 10, 
                            opacity: 1,
                            onComplete: callback
                          });
                        } else {
                          textSpace.appendChild(newEl);
                          callback();
                        }
                      } else {
                        
                        try {
                            katex.render(text,newEl, { throwOnError: true, displayMode: false });
                          
                          textSpace.appendChild(newEl);
                          
                          if (fade) {
                          newEl.className = 'opacity-[0]';
                            gsap.to(newEl, { 
                              duration: 1, 
                              y: 10, 
                              opacity: 1,
                              onComplete: callback
                            });
                          } else {
                            newEl.classList.remove('opacity-[0]');
                            callback();
                          }
                        } catch (e) {
                          console.error("KaTeX error:", e);
                          const fallback = document.createElement('span');
                          fallback.textContent = text;
                          textSpace.appendChild(fallback);
                          callback();
                        }
                      }
                      return newEl;
                  
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
        
        

        createButtonGroup({ buttons, listener, cooldown = false }) {
          const controls = [];
          
          // Create container for the button group
          const container = document.getElementById(id).parentElement.querySelector('.control').children[1]
          
          const buttonGroup = document.createElement('div');
          buttonGroup.className = 'button-group flex gap-2';
          let currentSelected = null;
          let isCooldown = false;
      
          // Function to enable/disable all buttons
          const setButtonsDisabled = (disabled) => {
              buttonGroup.querySelectorAll('button').forEach(btn => {
                  btn.style.cursor = disabled ? 'not-allowed' : 'pointer';
                  btn.style.opacity = disabled ? '0.7' : '1';
                  btn.disabled = disabled;
              });
          };
      
          buttons.forEach(({ name, value }) => {
              const button = document.createElement('button');
              button.className = 'font-[poppins] py-[13px] px-[20px] leading-none text-[16px] cursor-pointer rounded-md bg-[#b6638b] text-white transition-all duration-300';
              button.textContent = name;
              button.dataset.value = value;
              
              // Hover effects
              button.addEventListener('mouseover', () => {
                  if (value !== currentSelected && !isCooldown) {
                      gsap.to(button, { backgroundColor: '#9c4971', duration: 0.3 });
                  }
              });
              
              button.addEventListener('mouseleave', () => {
                  if (value !== currentSelected && !isCooldown) {
                      gsap.to(button, { backgroundColor: '#b6638b', duration: 0.3 });
                  }
              });
              
              // Click handler
              button.addEventListener('click', () => {
                  if (isCooldown || value === currentSelected) return;
                  
                  isCooldown = true;
                  if (cooldown) setButtonsDisabled(true);
                  
                  // Update visual selection
                  buttonGroup.querySelectorAll('button').forEach(btn => {
                      gsap.to(btn, { 
                          backgroundColor: '#b6638b',
                          scale: 1,
                          duration: 0.3
                      });
                  });
                  
                  gsap.to(button, { 
                      backgroundColor: '#9c4971',
                      scale: 0.95,
                      duration: 0.3
                  });
                  
                  currentSelected = value;
                  listener(value); // Call the listener with the selected value
                  
                  if (cooldown) {
                      setTimeout(() => {
                          isCooldown = false;
                          setButtonsDisabled(false);
                          
                          // Restore hover state for currently selected button
                          if (currentSelected === value) {
                              gsap.to(button, { 
                                  backgroundColor: '#9c4971',
                                  duration: 0.3
                              });
                          }
                      }, cooldown);
                  } else {
                      isCooldown = false;
                  }
              });
              
              buttonGroup.appendChild(button);
              controls.push({
                  node: button,
                  value,
                  kill: () => {
                      button.removeEventListener('click', listener);
                      gsap.to(button, { 
                          duration: 0.5, 
                          y: -10, 
                          opacity: 0, 
                          onComplete: () => button.remove() 
                      });
                  }
              });
          });
          
          container.appendChild(buttonGroup);
          
          return {
              nodes: controls,
              getSelected: () => currentSelected,
              setSelected: (value) => {
                  const button = buttonGroup.querySelector(`[data-value="${value}"]`);
                  if (button && !isCooldown) button.click();
              },
              kill: () => {
                  controls.forEach(control => control.kill());
                  buttonGroup.remove();
              }
          };
      },
      






      createButton({ name, listener, cooldown = false }) {
          const control = { node: null, listener, kill: null };
          let input = document.createElement('button');
          input.className = 'font-[poppins] my-[15px] p-[13px] opacity-[0] leading-none px-[9px] text-[21px] cursor-pointer w-fit rounded-md bg-[#b6638b] text-white';
          input.textContent = name;
          let isCooldown = false;
      
          input.addEventListener('mouseover', () => {
              if (!isCooldown) {
                  gsap.to(input, { duration: 0.3, backgroundColor: '#9c4971' });
              }
          });
      
          input.addEventListener('mouseleave', () => {
              if (!isCooldown) {
                  gsap.to(input, { duration: 0.3, backgroundColor: '#b6638b' });
              }
          });
      
          const clickHandler = () => {
              if (isCooldown) return;
              
              isCooldown = true;
              control.listener();
              
              if (cooldown) {
                  // Apply cooldown effect
                  const originalText = input.textContent;
                  input.textContent = '...';
                  input.style.cursor = 'not-allowed';
                  
                  setTimeout(() => {
                      isCooldown = false;
                      input.textContent = originalText;
                      input.style.cursor = 'pointer';
                      gsap.to(input, { duration: 0.3, backgroundColor: '#b6638b' });
                  }, cooldown);
              } else {
                  isCooldown = false;
              }
          };
          
          input.addEventListener('click', clickHandler);
          
          control.kill = () => {
              input.removeEventListener('click', clickHandler);
              gsap.to(input, { duration: 0.5, y: -10, opacity: 0, onComplete: () => input.remove() });
          };
          
          control.node = input;
          const container = document.getElementById(id).parentElement.querySelector('.control').children[1]
          container.appendChild(input);
          gsap.to(input, { duration: 0.5, y: 10, opacity: 1 });
          
          return control
      },
    }
}    
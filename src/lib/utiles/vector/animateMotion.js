export function animateMotion({path,duration=1000,callback=()=>{}}){
        this.noField.forEach((vector)=>{
            vector.elem.add(`<animateMotion dur="${duration}ms"
      repeatCount="indefinite"
      path="${path}" />`)
      setTimeout(()=>{
        vector.elem.node.innerHTML=''
        callback()
    },duration)
        })
    }
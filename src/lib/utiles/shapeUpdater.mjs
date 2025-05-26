import gsap from 'gsap'
function createTimeFunc(timeFunc){
    let tFunc=function(t){
        return t
    }
    if(timeFunc==='linear'){
        tFunc=function(t){
            return t
        }
    }
    else if(timeFunc==='easeIn2'){
        tFunc=function(t){
            return t*t
        }
    }
    else if(timeFunc==='easeIn3'){
        tFunc=function(t){
            return t*t*t
        }
    }
    else if(timeFunc==='easeIn4'){
        tFunc=function(t){
            return t*t*t*t
        }
    }
    else if(timeFunc==='easeOut'){
        tFunc=function(t){
            return 1-(1-t)*(1-t)
        }
    }
    else if(timeFunc==='easeOut2'){
        tFunc=function(t){
            return 1-(1-t)*(1-t)*(1-t)
        }
    }
    else if(timeFunc==='easeOut3'){
        tFunc=function(t){
            return 1-(1-t)*(1-t)*(1-t)
        }
    }
    else if(timeFunc==='easeOut4'){
        tFunc=function(t){
            return 1-(1-t)*(1-t)*(1-t)*(1-t)
        }
    }
    return tFunc
}

export class ShapeUpdater{
    #shape
    #matchingSet
    #smoothParams
    #smoothCommands
    constructor({shape,matchingSet,decoded,currentData}){
        this.#shape=shape
        this.#matchingSet=matchingSet
            //this function matches every point with its transformation path and create a function that 
        //updates the shape according to a time variable t

        //we check if the matching set is valid (contains at most all the points)

        for(let key in matchingSet){
            if(!decoded.params.includes(key)){
                throw new Error(`matching set has invalid point: ${key}`)
            }
        }

        //we will create an array indicating the static and 
        // dynamic parts of the path string to generate the needed function
        let smoothTransPathArray=[]
        decoded.commands.forEach((command,key)=>{
            let param=decoded.params[key]
            if(param){
                //in this block we are sure that we aren't in the end of the path
                if(matchingSet[param]){
                    //if the param is in the matching set then it is dynamic
                    //so we add the path and its length to the array
                    if(typeof smoothTransPathArray[smoothTransPathArray.length-1] === 'string'){
                        smoothTransPathArray[smoothTransPathArray.length-1]+=' '+command
                    }
                    else{
                        smoothTransPathArray.push(command)
                    }
                    smoothTransPathArray.push({
                        trajectory:matchingSet[param],
                        length:matchingSet[param].length()})
                }
                else{
                    //if the param is not in the matching set then it is static
                    if(smoothTransPathArray.length>0 && typeof smoothTransPathArray[smoothTransPathArray.length-1] === 'string'){
                    
                        smoothTransPathArray[smoothTransPathArray.length-1]+=' '+command+currentData[param][0]+' '+currentData[param][1]+' '
                        
                    }
                    else{
                        smoothTransPathArray.push(command+' '+currentData[param][0]+' '+currentData[param][1])
                    }
                }
            }
            else{
                smoothTransPathArray.push(command)
            }
        })
        this.#smoothCommands=smoothTransPathArray.filter((elem)=>typeof elem === 'string')
        this.#smoothParams=smoothTransPathArray.filter((elem)=>typeof elem !== 'string')
    }
    
    //here we create the function that will update the shape
    //this function is either used inside setInterval for animation or in an event listener
    update(t){
        let newPath=this.#smoothParams.map((param,index)=>{
            let data=param.trajectory.pointAt(t*param.length)
            return this.#smoothCommands[index]+data.x+' '+data.y
        })
        if(typeof this.#smoothCommands[this.#smoothParams.length] === 'string'){
            newPath.push(this.#smoothCommands[this.#smoothParams.length])
        }
        newPath=newPath.join('')
        this.#shape.plot(newPath)
    }
    kill(){
        Object.values(this.#matchingSet).forEach((trajectory)=>{
            trajectory.node.remove()
        })
    }
    runUpdater({callback=()=>{},duration=0.5,timeFunc='linear'}={}){
        let obj=this
        gsap.to({},{
            duration:duration,
            onUpdate:function(t){
                obj.update(this.progress())
            },
            onComplete:()=>{
                callback()
            }
        })
    }
    runReverseUpdater({callback=()=>{},duration=0.5,timeFunc='linear'}={}){
        let obj=this
        gsap.to({},{
            duration:duration,
            onUpdate:function(t){
                obj.update(1-this.progress())
            },
            onComplete:()=>{
                callback()
            }
        })
    }
}

export function pathDecoder(path){
    if(path.split('|').length%2 ==0){
        throw new Error(`can't parse path: ${path} \n uncorrect number of slashes`)
    }
    let output=path.split('|')
    let commands=[]
    let params=[]
    for (let  i = 0;  i < (output.length-1)/2; i++) {
        commands.push(output[2*i])
        params.push(output[2*i+1])
    }
    commands.push(output[output.length-1])
    return {commands,params}
}
export class TopoPath{
    #frame
    #draggablePoints
    #allowDragFunction
    constructor({frame,codedPath,initialData,attr}){
        this.#frame=frame
        this.#draggablePoints=[]
        this.#allowDragFunction
        //first we check that the coded path is valid (an even number of sign |)
        if(codedPath.split('|').length%2 ==0){
            throw new Error(`can't parse path: ${codedPath} \n uncorrect number of slashes`)
        }
        //now we decode the path
        this.decoded=pathDecoder(codedPath)

        //check if the decoded path params match the initialData
        this.decoded.params.forEach((param)=>{
            if(!initialData[param]){
                throw new Error(`initialData is missing param: ${param}`)
            }
        })
        for(let key in initialData){
            if(!this.decoded.params.includes(key)){
                throw new Error(`initialData has extra param: ${key}`)
            }
        }
        //creating path from decoded path and initial data

        let newPath=this.decoded.commands.map((command,key)=>{
            let param=this.decoded.params[key]
            if(param){
                return command+' '+initialData[param][0]+' '+initialData[param][0]
            }
            else{
                return command
            }
        }).join('')
        //drawing the initial shape
        this.group=this.#frame.group()
        this.shape=this.group.path(newPath).attr(attr)
        //storing the current data as the initial data
        this.currentData=initialData
    }
    createShapeUpdater(matchingSet){
        //this function matches every point with its transformation path and create a function that 
        //updates the shape according to a time variable t

        //we check if the matching set is valid (contains at most all the points)

        for(let key in matchingSet){
            if(!this.decoded.params.includes(key)){
                throw new Error(`matching set has invalid point: ${key}`)
            }
        }

        //we will create an array indicating the static and 
        // dynamic parts of the path string to generate the needed function
        let smoothTransPathArray=[]
        this.decoded.commands.forEach((command,key)=>{
            let param=this.decoded.params[key]
            if(param){
                //in this block we are sure that we aren't in the end of the path
                if(matchingSet[param]){
                    //if the param is in the matching set then it is dynamic
                    //so we add the path and its length to the array
                    smoothTransPathArray.push(command)
                    smoothTransPathArray.push({
                        trajectory:matchingSet[param],
                        length:matchingSet[param].length()})
                }
                else{
                    //if the param is not in the matching set then it is static
                    smoothTransPathArray.push(command+currentData[param][0]+' '+currentData[param][1])
                }
            }
            else{
                smoothTransPathArray.push(command)
            }
        })
        let smoothCommands=smoothTransPathArray.filter((elem)=>typeof elem === 'string')
        let smoothParams=smoothTransPathArray.filter((elem)=>typeof elem !== 'string')
        //here we create the function that will update the shape
        //this function is either used inside setInterval for animation or in an event listener
        //the returned function must be as minimal as possible
        return((t)=>{
            let newPath=smoothParams.map((param,index)=>{
                let data=param.trajectory.pointAt(t*param.length)
                return smoothCommands[index]+data.x+' '+data.y
            }).join('')
            this.shape.plot(newPath)
        })
    }
    refresh(){
        let newPath=this.decoded.params.map((param,key)=>{
            return this.decoded.commands[key]+this.currentData[param][0]+' '+this.currentData[param][1]
        }).join('')
        this.shape.plot(newPath)
    }






    draggable(points,center){
        //this function let us interact with the shape by draggins some of its points
        //first we assure that the draggable points are valid
        points.forEach((point)=>{
            if(!this.decoded.params.includes(point)){
                throw new Error(`draggable point is not valid: ${point}`)
            }
        })

        //we create points data array of pointData object
        let pointsData=points.map((point)=>{
            
            let obj={
                name:point,
                draggable:false,
                handler:function(event,currentData){
                    let currentPos=center
                    let x=event.offsetX-currentPos.x
                    let y=event.offsetY-currentPos.y
                    currentData[this.name][0]=x
                    currentData[this.name][1]=y
                },
                circle:this.group.circle(10).fill('orange').center(this.currentData[point][0],this.currentData[point][1])
            }

            //and here we create the circles used to drag the points
            obj.circle.node.addEventListener('mousedown',()=>obj.draggable=true)
            obj.circle.node.addEventListener('mouseup',()=>obj.draggable=false)

            //here we create the pointData object to store it in pointsData array
            this.#draggablePoints.push(obj)
            return obj
        })
        this.#allowDragFunction=(event,parent)=>{
            pointsData.forEach((pointData)=>{
                if(pointData.draggable){
                    pointData.handler(event,this.currentData)
                    pointData.circle.center(this.currentData[pointData.name][0],this.currentData[pointData.name][1])
                }
            })
            parent.refresh()
        }
        let parent=this
        this.#frame.node.addEventListener('mousemove',(event)=>{
            this.#allowDragFunction(event,parent)
        })
    }


    noneDraggable(){
        this.#draggablePoints.forEach((pointData)=>{
            pointData.circle.remove()
            this.#frame.node.removeEventListener('',()=>pointData.draggable=true)
        })
        
    }
}

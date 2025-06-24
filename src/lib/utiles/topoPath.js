import {ShapeUpdater} from './shapeUpdater.mjs'
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

export function createIndicator(plane){
    let indicator=plane.plane.path('M -10 -10 L 0 0 L -10 10').attr({stroke:'yellow','stroke-width':3,fill:'none'})
    return indicator
}
export function updateIndicator(shape, t, indicator) {
    const length = shape.length();
    const epsilon = 0.001; // Small offset to calculate direction
    
    // Get current position and next position
    let currentPoint,nextPoint
    if(t<1){
        currentPoint = shape.pointAt(t * length);
        nextPoint = shape.pointAt(Math.min((t + epsilon) * length, length));
    }
    else if(t==1){
        currentPoint = shape.pointAt( length-epsilon);
        nextPoint = shape.pointAt(length);
    }
    
    // Calculate the angle in radians
    let angle = Math.atan2(nextPoint.y - currentPoint.y, nextPoint.x - currentPoint.x);
    
    // Convert to degrees and normalize (0-360)
    angle = angle * 180 / Math.PI;
    
    // Apply transformation
    indicator.transform({
        translate: [currentPoint.x, currentPoint.y],
        rotate: angle,
        origin: [0, 0]
    });
}
//The TopoPath element is a path element that can be animated 
//by matching its points with a set of transformation paths
//it is created by decoding a path string that contains the commands and parameters
//the path string is of the form 'M |a| C |b| |c| |d| Q 100 0 |e|'
//by setting the initialData object it create a path linking every point to its initial position
//you can set the path to be draggable by the user by calling the draggable function and passing the points you want to be draggable
//you can also create a smooth transformation for the path by moving each of the points a, b ,c in a certain path
// you do this by creating a path for every point (the path represents the trajectory of the point) and passing it to the createShapeUpdater function
//the createShapeUpdater function returns a function that updates the shape according to a time variable t that goes from 0 to 1
//the returned function can be used for example inside setInterval or as an event listener


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
                return command+' '+initialData[param][0]+' '+initialData[param][1]
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
        return new ShapeUpdater({shape:this.shape,matchingSet,decoded:this.decoded,currentData:this.currentData})
    }
    refresh(){
        let newPath=this.decoded.params.map((param,key)=>{
            return this.decoded.commands[key]+this.currentData[param][0]+' '+this.currentData[param][1]
        }).join('')
        this.shape.plot(newPath)
    }






    draggable(points,center,callbacks={onDragStart:()=>{},onDragEnd:()=>{},onReady:()=>{}}){
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
                circle:this.group.circle(20).fill('orange').center(this.currentData[point][0],this.currentData[point][1])
            }

            //and here we create the circles used to drag the points
            obj.circle.node.addEventListener('mousedown',function(){
                obj.draggable=true
                callbacks.onDragStart()
            })
            obj.circle.node.addEventListener('mouseup',function(){
                obj.draggable=false
                callbacks.onDragEnd()
            })

            //here we create the pointData object to store it in pointsData array
            this.#draggablePoints.push(obj)
            return obj
        })
        this.#allowDragFunction=(event)=>{
            pointsData.forEach((pointData)=>{
                if(pointData.draggable){
                    pointData.handler(event,this.currentData)
                    pointData.circle.center(this.currentData[pointData.name][0],this.currentData[pointData.name][1])
                }
            })
            this.refresh()
        }
        callbacks.onReady()
        this.#frame.node.addEventListener('mousemove',this.#allowDragFunction)
    }


    disableDraggable(){
        this.#draggablePoints.forEach((pointData)=>{
            pointData.circle.remove()
            this.#frame.node.removeEventListener('mousemove',this.#allowDragFunction)
        })
        this.#draggablePoints=[]
        
    }
    label(plane){
        this.decoded.params.forEach((param)=>{
            plane.plane.text(param).move(this.currentData[param][0],this.currentData[param][1]).fill('white')
        })
    }
    createIndicator(plane){
        let indicator=createIndicator(plane)
        return indicator
    }
    updateIndicator(t,indicator){
        updateIndicator(this.shape,t,indicator)
    }
}

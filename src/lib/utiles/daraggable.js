import { pathDecoder } from "./smoothPloter.js";

export class Draggable{
    constructor(path,initialData,attr,plane,draw){
        this.path=path
        this.decoded=pathDecoder(this.path)
        this.heads=[]
        let newPath=this.decoded.commands.map((elem,key)=>{
            if(this.decoded.params[key]){
                let data= initialData[this.decoded.params[key]]
                return elem+data[0]+' '+data[1]
            }
            return elem
        }).join('')
        this.shape=plane.plane.path(newPath).attr({...attr})

        for (let key in initialData){
            let point=initialData[key]
            let head=plane.plane.circle(10).fill('orange').center(point[0],point[1])
            let obj={
                elem:head,
                holding:false,
                x:point[0],
                y:point[1]
            }
            this.heads.push(obj)
            head.node.addEventListener('mousedown',(event)=>{
                obj.holding=true
            })
            head.node.addEventListener('mouseup',(event)=>{
                obj.holding=false
            })
            
        }
        draw.node.addEventListener('mousemove',(event)=>{
            this.heads.forEach((head)=>{
                if(head.holding){
                    let currentPos=plane.center
                    let x=event.offsetX-currentPos.x
                    let y=event.offsetY-currentPos.y
                    head.elem.center(x,y)
                    head.x=x
                    head.y=y
                }
            })
        }) 
        draw.node.addEventListener('mousemove',(event)=>{
            newPath=this.decoded.commands.map((elem,key)=>{
                if(this.heads[key]){
                    return elem+this.heads[key].x+' '+this.heads[key].y
                }
                return elem
            }).join('')
            this.shape.plot(newPath)
            console.log(newPath)
        })
    }
}
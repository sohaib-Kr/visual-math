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
export class SmoothPloter{
    constructor({path,frame,attr}){
        this.path=path
        this.decoded=pathDecoder(this.path)
        this.shape=frame.path('').attr({...attr})
    }
    shapeUpdater(t){
        let newPath=this.decoded.commands.map((elem,key)=>{
            return this.decoded.params[key] ?  elem+eval(this.decoded.params[key]) :elem 
        })
        newPath=newPath.join('')
        this.shape.plot(newPath)
    }
} 
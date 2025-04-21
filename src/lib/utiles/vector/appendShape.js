export function appendShape({points,closed}){
        function getCurrentPos(point){
            point=point.elem
            let x=point.bbox().x+point.transform().translateX
            let y=point.bbox().y+point.transform().translateY
            return {x,y}
        }
        function getPath(points){
            let {x,y}=getCurrentPos(points[0])
            let path=`M ${x} ${y}`
            for (let  i= 0;  i< points.length-2; i+=2) {
                let c=getCurrentPos(points[i+1])
                let e=getCurrentPos(points[i+2])
                path+=`S ${c.x} ${c.y} ${e.x} ${e.y}`
            }
            if(closed){
                path+=`S ${getCurrentPos(points[0]).x} ${getCurrentPos(points[0]).y} ${getCurrentPos(points[0]).x} ${getCurrentPos(points[0]).y}`
            }
            return path
        }
        let shape
        if(closed){
            shape=this.group.path(getPath(points.map((coords)=>this.field[coords.x][coords.y])))
            .fill('white')
        }
        else{
            console.log(points)
            shape=this.group.path(getPath(points.map((coords)=>this.field[coords.x][coords.y])))
            .fill('none')
            .stroke({color:'white',width:3})
        }
        return(setInterval(()=>{
            shape.animate(20).plot(getPath(points.map((coords)=>this.field[coords.x][coords.y])))
        },50))
    }